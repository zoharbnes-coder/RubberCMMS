import type { WorkOrder } from "../../types/workOrder";

import {
  getMachineDetailsSnapshot,
} from "../../services/machineDetailsService";

import {
  getMachineExecutions,
  getMachinePlans,
} from "../../services/preventiveMaintenanceService";

import type {
  MieRuleContext,
} from "./types";

function getStartOfDaysAgo(
  days: number
): number {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date.getTime();
}

function isValidDateValue(
  value: string
): boolean {
  return !Number.isNaN(
    new Date(value).getTime()
  );
}

function isWithinLastDays(
  value: string,
  days: number
): boolean {
  if (!isValidDateValue(value)) {
    return false;
  }

  return (
    new Date(value).getTime() >=
    getStartOfDaysAgo(days)
  );
}

function getRecentWorkOrders(
  workOrders: WorkOrder[],
  days: number
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
      isWithinLastDays(
        workOrder.openedAt,
        days
      )
  );
}

function getDowntimeFailures(
  workOrders: WorkOrder[]
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
      workOrder.isDowntime
  );
}

function calculateBaseHealthScore(
  availabilityPercent: number
): number {
  if (
    !Number.isFinite(
      availabilityPercent
    )
  ) {
    return 100;
  }

  /*
   * בשלב הראשון ציון הבסיס נגזר מהזמינות,
   * אך נשמר בטווח 60–100.
   *
   * חוקי MIE יורידו ממנו נקודות בהתאם
   * לתקלות חוזרות, PM באיחור וגורמי סיכון.
   */
  const normalizedAvailability =
    Math.max(
      0,
      Math.min(
        100,
        availabilityPercent
      )
    );

  return Math.max(
    60,
    Math.round(
      normalizedAvailability
    )
  );
}

function getDuePmCount(
  assetNumber: string
): number {
  return getMachineExecutions(
    assetNumber
  ).filter(
    (execution) =>
      execution.status === "due"
  ).length;
}

function getOverduePmCount(
  assetNumber: string
): number {
  const now = Date.now();

  return getMachineExecutions(
    assetNumber
  ).filter((execution) => {
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
        execution.dueAt
      ).getTime();

    return (
      !Number.isNaN(dueTime) &&
      dueTime < now
    );
  }).length;
}

export function buildMieRuleContext(
  assetNumber: string
): MieRuleContext | null {
  const machineSnapshot =
    getMachineDetailsSnapshot(
      assetNumber
    );

  if (!machineSnapshot) {
    return null;
  }

  const {
    machine,
    workOrders,
    openWorkOrders,
    closedWorkOrders,
    timeSummary,
  } = machineSnapshot;

  const preventiveMaintenancePlans =
    getMachinePlans(
      machine.assetNumber
    );

  const preventiveMaintenanceExecutions =
    getMachineExecutions(
      machine.assetNumber
    );

  const workOrdersLast7Days =
    getRecentWorkOrders(
      workOrders,
      7
    );

  const workOrdersLast30Days =
    getRecentWorkOrders(
      workOrders,
      30
    );

  const downtimeFailuresLast30Days =
    getDowntimeFailures(
      workOrdersLast30Days
    );

  const availabilityPercent =
    Number.isFinite(
      machine.availability
    )
      ? machine.availability
      : 100;

  return {
    generatedAt:
      new Date().toISOString(),

    assetNumber:
      machine.assetNumber,

    machineCode:
      machine.machineCode,

    machine,

    workOrders,

    openWorkOrders,

    closedWorkOrders,

    preventiveMaintenancePlans,

    preventiveMaintenanceExecutions,

    currentHealthScore:
      calculateBaseHealthScore(
        availabilityPercent
      ),

    availabilityPercent,

    mttrHours:
      Number.isFinite(
        machine.mttrHours
      )
        ? machine.mttrHours
        : 0,

    mtbfHours:
      Number.isFinite(
        machine.mtbfHours
      )
        ? machine.mtbfHours
        : 0,

    totalDowntimeMinutes:
      Number.isFinite(
        timeSummary.totalDowntimeMinutes
      )
        ? timeSummary.totalDowntimeMinutes
        : 0,

    averageResponseMinutes:
      Number.isFinite(
        timeSummary.averageResponseMinutes
      )
        ? timeSummary.averageResponseMinutes
        : 0,

    averageRepairMinutes:
      Number.isFinite(
        timeSummary.averageRepairMinutes
      )
        ? timeSummary.averageRepairMinutes
        : 0,

    failuresLast7Days:
      workOrdersLast7Days.length,

    failuresLast30Days:
      workOrdersLast30Days.length,

    downtimeFailuresLast30Days:
      downtimeFailuresLast30Days.length,

    overduePmCount:
      getOverduePmCount(
        machine.assetNumber
      ),

    duePmCount:
      getDuePmCount(
        machine.assetNumber
      ),
  };
}