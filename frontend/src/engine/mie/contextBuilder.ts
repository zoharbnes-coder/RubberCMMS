import type {
  WorkOrder,
} from "../../types/workOrder";

import {
  getAssetDetailsSnapshot,
} from "../../services/assetDetailsService";

import {
  getMachineExecutions,
  getMachinePlans,
} from "../../services/preventiveMaintenanceService";

import type {
  MieRuleContext,
} from "./types";

function getStartOfDaysAgo(
  days: number,
): number {
  const date = new Date();

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

function isValidDateValue(
  value: string,
): boolean {
  return !Number.isNaN(
    new Date(
      value,
    ).getTime(),
  );
}

function isWithinLastDays(
  value: string,
  days: number,
): boolean {
  if (
    !isValidDateValue(
      value,
    )
  ) {
    return false;
  }

  return (
    new Date(
      value,
    ).getTime() >=
    getStartOfDaysAgo(
      days,
    )
  );
}

function getRecentWorkOrders(
  workOrders: WorkOrder[],
  days: number,
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
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
      workOrder.isDowntime,
  );
}

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

  return Math.max(
    60,
    Math.round(
      normalizedAvailability,
    ),
  );
}

function getDuePmCount(
  assetNumber: string,
): number {
  return getMachineExecutions(
    assetNumber,
  ).filter(
    (execution) =>
      execution.status ===
      "due",
  ).length;
}

function getOverduePmCount(
  assetNumber: string,
): number {
  const now =
    Date.now();

  return getMachineExecutions(
    assetNumber,
  ).filter(
    (execution) => {
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
        new Date(
          execution.dueAt,
        ).getTime();

      return (
        !Number.isNaN(
          dueTime,
        ) &&
        dueTime < now
      );
    },
  ).length;
}

export function buildMieRuleContext(
  assetNumber: string,
): MieRuleContext | null {
  const assetSnapshot =
    getAssetDetailsSnapshot(
      assetNumber,
    );

  if (!assetSnapshot) {
    return null;
  }

  const {
    asset,
    workOrders,
    openWorkOrders,
    closedWorkOrders,
    timeSummary,
  } = assetSnapshot;

  const preventiveMaintenancePlans =
    getMachinePlans(
      asset.assetNumber,
    );

  const preventiveMaintenanceExecutions =
    getMachineExecutions(
      asset.assetNumber,
    );

  const workOrdersLast7Days =
    getRecentWorkOrders(
      workOrders,
      7,
    );

  const workOrdersLast30Days =
    getRecentWorkOrders(
      workOrders,
      30,
    );

  const downtimeFailuresLast30Days =
    getDowntimeFailures(
      workOrdersLast30Days,
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
     * Legacy compatibility
     */
    machineCode:
      asset.assetCode,

    /*
     * Asset is now the source of truth
     */
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
      workOrdersLast7Days.length,

    failuresLast30Days:
      workOrdersLast30Days.length,

    downtimeFailuresLast30Days:
      downtimeFailuresLast30Days.length,

    /*
     * PM metrics
     */
    overduePmCount:
      getOverduePmCount(
        asset.assetNumber,
      ),

    duePmCount:
      getDuePmCount(
        asset.assetNumber,
      ),
  };
}