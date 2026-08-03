import {
  getPreventiveExecutions,
} from "./preventiveMaintenanceService";

import {
  getWorkOrders,
} from "./workOrderService";

import type {
  PreventiveMaintenanceExecution,
} from "../types/preventiveMaintenance";

import type {
  WorkOrder,
} from "../types/workOrder";

/*
 * RubberMIP
 * Plant Activity Timeline Service
 *
 * This service builds one unified stream
 * of recent plant activity from:
 *
 * - Work Orders
 * - Preventive Maintenance
 *
 * Future sources:
 *
 * - Asset status events
 * - MIE events
 * - Inventory events
 * - Safety events
 */

export type DashboardActivityType =
  | "work_order_opened"
  | "work_order_started"
  | "work_order_paused"
  | "work_order_closed"
  | "asset_downtime"
  | "pm_upcoming"
  | "pm_due"
  | "pm_overdue"
  | "pm_started"
  | "pm_completed"
  | "pm_cancelled";

export type DashboardActivitySeverity =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

export type DashboardActivitySource =
  | "work_order"
  | "preventive_maintenance";

export type DashboardActivityTarget =
  | "work_order"
  | "asset"
  | "maintenance";

export type DashboardActivity = {
  id: string;

  type:
    DashboardActivityType;

  severity:
    DashboardActivitySeverity;

  title: string;

  description: string;

  occurredAt: string;

  source:
    DashboardActivitySource;

  sourceId: string;

  sourceNumber: string;

  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  department:
    string | null;

  target:
    DashboardActivityTarget;

  targetId: string;

  isDowntime: boolean;

  responsibleName:
    string | null;
};

export type DashboardActivitySnapshot = {
  generatedAt: string;

  activities:
    DashboardActivity[];

  totalActivities: number;

  latestActivity:
    DashboardActivity | null;
};

