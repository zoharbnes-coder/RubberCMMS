import type {
  WorkOrder,
} from "../types/workOrder";

import type {
  MaintenanceExecutionStatus,
  PreventiveMaintenanceExecution,
} from "../types/preventiveMaintenance";

import {
  getAssetWorkOrders,
  getLiveAssetByNumber,
} from "./assetService";

import {
  getAssetExecutions,
} from "./preventiveMaintenanceService";

export type AssetTimelineEventType =
  | "breakdown"
  | "work_order"
  | "preventive_maintenance"
  | "inspection"
  | "improvement"
  | "safety";

export type AssetTimelineEventSeverity =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

export type AssetTimelineEvent = {
  id: string;

  eventType:
    AssetTimelineEventType;

  severity:
    AssetTimelineEventSeverity;

  title: string;

  description: string;

  occurredAt: string;

  completedAt:
    string | null;

  sourceType:
    | "work_order"
    | "preventive_maintenance";

  sourceId: string;

  sourceNumber: string;

  assetId: string;

  assetNumber: string;

  assetCode: string;

  statusLabel: string;

  responsibleName: string;

  isDowntime: boolean;

  durationMinutes:
    number | null;

  details: string[];
};

export type AssetTimelineSummary = {
  totalEvents: number;

  breakdownEvents: number;

  workOrderEvents: number;

  preventiveMaintenanceEvents:
    number;

  inspectionEvents: number;

  improvementEvents: number;

  safetyEvents: number;

  downtimeEvents: number;

  eventsLast7Days: number;

  eventsLast30Days: number;

  latestEvent:
    AssetTimelineEvent | null;
};

export type AssetTimelineSnapshot = {
  generatedAt: string;

  assetId: string;

  assetNumber: string;

  assetCode: string;

  events:
    AssetTimelineEvent[];

  summary:
    AssetTimelineSummary;
};

/* -------------------------------- */
/* Time helpers                     */
/* -------------------------------- */

function getDurationMinutes(
  startValue: string | null,
  endValue: string | null,
): number | null {
  if (
    !startValue ||
    !endValue
  ) {
    return null;
  }

  const startTime =
    new Date(
      startValue,
    ).getTime();

  const endTime =
    new Date(
      endValue,
    ).getTime();

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
    return null;
  }

  return Math.floor(
    (endTime -
      startTime) /
      60000,
  );
}

/* -------------------------------- */
/* Work Order mapping               */
/* -------------------------------- */

function getWorkOrderEventType(
  workOrder: WorkOrder,
): AssetTimelineEventType {
  if (
    workOrder.type ===
    "preventive"
  ) {
    return "preventive_maintenance";
  }

  if (
    workOrder.type ===
    "safety"
  ) {
    return "safety";
  }

  if (
    workOrder.type ===
    "improvement"
  ) {
    return "improvement";
  }

  if (
    workOrder.isDowntime
  ) {
    return "breakdown";
  }

  return "work_order";
}

function getWorkOrderSeverity(
  workOrder: WorkOrder,
): AssetTimelineEventSeverity {
  if (
    workOrder.isDowntime &&
    workOrder.status !==
      "closed"
  ) {
    return "danger";
  }

  if (
    workOrder.status ===
    "paused"
  ) {
    return "warning";
  }

  if (
    workOrder.status ===
    "closed"
  ) {
    return "success";
  }

  if (
    workOrder.priority ===
    "high"
  ) {
    return "danger";
  }

  if (
    workOrder.priority ===
    "medium"
  ) {
    return "warning";
  }

  return "info";
}

function getWorkOrderStatusLabel(
  workOrder: WorkOrder,
): string {
  if (
    workOrder.status ===
    "closed"
  ) {
    return "סגור";
  }

  if (
    workOrder.status ===
    "paused"
  ) {
    return "מושהה";
  }

  if (
    workOrder.takenAt
  ) {
    return "בטיפול";
  }

  return "פתוח";
}

