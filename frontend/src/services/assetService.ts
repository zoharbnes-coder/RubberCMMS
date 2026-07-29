import type {
  Asset,
  AssetStatus,
} from "../types/asset";

import type {
  WorkOrder,
} from "../types/workOrder";

import {
  getActiveAssets,
  getAssetByCode,
  getAssetById,
  getAssetByNumber,
} from "./assetRepository";

import {
  getWorkOrders,
} from "./workOrderService";

/*
 * RubberMIP
 * Asset Operational Service
 *
 * Asset is the single source of truth
 * for equipment identity.
 *
 * Work Orders are linked directly by:
 *
 * WorkOrder.assetCode === Asset.assetCode
 */

const PLANNED_MINUTES_PER_DAY =
  9 * 60;

export type AssetOperationalMetrics = {
  openWorkOrders: number;

  downtimeWorkOrders: number;

  mttrHours: number;

  mtbfHours: number;

  availability: number;

  status: AssetStatus;
};

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function getDateTime(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const time =
    new Date(
      value,
    ).getTime();

  if (
    Number.isNaN(
      time,
    )
  ) {
    return null;
  }

  return time;
}

function getDurationMinutes(
  startValue: string | null,
  endValue: string | null,
): number {
  const startTime =
    getDateTime(
      startValue,
    );

  const endTime =
    getDateTime(
      endValue,
    );

  if (
    startTime === null ||
    endTime === null ||
    endTime <= startTime
  ) {
    return 0;
  }

  return (
    (endTime -
      startTime) /
    60000
  );
}

function getStartOfToday():
  number {
  const now =
    new Date();

  now.setHours(
    0,
    0,
    0,
    0,
  );

  return now.getTime();
}

function getEndOfToday():
  number {
  const now =
    new Date();

  now.setHours(
    23,
    59,
    59,
    999,
  );

  return now.getTime();
}

/* -------------------------------- */
/* Work Order relationship          */
/* -------------------------------- */

function belongsToAsset(
  workOrder: WorkOrder,
  assetCode: string,
): boolean {
  return (
    workOrder.assetCode ===
    assetCode
  );
}

function getAssetWorkOrdersInternal(
  asset: Asset,
): WorkOrder[] {
  return getWorkOrders().filter(
    (workOrder) =>
      belongsToAsset(
        workOrder,
        asset.assetCode,
      ),
  );
}

/* -------------------------------- */
/* Status                           */
/* -------------------------------- */

function calculateAssetStatus(
  workOrders: WorkOrder[],
): AssetStatus {
  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  const hasActiveDowntime =
    activeWorkOrders.some(
      (workOrder) =>
        workOrder.isDowntime,
    );

  if (
    hasActiveDowntime
  ) {
    return "alarm";
  }

  const hasActivePreventiveMaintenance =
    activeWorkOrders.some(
      (workOrder) =>
        workOrder.type ===
        "preventive",
    );

  if (
    hasActivePreventiveMaintenance
  ) {
    return "maintenance";
  }

  if (
    activeWorkOrders.length >
    0
  ) {
    return "warning";
  }

  return "running";
}

/* -------------------------------- */
/* Availability                     */
/* -------------------------------- */

function getTodayDowntimeMinutes(
  workOrder: WorkOrder,
): number {
  if (
    !workOrder.isDowntime ||
    workOrder.type !==
      "fault"
  ) {
    return 0;
  }

  const openedAt =
    getDateTime(
      workOrder.openedAt,
    );

  if (
    openedAt === null
  ) {
    return 0;
  }

  const closedAt =
    workOrder.closedAt
      ? getDateTime(
          workOrder.closedAt,
        )
      : Date.now();

  if (
    closedAt === null
  ) {
    return 0;
  }

  const todayStart =
    getStartOfToday();

  const todayEnd =
    Math.min(
      Date.now(),
      getEndOfToday(),
    );

  const effectiveStart =
    Math.max(
      openedAt,
      todayStart,
    );

  const effectiveEnd =
    Math.min(
      closedAt,
      todayEnd,
    );

  if (
    effectiveEnd <=
    effectiveStart
  ) {
    return 0;
  }

  return (
    (effectiveEnd -
      effectiveStart) /
    60000
  );
}

function calculateAvailability(
  workOrders: WorkOrder[],
): number {
  const downtimeMinutes =
    workOrders.reduce(
      (
        total,
        workOrder,
      ) =>
        total +
        getTodayDowntimeMinutes(
          workOrder,
        ),
      0,
    );

  const cappedDowntimeMinutes =
    Math.min(
      PLANNED_MINUTES_PER_DAY,
      downtimeMinutes,
    );

  const availableMinutes =
    Math.max(
      0,
      PLANNED_MINUTES_PER_DAY -
        cappedDowntimeMinutes,
    );

  const availability =
    (availableMinutes /
      PLANNED_MINUTES_PER_DAY) *
    100;

  return Math.max(
    0,
    Math.min(
      100,
      availability,
    ),
  );
}

/* -------------------------------- */
/* MTTR                             */
/* -------------------------------- */

