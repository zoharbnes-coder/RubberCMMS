import type { Machine } from "../types/machine";
import type { WorkOrder } from "../types/workOrder";

import {
  getLiveMachineByAssetNumber,
  getMachineWorkOrders,
} from "./machineService";

export type MachineWorkOrderSummary = {
  totalWorkOrders: number;
  openWorkOrders: number;
  pausedWorkOrders: number;
  closedWorkOrders: number;
  downtimeWorkOrders: number;
  openDowntimeWorkOrders: number;
};

export type MachineTimeSummary = {
  totalDowntimeMinutes: number;
  totalRepairMinutes: number;
  averageResponseMinutes: number;
  averageRepairMinutes: number;
};

export type MachineDetailsSnapshot = {
  generatedAt: string;

  machine: Machine;

  workOrders: WorkOrder[];
  openWorkOrders: WorkOrder[];
  closedWorkOrders: WorkOrder[];

  workOrderSummary: MachineWorkOrderSummary;
  timeSummary: MachineTimeSummary;

  lastWorkOrder: WorkOrder | null;
  lastClosedWorkOrder: WorkOrder | null;
};

function getDurationMinutes(
  startValue: string | null,
  endValue: string | null
): number {
  if (!startValue || !endValue) {
    return 0;
  }

  const startTime = new Date(startValue).getTime();
  const endTime = new Date(endValue).getTime();

  if (
    Number.isNaN(startTime) ||
    Number.isNaN(endTime) ||
    endTime <= startTime
  ) {
    return 0;
  }

  return Math.floor(
    (endTime - startTime) / 60000
  );
}

function getDowntimeMinutes(
  workOrder: WorkOrder
): number {
  if (!workOrder.isDowntime) {
    return 0;
  }

  return getDurationMinutes(
    workOrder.openedAt,
    workOrder.closedAt ??
      new Date().toISOString()
  );
}

function getRepairMinutes(
  workOrder: WorkOrder
): number {
  if (!workOrder.takenAt) {
    return 0;
  }

  return getDurationMinutes(
    workOrder.takenAt,
    workOrder.closedAt ??
      new Date().toISOString()
  );
}

function getResponseMinutes(
  workOrder: WorkOrder
): number {
  if (!workOrder.takenAt) {
    return 0;
  }

  return getDurationMinutes(
    workOrder.openedAt,
    workOrder.takenAt
  );
}

function calculateAverage(
  values: number[]
): number {
  const validValues = values.filter(
    (value) => value > 0
  );

  if (validValues.length === 0) {
    return 0;
  }

  const total = validValues.reduce(
    (sum, value) => sum + value,
    0
  );

  return total / validValues.length;
}

function buildWorkOrderSummary(
  workOrders: WorkOrder[]
): MachineWorkOrderSummary {
  const openWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.status !== "closed"
  );

  return {
    totalWorkOrders: workOrders.length,

    openWorkOrders:
      openWorkOrders.length,

    pausedWorkOrders:
      workOrders.filter(
        (workOrder) =>
          workOrder.status === "paused"
      ).length,

    closedWorkOrders:
      workOrders.filter(
        (workOrder) =>
          workOrder.status === "closed"
      ).length,

    downtimeWorkOrders:
      workOrders.filter(
        (workOrder) =>
          workOrder.isDowntime
      ).length,

    openDowntimeWorkOrders:
      openWorkOrders.filter(
        (workOrder) =>
          workOrder.isDowntime
      ).length,
  };
}

function buildTimeSummary(
  workOrders: WorkOrder[]
): MachineTimeSummary {
  const totalDowntimeMinutes =
    workOrders.reduce(
      (total, workOrder) =>
        total +
        getDowntimeMinutes(workOrder),
      0
    );

  const totalRepairMinutes =
    workOrders.reduce(
      (total, workOrder) =>
        total +
        getRepairMinutes(workOrder),
      0
    );

  const responseTimes =
    workOrders.map(
      getResponseMinutes
    );

  const repairTimes =
    workOrders.map(
      getRepairMinutes
    );

  return {
    totalDowntimeMinutes,

    totalRepairMinutes,

    averageResponseMinutes:
      calculateAverage(responseTimes),

    averageRepairMinutes:
      calculateAverage(repairTimes),
  };
}

export function getMachineDetailsSnapshot(
  assetNumber: string
): MachineDetailsSnapshot | null {
  const machine =
    getLiveMachineByAssetNumber(
      assetNumber
    );

  if (!machine) {
    return null;
  }

  const workOrders =
    getMachineWorkOrders(
      machine.machineCode
    );

  const openWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !== "closed"
    );

  const closedWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status === "closed"
    );

  return {
    generatedAt:
      new Date().toISOString(),

    machine,

    workOrders,

    openWorkOrders,

    closedWorkOrders,

    workOrderSummary:
      buildWorkOrderSummary(
        workOrders
      ),

    timeSummary:
      buildTimeSummary(
        workOrders
      ),

    lastWorkOrder:
      workOrders[0] ?? null,

    lastClosedWorkOrder:
      closedWorkOrders[0] ?? null,
  };
}