function mapWorkOrderToTimelineEvent(
  workOrder: WorkOrder,
): AssetTimelineEvent {
  const endValue =
    workOrder.closedAt ??
    new Date().toISOString();

  const durationMinutes =
    getDurationMinutes(
      workOrder.openedAt,
      endValue,
    );

  const details:
    string[] = [];

  if (
    workOrder.department
  ) {
    details.push(
      `מחלקה: ${workOrder.department}`,
    );
  }

  if (
    workOrder.openedBy
  ) {
    details.push(
      `נפתחה על ידי: ${workOrder.openedBy}`,
    );
  }

  if (
    workOrder.takenBy
  ) {
    details.push(
      `מטפל: ${workOrder.takenBy}`,
    );
  }

  if (
    workOrder.repairDescription
  ) {
    details.push(
      `טיפול: ${workOrder.repairDescription}`,
    );
  }

  if (
    workOrder.replacedParts.length >
    0
  ) {
    details.push(
      `חלקים שהוחלפו: ${workOrder.replacedParts.length}`,
    );
  }

  return {
    id:
      `work-order-${workOrder.id}`,

    eventType:
      getWorkOrderEventType(
        workOrder,
      ),

    severity:
      getWorkOrderSeverity(
        workOrder,
      ),

    title:
      workOrder.faultDescription,

    description:
      workOrder.repairDescription ||
      "טרם הוזן סיכום טיפול.",

    occurredAt:
      workOrder.openedAt,

    completedAt:
      workOrder.closedAt,

    sourceType:
      "work_order",

    sourceId:
      workOrder.id,

    sourceNumber:
      workOrder.workOrderNumber,

    assetId:
      workOrder.assetId,

    assetNumber:
      workOrder.assetNumber,

    assetCode:
      workOrder.assetCode,

    statusLabel:
      getWorkOrderStatusLabel(
        workOrder,
      ),

    responsibleName:
      workOrder.takenBy ??
      workOrder.openedBy ??
      "-",

    isDowntime:
      workOrder.isDowntime,

    durationMinutes,

    details,
  };
}

/* -------------------------------- */
/* Preventive Maintenance mapping   */
/* -------------------------------- */

function getMaintenanceSeverity(
  status:
    MaintenanceExecutionStatus,
): AssetTimelineEventSeverity {
  if (
    status ===
    "overdue"
  ) {
    return "danger";
  }

  if (
    status ===
    "due"
  ) {
    return "warning";
  }

  if (
    status ===
    "in_progress"
  ) {
    return "info";
  }

  if (
    status ===
    "completed"
  ) {
    return "success";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "neutral";
  }

  return "info";
}

function getMaintenanceStatusLabel(
  status:
    MaintenanceExecutionStatus,
): string {
  if (
    status ===
    "overdue"
  ) {
    return "באיחור";
  }

  if (
    status ===
    "due"
  ) {
    return "לביצוע";
  }

  if (
    status ===
    "in_progress"
  ) {
    return "בביצוע";
  }

  if (
    status ===
    "completed"
  ) {
    return "הושלם";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "בוטל";
  }

  return "מתוכנן";
}

