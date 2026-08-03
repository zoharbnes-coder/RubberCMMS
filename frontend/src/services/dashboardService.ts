import {
  getLiveAssets,
} from "./assetService";

import {
  getWorkOrders,
} from "./workOrderService";

import type {
  AssetStatus,
} from "../types/asset";

import type {
  WorkOrder,
  WorkOrderPriority,
} from "../types/workOrder";

/*
 * RubberMIP
 * Asset-native Dashboard Service
 *
 * The Dashboard is operational.
 *
 * It is responsible for:
 *
 * - Current KPI
 * - Open Work Orders
 * - Current Asset Status
 *
 * Historical analysis belongs in
 * the Analytics module.
 */

export type DashboardOpenCall = {
  id: string;

  workOrderNumber: string;

  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  department: string;

  faultDescription: string;

  priority:
    WorkOrderPriority;

  isDowntime: boolean;

  openedAt: string;

  openMinutes: number;
};

export type DashboardAssetStatus = {
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  department: string;

  status:
    AssetStatus;

  openWorkOrders: number;

  downtimeWorkOrders: number;
};

export type DashboardSnapshot = {
  generatedAt: string;

  openWorkOrders: number;

  pausedWorkOrders: number;

  downtimeAssets: number;

  closedToday: number;

  availabilityToday: number;

  downtimeMinutesToday: number;

  urgentOpenCalls:
    DashboardOpenCall[];

  assetStatuses:
    DashboardAssetStatus[];
};

const SHIFT_MINUTES =
  9 * 60;

const priorityRank:
  Record<
    WorkOrderPriority,
    number
  > = {
  high: 1,
  medium: 2,
  low: 3,
};

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function startOfToday():
  Date {
  const date =
    new Date();

  date.setHours(
    0,
    0,
    0,
    0,
  );

  return date;
}

function endOfToday():
  Date {
  const date =
    new Date();

  date.setHours(
    23,
    59,
    59,
    999,
  );

  return date;
}

function getElapsedMinutes(
  startValue: string,
  endValue:
    string | null = null,
): number {
  const startTime =
    new Date(
      startValue,
    ).getTime();

  const endTime =
    endValue
      ? new Date(
          endValue,
        ).getTime()
      : Date.now();

  if (
    Number.isNaN(
      startTime,
    ) ||
    Number.isNaN(
      endTime,
    ) ||
    endTime <=
      startTime
  ) {
    return 0;
  }

  return Math.floor(
    (endTime -
      startTime) /
      60000,
  );
}

/* -------------------------------- */
/* Dashboard Asset population       */
/* -------------------------------- */

function getDashboardAssets() {
  /*
   * Plant-wide availability must count
   * primary operational assets only.
   *
   * Sub-assets and components must not
   * create duplicate planned capacity.
   */
  return getLiveAssets().filter(
    (asset) =>
      asset.active &&
      (
        asset.hierarchyLevel ===
          "asset" ||
        asset.hierarchyLevel ===
          "production-line"
      ),
  );
}

/* -------------------------------- */
/* Downtime overlap                 */
/* -------------------------------- */

function getOverlappingMinutes(
  workOrder: WorkOrder,
  rangeStart: Date,
  rangeEnd: Date,
): number {
  if (
    !workOrder.isDowntime ||
    workOrder.type !==
      "fault"
  ) {
    return 0;
  }

  const workOrderStart =
    new Date(
      workOrder.openedAt,
    ).getTime();

  const workOrderEnd =
    workOrder.closedAt
      ? new Date(
          workOrder.closedAt,
        ).getTime()
      : Date.now();

  if (
    Number.isNaN(
      workOrderStart,
    ) ||
    Number.isNaN(
      workOrderEnd,
    )
  ) {
    return 0;
  }

  const overlapStart =
    Math.max(
      workOrderStart,
      rangeStart.getTime(),
    );

  const overlapEnd =
    Math.min(
      workOrderEnd,
      rangeEnd.getTime(),
      Date.now(),
    );

  if (
    overlapEnd <=
    overlapStart
  ) {
    return 0;
  }

  return Math.floor(
    (overlapEnd -
      overlapStart) /
      60000,
  );
}

/* -------------------------------- */
/* Availability                     */
/* -------------------------------- */

function calculateAvailabilityToday(
  workOrders: WorkOrder[],
): {
  availability: number;

  downtimeMinutes: number;
} {
  const assets =
    getDashboardAssets();

  if (
    assets.length ===
    0
  ) {
    return {
      availability:
        100,

      downtimeMinutes:
        0,
    };
  }

  const assetIds =
    new Set(
      assets.map(
        (asset) =>
          asset.id,
      ),
    );

  const todayStart =
    startOfToday();

  const todayEnd =
    endOfToday();

  const downtimeMinutes =
    workOrders
      .filter(
        (workOrder) =>
          assetIds.has(
            workOrder.assetId,
          ),
      )
      .reduce(
        (
          total,
          workOrder,
        ) =>
          total +
          getOverlappingMinutes(
            workOrder,
            todayStart,
            todayEnd,
          ),
        0,
      );

  const plannedMinutes =
    assets.length *
    SHIFT_MINUTES;

  const cappedDowntime =
    Math.min(
      plannedMinutes,
      downtimeMinutes,
    );

  const availability =
    ((plannedMinutes -
      cappedDowntime) /
      plannedMinutes) *
    100;

  return {
    availability:
      Math.max(
        0,
        Math.min(
          100,
          availability,
        ),
      ),

    downtimeMinutes,
  };
}

