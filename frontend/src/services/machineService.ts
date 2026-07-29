import type {
  Machine,
  MachineStatus,
} from "../types/machine";

import type {
  WorkOrder,
} from "../types/workOrder";

import {
  getActiveMachines,
  getMachineByAssetNumber,
  getMachineByCode,
} from "./machineRepository";

import {
  getWorkOrders,
} from "./workOrderService";

/*
 * RubberMIP
 * Legacy Machine Compatibility Service
 *
 * Machine remains available for the
 * existing UI during the Asset migration.
 *
 * Work Orders are now Asset-native.
 *
 * Machine.machineCode corresponds to:
 *
 * Asset.assetCode
 *
 * Therefore Work Orders are matched by:
 *
 * WorkOrder.assetCode === Machine.machineCode
 */

/* -------------------------------- */
/* Status                           */
/* -------------------------------- */

function calculateMachineStatus(
  workOrders: WorkOrder[],
): MachineStatus {
  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  if (
    activeWorkOrders.some(
      (workOrder) =>
        workOrder.isDowntime,
    )
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

function calculateAvailability(
  workOrders: WorkOrder[],
): number {
  const downtimeMinutes =
    workOrders
      .filter(
        (workOrder) =>
          workOrder.isDowntime &&
          workOrder.type ===
            "fault",
      )
      .reduce(
        (
          total,
          workOrder,
        ) => {
          const startTime =
            new Date(
              workOrder.openedAt,
            ).getTime();

          const endTime =
            workOrder.closedAt
              ? new Date(
                  workOrder.closedAt,
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
            return total;
          }

          return (
            total +
            Math.floor(
              (endTime -
                startTime) /
                60000,
            )
          );
        },
        0,
      );

  /*
   * Legacy calculation retained here
   * only for compatibility.
   *
   * AssetService is the authoritative
   * operational KPI service.
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

/* -------------------------------- */
/* MTTR                             */
/* -------------------------------- */

function calculateMttrHours(
  workOrders: WorkOrder[],
): number {
  const closedFaultWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        workOrder.closedAt !==
          null &&
        workOrder.takenAt !==
          null,
    );

  if (
    closedFaultWorkOrders.length ===
    0
  ) {
    return 0;
  }

  const validRepairMinutes =
    closedFaultWorkOrders
      .map(
        (workOrder) => {
          if (
            !workOrder.takenAt ||
            !workOrder.closedAt
          ) {
            return null;
          }

          const startTime =
            new Date(
              workOrder.takenAt,
            ).getTime();

          const endTime =
            new Date(
              workOrder.closedAt,
            ).getTime();

          if (
            Number.isNaN(
              startTime,
            ) ||
            Number.isNaN(
              endTime,
            ) ||
            endTime <
              startTime
          ) {
            return null;
          }

          return (
            (endTime -
              startTime) /
            60000
          );
        },
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== null,
      );

  if (
    validRepairMinutes.length ===
    0
  ) {
    return 0;
  }

  const totalRepairMinutes =
    validRepairMinutes.reduce(
      (
        total,
        value,
      ) =>
        total + value,
      0,
    );

  return (
    totalRepairMinutes /
    validRepairMinutes.length /
    60
  );
}

/* -------------------------------- */
/* MTBF                             */
/* -------------------------------- */

function calculateMtbfHours(
  workOrders: WorkOrder[],
): number {
  const downtimeWorkOrders =
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
    downtimeWorkOrders.length <
    2
  ) {
    return 0;
  }

  const intervals:
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

    if (
      !previousClosedAt
    ) {
      continue;
    }

    const previousCloseTime =
      new Date(
        previousClosedAt,
      ).getTime();

    const currentOpenTime =
      new Date(
        downtimeWorkOrders[
          index
        ].openedAt,
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

    intervals.push(
      (currentOpenTime -
        previousCloseTime) /
        3600000,
    );
  }

  if (
    intervals.length === 0
  ) {
    return 0;
  }

  return (
    intervals.reduce(
      (
        total,
        value,
      ) =>
        total + value,
      0,
    ) /
    intervals.length
  );
}

/* -------------------------------- */
/* Machine enrichment               */
/* -------------------------------- */

function enrichMachine(
  machine: Machine,
): Machine {
  /*
   * Work Orders are now Asset-native.
   *
   * machineCode is retained only as the
   * legacy UI alias for assetCode.
   */
  const workOrders =
    getWorkOrders().filter(
      (workOrder) =>
        workOrder.assetCode ===
        machine.machineCode,
    );

  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !==
        "closed",
    );

  const downtimeWorkOrders =
    activeWorkOrders.filter(
      (workOrder) =>
        workOrder.isDowntime,
    );

  return {
    ...machine,

    status:
      calculateMachineStatus(
        workOrders,
      ),

    openWorkOrders:
      activeWorkOrders.length,

    downtimeWorkOrders:
      downtimeWorkOrders.length,

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
  };
}

/* -------------------------------- */
/* Public legacy API                */
/* -------------------------------- */

export function getLiveMachines():
  Machine[] {
  return getActiveMachines().map(
    enrichMachine,
  );
}

export function getLiveMachineByCode(
  machineCode: string,
): Machine | undefined {
  const machine =
    getMachineByCode(
      machineCode,
    );

  if (!machine) {
    return undefined;
  }

  return enrichMachine(
    machine,
  );
}

export function getLiveMachineByAssetNumber(
  assetNumber: string,
): Machine | undefined {
  const machine =
    getMachineByAssetNumber(
      assetNumber,
    );

  if (!machine) {
    return undefined;
  }

  return enrichMachine(
    machine,
  );
}

/*
 * Legacy function name retained because
 * older UI components still call:
 *
 * getMachineWorkOrders(machineCode)
 *
 * Internally the value is treated as
 * Asset.assetCode.
 */
export function getMachineWorkOrders(
  machineCode: string,
): WorkOrder[] {
  return getWorkOrders()
    .filter(
      (workOrder) =>
        workOrder.assetCode ===
        machineCode,
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