const DEFAULT_ACTIVITY_LIMIT =
  10;

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function getDateTime(
  value:
    string | null,
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

function isValidActivityDate(
  value: string,
): boolean {
  return (
    getDateTime(
      value,
    ) !== null
  );
}

/* -------------------------------- */
/* Work Order activity              */
/* -------------------------------- */

function buildWorkOrderOpenedActivity(
  workOrder: WorkOrder,
): DashboardActivity {
  return {
    id:
      `work-order-opened-${workOrder.id}`,

    type:
      workOrder.isDowntime
        ? "asset_downtime"
        : "work_order_opened",

    severity:
      workOrder.isDowntime
        ? "danger"
        : workOrder.priority ===
            "high"
          ? "warning"
          : "info",

    title:
      workOrder.isDowntime
        ? "נכס הושבת"
        : "נפתחה קריאת שירות",

    description:
      workOrder.faultDescription,

    occurredAt:
      workOrder.openedAt,

    source:
      "work_order",

    sourceId:
      workOrder.id,

    sourceNumber:
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

    target:
      "work_order",

    targetId:
      workOrder.id,

    isDowntime:
      workOrder.isDowntime,

    responsibleName:
      workOrder.openedBy,
  };
}

function buildWorkOrderStartedActivity(
  workOrder: WorkOrder,
): DashboardActivity | null {
  if (
    !workOrder.takenAt
  ) {
    return null;
  }

  return {
    id:
      `work-order-started-${workOrder.id}`,

    type:
      "work_order_started",

    severity:
      "info",

    title:
      "הטיפול בקריאה החל",

    description:
      workOrder.faultDescription,

    occurredAt:
      workOrder.takenAt,

    source:
      "work_order",

    sourceId:
      workOrder.id,

    sourceNumber:
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

    target:
      "work_order",

    targetId:
      workOrder.id,

    isDowntime:
      workOrder.isDowntime,

    responsibleName:
      workOrder.takenBy,
  };
}

function buildWorkOrderPausedActivity(
  workOrder: WorkOrder,
): DashboardActivity | null {
  if (
    workOrder.status !==
    "paused"
  ) {
    return null;
  }

  /*
   * WorkOrder currently has no dedicated
   * pausedAt timestamp.
   *
   * Until that field is introduced,
   * the current moment must not be used
   * because it would create a false event
   * every time the dashboard refreshes.
   *
   * Therefore paused activity is omitted
   * from the timeline for now.
   */
  return null;
}

function buildWorkOrderClosedActivity(
  workOrder: WorkOrder,
): DashboardActivity | null {
  if (
    workOrder.status !==
      "closed" ||
    !workOrder.closedAt
  ) {
    return null;
  }

  return {
    id:
      `work-order-closed-${workOrder.id}`,

    type:
      "work_order_closed",

    severity:
      "success",

    title:
      "קריאת שירות נסגרה",

    description:
      workOrder.repairDescription ||
      workOrder.faultDescription,

    occurredAt:
      workOrder.closedAt,

    source:
      "work_order",

    sourceId:
      workOrder.id,

    sourceNumber:
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

    target:
      "work_order",

    targetId:
      workOrder.id,

    isDowntime:
      workOrder.isDowntime,

    responsibleName:
      workOrder.closedBy,
  };
}

function buildWorkOrderActivities(
  workOrder: WorkOrder,
): DashboardActivity[] {
  const activities:
    Array<
      DashboardActivity | null
    > = [
    buildWorkOrderOpenedActivity(
      workOrder,
    ),

    buildWorkOrderStartedActivity(
      workOrder,
    ),

    buildWorkOrderPausedActivity(
      workOrder,
    ),

    buildWorkOrderClosedActivity(
      workOrder,
    ),
  ];

  return activities.filter(
    (
      activity,
    ): activity is DashboardActivity =>
      activity !== null &&
      isValidActivityDate(
        activity.occurredAt,
      ),
  );
}

/* -------------------------------- */
/* PM activity                      */
/* -------------------------------- */

function getPmActivityType(
  execution:
    PreventiveMaintenanceExecution,
): DashboardActivityType {
  if (
    execution.status ===
    "completed"
  ) {
    return "pm_completed";
  }

  if (
    execution.status ===
    "in_progress"
  ) {
    return "pm_started";
  }

  if (
    execution.status ===
    "overdue"
  ) {
    return "pm_overdue";
  }

  if (
    execution.status ===
    "due"
  ) {
    return "pm_due";
  }

  if (
    execution.status ===
    "cancelled"
  ) {
    return "pm_cancelled";
  }

  return "pm_upcoming";
}

function getPmActivitySeverity(
  execution:
    PreventiveMaintenanceExecution,
): DashboardActivitySeverity {
  if (
    execution.status ===
    "completed"
  ) {
    return "success";
  }

  if (
    execution.status ===
    "overdue"
  ) {
    return "danger";
  }

  if (
    execution.status ===
      "due" ||
    execution.status ===
      "in_progress"
  ) {
    return "warning";
  }

  if (
    execution.status ===
    "cancelled"
  ) {
    return "neutral";
  }

  return "info";
}

function getPmActivityTitle(
  execution:
    PreventiveMaintenanceExecution,
): string {
  if (
    execution.status ===
    "completed"
  ) {
    return "טיפול מונע הושלם";
  }

  if (
    execution.status ===
    "in_progress"
  ) {
    return "טיפול מונע החל";
  }

  if (
    execution.status ===
    "overdue"
  ) {
    return "טיפול מונע באיחור";
  }

  if (
    execution.status ===
    "due"
  ) {
    return "טיפול מונע לביצוע";
  }

  if (
    execution.status ===
    "cancelled"
  ) {
    return "טיפול מונע בוטל";
  }

  return "טיפול מונע מתוכנן";
}

function getPmOccurredAt(
  execution:
    PreventiveMaintenanceExecution,
): string {
  if (
    execution.status ===
      "completed" &&
    execution.completedAt
  ) {
    return execution.completedAt;
  }

  if (
    execution.status ===
      "in_progress" &&
    execution.startedAt
  ) {
    return execution.startedAt;
  }

  if (
    execution.status ===
      "overdue" ||
    execution.status ===
      "due"
  ) {
    return execution.dueAt;
  }

  return execution.scheduledAt;
}

function buildPmActivity(
  execution:
    PreventiveMaintenanceExecution,
): DashboardActivity | null {
  const occurredAt =
    getPmOccurredAt(
      execution,
    );

  if (
    !isValidActivityDate(
      occurredAt,
    )
  ) {
    return null;
  }

  return {
    id:
      `pm-${execution.status}-${execution.id}`,

    type:
      getPmActivityType(
        execution,
      ),

    severity:
      getPmActivitySeverity(
        execution,
      ),

    title:
      getPmActivityTitle(
        execution,
      ),

    description:
      execution.planTitle,

    occurredAt,

    source:
      "preventive_maintenance",

    sourceId:
      execution.id,

    sourceNumber:
      execution.executionNumber,

    assetId:
      execution.assetId,

    assetCode:
      execution.assetCode,

    assetNumber:
      execution.assetNumber,

    assetName:
      execution.assetName,

    department:
      null,

    target:
      "maintenance",

    targetId:
      execution.id,

    isDowntime:
      execution.assetStopped,

    responsibleName:
      execution.completedByUserName ??
      execution.assignedUserName,
  };
}

/* -------------------------------- */
/* Sorting                          */
/* -------------------------------- */

function sortActivities(
  activities:
    DashboardActivity[],
): DashboardActivity[] {
  return [
    ...activities,
  ].sort(
    (
      first,
      second,
    ) => {
      const firstTime =
        getDateTime(
          first.occurredAt,
        ) ?? 0;

      const secondTime =
        getDateTime(
          second.occurredAt,
        ) ?? 0;

      return (
        secondTime -
        firstTime
      );
    },
  );
}

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

export function getDashboardActivitySnapshot(
  limit: number =
    DEFAULT_ACTIVITY_LIMIT,
): DashboardActivitySnapshot {
  const safeLimit =
    Math.max(
      1,
      Math.floor(
        limit,
      ),
    );

  const workOrderActivities =
    getWorkOrders().flatMap(
      buildWorkOrderActivities,
    );

  const pmActivities =
    getPreventiveExecutions()
      .map(
        buildPmActivity,
      )
      .filter(
        (
          activity,
        ): activity is DashboardActivity =>
          activity !== null,
      );

  const allActivities =
    sortActivities([
      ...workOrderActivities,
      ...pmActivities,
    ]);

  const activities =
    allActivities.slice(
      0,
      safeLimit,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    activities,

    totalActivities:
      allActivities.length,

    latestActivity:
      activities[0] ??
      null,
  };
}