function calculateMttrHours(
  workOrders: WorkOrder[],
): number {
  /*
   * MTTR is calculated only from
   * completed corrective fault work.
   *
   * PM / safety / improvement work
   * must not distort repair-time KPI.
   */
  const completedFaults =
    workOrders.filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        workOrder.takenAt !==
          null &&
        workOrder.closedAt !==
          null,
    );

  const repairDurations =
    completedFaults
      .map(
        (workOrder) =>
          getDurationMinutes(
            workOrder.takenAt,
            workOrder.closedAt,
          ),
      )
      .filter(
        (minutes) =>
          minutes >= 0,
      );

  if (
    repairDurations.length ===
    0
  ) {
    return 0;
  }

  const totalRepairMinutes =
    repairDurations.reduce(
      (
        total,
        minutes,
      ) =>
        total + minutes,
      0,
    );

  return (
    totalRepairMinutes /
    repairDurations.length /
    60
  );
}

/* -------------------------------- */
/* MTBF                             */
/* -------------------------------- */

function calculateMtbfHours(
  workOrders: WorkOrder[],
): number {
  /*
   * MTBF is calculated only between
   * completed downtime fault events.
   *
   * Interval:
   *
   * previous failure closed
   *        ↓
   * next failure opened
   */
  const downtimeFailures =
    workOrders
      .filter(
        (workOrder) =>
          workOrder.type ===
            "fault" &&
          workOrder.isDowntime &&
          workOrder.closedAt !==
            null,
      )
      .sort(
        (
          first,
          second,
        ) =>
          new Date(
            first.openedAt,
          ).getTime() -
          new Date(
            second.openedAt,
          ).getTime(),
      );

  if (
    downtimeFailures.length <
    2
  ) {
    return 0;
  }

  const intervalsHours:
    number[] = [];

  for (
    let index = 1;
    index <
    downtimeFailures.length;
    index += 1
  ) {
    const previousFailure =
      downtimeFailures[
        index - 1
      ];

    const currentFailure =
      downtimeFailures[
        index
      ];

    const previousClosedAt =
      getDateTime(
        previousFailure.closedAt,
      );

    const currentOpenedAt =
      getDateTime(
        currentFailure.openedAt,
      );

    if (
      previousClosedAt ===
        null ||
      currentOpenedAt ===
        null ||
      currentOpenedAt <=
        previousClosedAt
    ) {
      continue;
    }

    intervalsHours.push(
      (currentOpenedAt -
        previousClosedAt) /
        3600000,
    );
  }

  if (
    intervalsHours.length ===
    0
  ) {
    return 0;
  }

  const totalHours =
    intervalsHours.reduce(
      (
        total,
        hours,
      ) =>
        total + hours,
      0,
    );

  return (
    totalHours /
    intervalsHours.length
  );
}

/* -------------------------------- */
/* Metrics                          */
/* -------------------------------- */

export function calculateAssetOperationalMetrics(
  asset: Asset,
): AssetOperationalMetrics {
  const workOrders =
    getAssetWorkOrdersInternal(
      asset,
    );

  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  const activeDowntimeWorkOrders =
    activeWorkOrders.filter(
      (workOrder) =>
        workOrder.isDowntime,
    );

  return {
    openWorkOrders:
      activeWorkOrders.length,

    downtimeWorkOrders:
      activeDowntimeWorkOrders.length,

    mttrHours:
      calculateMttrHours(
        workOrders,
      ),

    mtbfHours:
      calculateMtbfHours(
        workOrders,
      ),

    availability:
      calculateAvailability(
        workOrders,
      ),

    status:
      calculateAssetStatus(
        workOrders,
      ),
  };
}

/* -------------------------------- */
/* Asset enrichment                 */
/* -------------------------------- */

export function enrichAsset(
  asset: Asset,
): Asset {
  const metrics =
    calculateAssetOperationalMetrics(
      asset,
    );

  return {
    ...asset,

    openWorkOrders:
      metrics.openWorkOrders,

    downtimeWorkOrders:
      metrics.downtimeWorkOrders,

    mttrHours:
      metrics.mttrHours,

    mtbfHours:
      metrics.mtbfHours,

    availability:
      metrics.availability,

    status:
      metrics.status,
  };
}

/* -------------------------------- */
/* Public Asset API                 */
/* -------------------------------- */

export function getLiveAssets():
  Asset[] {
  return getActiveAssets().map(
    enrichAsset,
  );
}

export function getLiveAssetById(
  assetId: string,
): Asset | undefined {
  const asset =
    getAssetById(
      assetId,
    );

  if (!asset) {
    return undefined;
  }

  return enrichAsset(
    asset,
  );
}

export function getLiveAssetByCode(
  assetCode: string,
): Asset | undefined {
  const asset =
    getAssetByCode(
      assetCode,
    );

  if (!asset) {
    return undefined;
  }

  return enrichAsset(
    asset,
  );
}

export function getLiveAssetByNumber(
  assetNumber: string,
): Asset | undefined {
  const asset =
    getAssetByNumber(
      assetNumber,
    );

  if (!asset) {
    return undefined;
  }

  return enrichAsset(
    asset,
  );
}

export function getAssetWorkOrders(
  assetCode: string,
): WorkOrder[] {
  return getWorkOrders()
    .filter(
      (workOrder) =>
        belongsToAsset(
          workOrder,
          assetCode,
        ),
    )
    .sort(
      (
        first,
        second,
      ) =>
        new Date(
          second.openedAt,
        ).getTime() -
        new Date(
          first.openedAt,
        ).getTime(),
    );
}