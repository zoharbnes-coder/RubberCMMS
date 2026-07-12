import type {
  Machine,
  MachineStatus,
} from "../types/machine";
import type { WorkOrder } from "../types/workOrder";

import {
  getActiveMachines,
  getMachineByAssetNumber,
  getMachineByCode,
} from "./machineRepository";
import { getWorkOrders } from "./workOrderService";

function calculateMachineStatus(
  workOrders: WorkOrder[]
): MachineStatus {
  const activeWorkOrders = workOrders.filter(
    (workOrder) => workOrder.status !== "closed"
  );

  if (
    activeWorkOrders.some(
      (workOrder) => workOrder.isDowntime
    )
  ) {
    return "alarm";
  }

  if (activeWorkOrders.length > 0) {
    return "warning";
  }

  return "running";
}

function calculateAvailability(
  workOrders: WorkOrder[]
): number {
  const downtimeMinutes = workOrders
    .filter((workOrder) => workOrder.isDowntime)
    .reduce((total, workOrder) => {
      const startTime = new Date(
        workOrder.openedAt
      ).getTime();

      const endTime = workOrder.closedAt
        ? new Date(workOrder.closedAt).getTime()
        : Date.now();

      if (
        Number.isNaN(startTime) ||
        Number.isNaN(endTime) ||
        endTime <= startTime
      ) {
        return total;
      }

      return (
        total +
        Math.floor(
          (endTime - startTime) / 60000
        )
      );
    }, 0);

  const plannedMinutes = 9 * 60;

  const availability =
    ((plannedMinutes - downtimeMinutes) /
      plannedMinutes) *
    100;

  return Math.max(
    0,
    Math.min(100, availability)
  );
}

function calculateMttrHours(
  workOrders: WorkOrder[]
): number {
  const closedWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.closedAt !== null &&
      workOrder.takenAt !== null
  );

  if (closedWorkOrders.length === 0) {
    return 0;
  }

  const totalRepairMinutes =
    closedWorkOrders.reduce(
      (total, workOrder) => {
        if (
          !workOrder.takenAt ||
          !workOrder.closedAt
        ) {
          return total;
        }

        const startTime = new Date(
          workOrder.takenAt
        ).getTime();

        const endTime = new Date(
          workOrder.closedAt
        ).getTime();

        if (
          Number.isNaN(startTime) ||
          Number.isNaN(endTime) ||
          endTime <= startTime
        ) {
          return total;
        }

        return (
          total +
          Math.floor(
            (endTime - startTime) / 60000
          )
        );
      },
      0
    );

  return (
    totalRepairMinutes /
    closedWorkOrders.length /
    60
  );
}

function calculateMtbfHours(
  workOrders: WorkOrder[]
): number {
  const downtimeWorkOrders = workOrders
    .filter(
      (workOrder) =>
        workOrder.isDowntime &&
        workOrder.closedAt !== null
    )
    .sort(
      (first, second) =>
        new Date(first.openedAt).getTime() -
        new Date(second.openedAt).getTime()
    );

  if (downtimeWorkOrders.length < 2) {
    return 0;
  }

  const intervals: number[] = [];

  for (
    let index = 1;
    index < downtimeWorkOrders.length;
    index += 1
  ) {
    const previousClosedAt =
      downtimeWorkOrders[index - 1].closedAt;

    if (!previousClosedAt) {
      continue;
    }

    const previousCloseTime = new Date(
      previousClosedAt
    ).getTime();

    const currentOpenTime = new Date(
      downtimeWorkOrders[index].openedAt
    ).getTime();

    if (
      Number.isNaN(previousCloseTime) ||
      Number.isNaN(currentOpenTime) ||
      currentOpenTime <= previousCloseTime
    ) {
      continue;
    }

    intervals.push(
      (currentOpenTime -
        previousCloseTime) /
        3600000
    );
  }

  if (intervals.length === 0) {
    return 0;
  }

  return (
    intervals.reduce(
      (total, value) => total + value,
      0
    ) / intervals.length
  );
}

function enrichMachine(
  machine: Machine
): Machine {
  const workOrders = getWorkOrders().filter(
    (workOrder) =>
      workOrder.machineCode ===
      machine.machineCode
  );

  const activeWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.status !== "closed"
  );

  const downtimeWorkOrders =
    activeWorkOrders.filter(
      (workOrder) =>
        workOrder.isDowntime
    );

  return {
    ...machine,

    status:
      calculateMachineStatus(workOrders),

    openWorkOrders:
      activeWorkOrders.length,

    downtimeWorkOrders:
      downtimeWorkOrders.length,

    mttrHours:
      calculateMttrHours(workOrders),

    mtbfHours:
      calculateMtbfHours(workOrders),

    availability:
      calculateAvailability(workOrders),
  };
}

export function getLiveMachines(): Machine[] {
  return getActiveMachines().map(
    enrichMachine
  );
}

export function getLiveMachineByCode(
  machineCode: string
): Machine | undefined {
  const machine =
    getMachineByCode(machineCode);

  if (!machine) {
    return undefined;
  }

  return enrichMachine(machine);
}

export function getLiveMachineByAssetNumber(
  assetNumber: string
): Machine | undefined {
  const machine =
    getMachineByAssetNumber(assetNumber);

  if (!machine) {
    return undefined;
  }

  return enrichMachine(machine);
}

export function getMachineWorkOrders(
  machineCode: string
): WorkOrder[] {
  return getWorkOrders()
    .filter(
      (workOrder) =>
        workOrder.machineCode ===
        machineCode
    )
    .sort(
      (first, second) =>
        new Date(
          second.openedAt
        ).getTime() -
        new Date(
          first.openedAt
        ).getTime()
    );
}