/* -------------------------------- */
/* Open Calls                       */
/* -------------------------------- */

function buildUrgentOpenCalls(
  workOrders: WorkOrder[],
): DashboardOpenCall[] {
  return workOrders
    .filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    )
    .sort(
      (
        first,
        second,
      ) => {
        if (
          first.isDowntime !==
          second.isDowntime
        ) {
          return first.isDowntime
            ? -1
            : 1;
        }

        const priorityDifference =
          priorityRank[
            first.priority
          ] -
          priorityRank[
            second.priority
          ];

        if (
          priorityDifference !==
          0
        ) {
          return priorityDifference;
        }

        return (
          new Date(
            first.openedAt,
          ).getTime() -
          new Date(
            second.openedAt,
          ).getTime()
        );
      },
    )
    .slice(
      0,
      10,
    )
    .map(
      (workOrder) => ({
        id:
          workOrder.id,

        workOrderNumber:
          workOrder.workOrderNumber,

        assetId:
          workOrder.assetId,

        assetCode:
          workOrder.assetCode,

        assetNumber:
          workOrder.assetNumber,

        assetName:
          workOrder.assetName,

        department:
          workOrder.department,

        faultDescription:
          workOrder.faultDescription,

        priority:
          workOrder.priority,

        isDowntime:
          workOrder.isDowntime,

        openedAt:
          workOrder.openedAt,

        openMinutes:
          getElapsedMinutes(
            workOrder.openedAt,
          ),
      }),
    );
}

/* -------------------------------- */
/* Asset statuses                   */
/* -------------------------------- */

function buildAssetStatuses(
  workOrders: WorkOrder[],
): DashboardAssetStatus[] {
  const assets =
    getDashboardAssets();

  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  return assets.map(
    (asset) => {
      const assetWorkOrders =
        activeWorkOrders.filter(
          (workOrder) =>
            workOrder.assetId ===
            asset.id,
        );

      const downtimeWorkOrders =
        assetWorkOrders.filter(
          (workOrder) =>
            workOrder.isDowntime,
        );

      const preventiveWorkOrders =
        assetWorkOrders.filter(
          (workOrder) =>
            workOrder.type ===
            "preventive",
        );

      let status:
        AssetStatus =
        "running";

      if (
        downtimeWorkOrders.length >
        0
      ) {
        status =
          "alarm";
      } else if (
        preventiveWorkOrders.length >
        0
      ) {
        status =
          "maintenance";
      } else if (
        assetWorkOrders.length >
        0
      ) {
        status =
          "warning";
      }

      return {
        assetId:
          asset.id,

        assetCode:
          asset.assetCode,

        assetNumber:
          asset.assetNumber,

        assetName:
          asset.displayName,

        department:
          asset.department,

        status,

        openWorkOrders:
          assetWorkOrders.length,

        downtimeWorkOrders:
          downtimeWorkOrders.length,
      };
    },
  );
}

/* -------------------------------- */
/* Public snapshot                  */
/* -------------------------------- */

export function getDashboardSnapshot():
  DashboardSnapshot {
  const workOrders =
    getWorkOrders();

  const todayStart =
    startOfToday();

  const todayEnd =
    endOfToday();

  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  const downtimeAssetIds =
    new Set(
      activeWorkOrders
        .filter(
          (workOrder) =>
            workOrder.isDowntime,
        )
        .map(
          (workOrder) =>
            workOrder.assetId,
        ),
    );

  const closedToday =
    workOrders.filter(
      (workOrder) => {
        if (
          !workOrder.closedAt
        ) {
          return false;
        }

        const closedTime =
          new Date(
            workOrder.closedAt,
          ).getTime();

        if (
          Number.isNaN(
            closedTime,
          )
        ) {
          return false;
        }

        return (
          closedTime >=
            todayStart.getTime() &&
          closedTime <=
            todayEnd.getTime()
        );
      },
    ).length;

  const availabilityResult =
    calculateAvailabilityToday(
      workOrders,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    openWorkOrders:
      activeWorkOrders.length,

    pausedWorkOrders:
      activeWorkOrders.filter(
        (workOrder) =>
          workOrder.status ===
          "paused",
      ).length,

    downtimeAssets:
      downtimeAssetIds.size,

    closedToday,

    availabilityToday:
      availabilityResult.availability,

    downtimeMinutesToday:
      availabilityResult.downtimeMinutes,

    urgentOpenCalls:
      buildUrgentOpenCalls(
        workOrders,
      ),

    assetStatuses:
      buildAssetStatuses(
        workOrders,
      ),
  };
}