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

export type AssetOperationalMetrics = {
  openWorkOrders: number;

  downtimeWorkOrders: number;

  mttrHours: number;

  mtbfHours: number;

  availability: number;

  status: AssetStatus;
};

function getDurationMinutes(
  startValue: string | null,
  endValue: string | null,
): number {
  if (!startValue || !endValue) {
    return 0;
  }

  const startTime =
    new Date(startValue).getTime();

  const endTime =
    new Date(endValue).getTime();

  if (
    Number.isNaN(startTime) ||
    Number.isNaN(endTime) ||
    endTime <= startTime
  ) {
    return 0;
  }

  return Math.floor(
    (endTime - startTime) /
      60000,
  );
}

function getAssetWorkOrdersInternal(
  asset: Asset,
): WorkOrder[] {
  return getWorkOrders().filter(
    (workOrder) =>
      workOrder.machineCode ===
      asset.assetCode,
  );
}

function calculateAssetStatus(
  workOrders: WorkOrder[],
): AssetStatus {
  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !== "closed",
    );

  const hasDowntime =
    activeWorkOrders.some(
      (workOrder) =>
        workOrder.isDowntime,
    );

  if (hasDowntime) {
    return "alarm";
  }

  if (
    activeWorkOrders.length > 0
  ) {
    return "warning";
  }

  return "running";
}

function calculateAvailability(
  workOrders: WorkOrder[],
): number {
  const downtimeMinutes =
    workOrders
      .filter(
        (workOrder) =>
          workOrder.isDowntime,
      )
      .reduce(
        (total, workOrder) => {
          const endValue =
            workOrder.closedAt ??
            new Date().toISOString();

          return (
            total +
            getDurationMinutes(
              workOrder.openedAt,
              endValue,
            )
          );
        },
        0,
      );

  /*
   * Current plant logic:
   * 9 planned operating hours per day.
   *
   * This preserves the same logic currently
   * used by machineService.ts.
   */
  const plannedMinutes =
    9 * 60;

  const availability =
    ((plannedMinutes -
      downtimeMinutes) /
      plannedMinutes) *
    100;

  return Math.max(
    0,
    Math.min(
      100,
      availability,
    ),
  );
}

function calculateMttrHours(
  workOrders: WorkOrder[],
): number {
  const completedRepairs =
    workOrders.filter(
      (workOrder) =>
        workOrder.takenAt !== null &&
        workOrder.closedAt !== null,
    );

  if (
    completedRepairs.length === 0
  ) {
    return 0;
  }

  const repairDurations =
    completedRepairs
      .map((workOrder) =>
        getDurationMinutes(
          workOrder.takenAt,
          workOrder.closedAt,
        ),
      )
      .filter(
        (duration) =>
          duration > 0,
      );

  if (
    repairDurations.length === 0
  ) {
    return 0;
  }

  const totalRepairMinutes =
    repairDurations.reduce(
      (total, duration) =>
        total + duration,
      0,
    );

  return (
    totalRepairMinutes /
    repairDurations.length /
    60
  );
}

function calculateMtbfHours(
  workOrders: WorkOrder[],
): number {
  const downtimeWorkOrders =
    workOrders
      .filter(
        (workOrder) =>
          workOrder.isDowntime &&
          workOrder.closedAt !== null,
      )
      .sort(
        (first, second) =>
          new Date(
            first.openedAt,
          ).getTime() -
          new Date(
            second.openedAt,
          ).getTime(),
      );

  if (
    downtimeWorkOrders.length < 2
  ) {
    return 0;
  }

  const intervalsHours:
    number[] = [];

  for (
    let index = 1;
    index <
    downtimeWorkOrders.length;
    index += 1
  ) {
    const previousClosedAt =
      downtimeWorkOrders[
        index - 1
      ].closedAt;

    const currentOpenedAt =
      downtimeWorkOrders[
        index
      ].openedAt;

    if (!previousClosedAt) {
      continue;
    }

    const previousCloseTime =
      new Date(
        previousClosedAt,
      ).getTime();

    const currentOpenTime =
      new Date(
        currentOpenedAt,
      ).getTime();

    if (
      Number.isNaN(
        previousCloseTime,
      ) ||
      Number.isNaN(
        currentOpenTime,
      ) ||
      currentOpenTime <=
        previousCloseTime
    ) {
      continue;
    }

    intervalsHours.push(
      (currentOpenTime -
        previousCloseTime) /
        3600000,
    );
  }

  if (
    intervalsHours.length === 0
  ) {
    return 0;
  }

  return (
    intervalsHours.reduce(
      (total, value) =>
        total + value,
      0,
    ) /
    intervalsHours.length
  );
}

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
    getAssetById(assetId);

  if (!asset) {
    return undefined;
  }

  return enrichAsset(asset);
}

export function getLiveAssetByCode(
  assetCode: string,
): Asset | undefined {
  const asset =
    getAssetByCode(assetCode);

  if (!asset) {
    return undefined;
  }

  return enrichAsset(asset);
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

  return enrichAsset(asset);
}

export function getAssetWorkOrders(
  assetCode: string,
): WorkOrder[] {
  return getWorkOrders()
    .filter(
      (workOrder) =>
        workOrder.machineCode ===
        assetCode,
    )
    .sort(
      (first, second) =>
        new Date(
          second.openedAt,
        ).getTime() -
        new Date(
          first.openedAt,
        ).getTime(),
    );
}