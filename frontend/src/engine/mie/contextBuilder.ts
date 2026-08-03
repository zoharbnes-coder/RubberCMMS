import type {
  PreventiveMaintenanceExecution,
} from "../../types/preventiveMaintenance";

import type {
  WorkOrder,
} from "../../types/workOrder";

import {
  getAssetDetailsSnapshot,
} from "../../services/assetDetailsService";

import {
  getAssetExecutions,
  getAssetPlans,
} from "../../services/preventiveMaintenanceService";

import type {
  MieRuleContext,
} from "./types";

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function getStartOfDaysAgo(
  days: number,
): number {
  const date =
    new Date();

  date.setHours(
    0,
    0,
    0,
    0,
  );

  date.setDate(
    date.getDate() -
      days,
  );

  return date.getTime();
}

function getDateTime(
  value: string,
): number | null {
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

function isWithinLastDays(
  value: string,
  days: number,
): boolean {
  const time =
    getDateTime(
      value,
    );

  if (
    time === null
  ) {
    return false;
  }

  return (
    time >=
    getStartOfDaysAgo(
      days,
    )
  );
}

/* -------------------------------- */
/* Work Order helpers               */
/* -------------------------------- */

function getRecentFaultWorkOrders(
  workOrders: WorkOrder[],
  days: number,
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
      workOrder.type ===
        "fault" &&
      isWithinLastDays(
        workOrder.openedAt,
        days,
      ),
  );
}

function getDowntimeFailures(
  workOrders: WorkOrder[],
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
      workOrder.type ===
        "fault" &&
      workOrder.isDowntime,
  );
}

/* -------------------------------- */
/* Health score                     */
/* -------------------------------- */

function calculateBaseHealthScore(
  availabilityPercent: number,
): number {
  if (
    !Number.isFinite(
      availabilityPercent,
    )
  ) {
    return 100;
  }

  const normalizedAvailability =
    Math.max(
      0,
      Math.min(
        100,
        availabilityPercent,
      ),
    );

  /*
   * The base score currently derives
   * from availability.
   *
   * MIE rules apply additional penalties
   * for reliability and maintenance risks.
   */
  return Math.max(
    60,
    Math.round(
      normalizedAvailability,
    ),
  );
}

/* -------------------------------- */
/* Preventive Maintenance helpers   */
/* -------------------------------- */

function isExecutionOverdue(
  execution:
    PreventiveMaintenanceExecution,
  now: number,
): boolean {
  if (
    execution.status ===
      "completed" ||
    execution.status ===
      "cancelled"
  ) {
    return false;
  }

  if (
    execution.status ===
    "overdue"
  ) {
    return true;
  }

  const dueTime =
    getDateTime(
      execution.dueAt,
    );

  return (
    dueTime !== null &&
    dueTime < now
  );
}

function getDuePmCount(
  executions:
    PreventiveMaintenanceExecution[],
): number {
  const now =
    Date.now();

  return executions.filter(
    (execution) =>
      execution.status ===
        "due" &&
      !isExecutionOverdue(
        execution,
        now,
      ),
  ).length;
}

function getOverduePmCount(
  executions:
    PreventiveMaintenanceExecution[],
): number {
  const now =
    Date.now();

  return executions.filter(
    (execution) =>
      isExecutionOverdue(
        execution,
        now,
      ),
  ).length;
}

/* -------------------------------- */
/* MIE Context                      */
/* -------------------------------- */

export function buildMieRuleContext(
  assetNumber: string,
): MieRuleContext | null {
  const assetSnapshot =
    getAssetDetailsSnapshot(
      assetNumber,
    );

  if (
    !assetSnapshot
  ) {
    return null;
  }

  const {
    asset,
    workOrders,
    openWorkOrders,
    closedWorkOrders,
    timeSummary,
  } = assetSnapshot;

  /*
   * Preventive Maintenance is linked
   * directly through immutable Asset ID.
   */
  const preventiveMaintenancePlans =
    getAssetPlans(
      asset.id,
    );

  const preventiveMaintenanceExecutions =
    getAssetExecutions(
      asset.id,
    );

  const faultWorkOrdersLast7Days =
    getRecentFaultWorkOrders(
      workOrders,
      7,
    );

  const faultWorkOrdersLast30Days =
    getRecentFaultWorkOrders(
      workOrders,
      30,
    );

  const downtimeFailuresLast30Days =
    getDowntimeFailures(
      faultWorkOrdersLast30Days,
    );

  const availabilityPercent =
    Number.isFinite(
      asset.availability,
    )
      ? asset.availability
      : 100;

  return {
    generatedAt:
      new Date().toISOString(),

    /*
     * Asset identity
     */
    assetId:
      asset.id,

    assetNumber:
      asset.assetNumber,

    assetCode:
      asset.assetCode,

    /*
     * Temporary MIE compatibility field.
     * It will be removed when MIE types
     * are migrated in the next stage.
     */
    machineCode:
      asset.assetCode,

    asset,

    /*
     * Work Orders
     */
    workOrders,

    openWorkOrders,

    closedWorkOrders,

    /*
     * Preventive Maintenance
     */
    preventiveMaintenancePlans,

    preventiveMaintenanceExecutions,

    /*
     * Health
     */
    currentHealthScore:
      calculateBaseHealthScore(
        availabilityPercent,
      ),

    /*
     * Reliability
     */
    availabilityPercent,

    mttrHours:
      Number.isFinite(
        asset.mttrHours,
      )
        ? asset.mttrHours
        : 0,

    mtbfHours:
      Number.isFinite(
        asset.mtbfHours,
      )
        ? asset.mtbfHours
        : 0,

    /*
     * Time metrics
     */
    totalDowntimeMinutes:
      Number.isFinite(
        timeSummary
          .totalDowntimeMinutes,
      )
        ? timeSummary
            .totalDowntimeMinutes
        : 0,

    averageResponseMinutes:
      Number.isFinite(
        timeSummary
          .averageResponseMinutes,
      )
        ? timeSummary
            .averageResponseMinutes
        : 0,

    averageRepairMinutes:
      Number.isFinite(
        timeSummary
          .averageRepairMinutes,
      )
        ? timeSummary
            .averageRepairMinutes
        : 0,

    /*
     * Failure metrics
     */
    failuresLast7Days:
      faultWorkOrdersLast7Days.length,

    failuresLast30Days:
      faultWorkOrdersLast30Days.length,

    downtimeFailuresLast30Days:
      downtimeFailuresLast30Days.length,

    /*
     * PM metrics
     */
    overduePmCount:
      getOverduePmCount(
        preventiveMaintenanceExecutions,
      ),

    duePmCount:
      getDuePmCount(
        preventiveMaintenanceExecutions,
      ),
  };
}