function mapMaintenanceToTimelineEvent(
  execution:
    PreventiveMaintenanceExecution,
): AssetTimelineEvent {
  const durationMinutes =
    execution.actualDurationMinutes ??
    getDurationMinutes(
      execution.startedAt,
      execution.completedAt,
    );

  const details:
    string[] = [];

  if (
    execution.workPerformed
  ) {
    details.push(
      `עבודה שבוצעה: ${execution.workPerformed}`,
    );
  }

  if (
    execution.findings
  ) {
    details.push(
      `ממצאים: ${execution.findings}`,
    );
  }

  if (
    execution.recommendations
  ) {
    details.push(
      `המלצות: ${execution.recommendations}`,
    );
  }

  if (
    execution.replacedParts.length >
    0
  ) {
    details.push(
      `חלקים שהוחלפו: ${execution.replacedParts.length}`,
    );
  }

  if (
    execution.lockoutTagoutApplied
  ) {
    details.push(
      "בוצע נוהל נעילה ותיוג",
    );
  }

  return {
    id:
      `pm-${execution.id}`,

    eventType:
      "preventive_maintenance",

    severity:
      getMaintenanceSeverity(
        execution.status,
      ),

    title:
      execution.planTitle,

    description:
      execution.workPerformed ||
      execution.findings ||
      "טיפול מונע מתוכנן לנכס.",

    occurredAt:
      execution.startedAt ??
      execution.scheduledAt,

    completedAt:
      execution.completedAt,

    sourceType:
      "preventive_maintenance",

    sourceId:
      execution.id,

    sourceNumber:
      execution.executionNumber,

    assetId:
      execution.assetId,

    assetNumber:
      execution.assetNumber,

    assetCode:
      execution.assetCode,

    statusLabel:
      getMaintenanceStatusLabel(
        execution.status,
      ),

    responsibleName:
      execution.completedByUserName ??
      execution.assignedUserName ??
      "טרם שויך",

    isDowntime:
      execution.assetStopped,

    durationMinutes,

    details,
  };
}

/* -------------------------------- */
/* Timeline period helpers          */
/* -------------------------------- */

function isWithinDays(
  dateValue: string,
  days: number,
): boolean {
  const eventTime =
    new Date(
      dateValue,
    ).getTime();

  if (
    Number.isNaN(
      eventTime,
    )
  ) {
    return false;
  }

  const minimumTime =
    Date.now() -
    days *
      24 *
      60 *
      60 *
      1000;

  return (
    eventTime >=
    minimumTime
  );
}

/* -------------------------------- */
/* Summary                          */
/* -------------------------------- */

function buildSummary(
  events:
    AssetTimelineEvent[],
): AssetTimelineSummary {
  return {
    totalEvents:
      events.length,

    breakdownEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "breakdown",
      ).length,

    workOrderEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "work_order",
      ).length,

    preventiveMaintenanceEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "preventive_maintenance",
      ).length,

    inspectionEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "inspection",
      ).length,

    improvementEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "improvement",
      ).length,

    safetyEvents:
      events.filter(
        (event) =>
          event.eventType ===
          "safety",
      ).length,

    downtimeEvents:
      events.filter(
        (event) =>
          event.isDowntime,
      ).length,

    eventsLast7Days:
      events.filter(
        (event) =>
          isWithinDays(
            event.occurredAt,
            7,
          ),
      ).length,

    eventsLast30Days:
      events.filter(
        (event) =>
          isWithinDays(
            event.occurredAt,
            30,
          ),
      ).length,

    latestEvent:
      events[0] ??
      null,
  };
}

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

export function getAssetTimelineSnapshot(
  assetNumber: string,
): AssetTimelineSnapshot | null {
  const asset =
    getLiveAssetByNumber(
      assetNumber,
    );

  if (!asset) {
    return null;
  }

  const workOrderEvents =
    getAssetWorkOrders(
      asset.assetCode,
    ).map(
      mapWorkOrderToTimelineEvent,
    );

  const maintenanceEvents =
    getAssetExecutions(
      asset.id,
    ).map(
      mapMaintenanceToTimelineEvent,
    );

  const events = [
    ...workOrderEvents,
    ...maintenanceEvents,
  ].sort(
    (
      first,
      second,
    ) =>
      new Date(
        second.occurredAt,
      ).getTime() -
      new Date(
        first.occurredAt,
      ).getTime(),
  );

  return {
    generatedAt:
      new Date().toISOString(),

    assetId:
      asset.id,

    assetNumber:
      asset.assetNumber,

    assetCode:
      asset.assetCode,

    events,

    summary:
      buildSummary(
        events,
      ),
  };
}