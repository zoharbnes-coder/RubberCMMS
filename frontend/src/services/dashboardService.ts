import { machines } from "../data/machines";
import { getWorkOrders } from "./workOrderService";
import type {
  WorkOrder,
  WorkOrderPriority,
} from "../types/workOrder";

export type MachineLiveStatus =
  | "running"
  | "warning"
  | "alarm";

export type DashboardOpenCall = {
  id: string;
  workOrderNumber: string;
  machineCode: string;
  machineDisplayNumber: string;
  machineName: string;
  department: string;
  faultDescription: string;
  priority: WorkOrderPriority;
  isDowntime: boolean;
  openedAt: string;
  openMinutes: number;
};

export type DashboardDowntimeMachine = {
  machineCode: string;
  machineDisplayNumber: string;
  machineName: string;
  department: string;
  downtimeMinutes: number;
};

export type DashboardMachineStatus = {
  machineCode: string;
  machineDisplayNumber: string;
  machineName: string;
  department: string;
  status: MachineLiveStatus;
  openWorkOrders: number;
  downtimeWorkOrders: number;
};

export type DashboardSnapshot = {
  generatedAt: string;

  openWorkOrders: number;
  pausedWorkOrders: number;
  downtimeMachines: number;
  closedToday: number;

  availabilityToday: number;
  downtimeMinutesToday: number;

  urgentOpenCalls: DashboardOpenCall[];
  topDowntimeMachines: DashboardDowntimeMachine[];
  machineStatuses: DashboardMachineStatus[];
};

const SHIFT_MINUTES = 9 * 60;

const priorityRank: Record<WorkOrderPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfToday(): Date {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function getElapsedMinutes(
  startValue: string,
  endValue: string | null = null
): number {
  const startTime = new Date(startValue).getTime();

  const endTime = endValue
    ? new Date(endValue).getTime()
    : Date.now();

  if (
    Number.isNaN(startTime) ||
    Number.isNaN(endTime) ||
    endTime <= startTime
  ) {
    return 0;
  }

  return Math.floor((endTime - startTime) / 60000);
}

function getOverlappingMinutes(
  workOrder: WorkOrder,
  rangeStart: Date,
  rangeEnd: Date
): number {
  if (!workOrder.isDowntime) {
    return 0;
  }

  const workOrderStart = new Date(
    workOrder.openedAt
  ).getTime();

  const workOrderEnd = workOrder.closedAt
    ? new Date(workOrder.closedAt).getTime()
    : Date.now();

  const overlapStart = Math.max(
    workOrderStart,
    rangeStart.getTime()
  );

  const overlapEnd = Math.min(
    workOrderEnd,
    rangeEnd.getTime(),
    Date.now()
  );

  if (
    Number.isNaN(overlapStart) ||
    Number.isNaN(overlapEnd) ||
    overlapEnd <= overlapStart
  ) {
    return 0;
  }

  return Math.floor(
    (overlapEnd - overlapStart) / 60000
  );
}

function calculateAvailabilityToday(
  workOrders: WorkOrder[]
): {
  availability: number;
  downtimeMinutes: number;
} {
  const activeMachines = machines.filter(
    (machine) => machine.active
  );

  if (activeMachines.length === 0) {
    return {
      availability: 100,
      downtimeMinutes: 0,
    };
  }

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const downtimeMinutes = workOrders.reduce(
    (total, workOrder) =>
      total +
      getOverlappingMinutes(
        workOrder,
        todayStart,
        todayEnd
      ),
    0
  );

  const plannedMachineMinutes =
    activeMachines.length * SHIFT_MINUTES;

  const availability =
    ((plannedMachineMinutes - downtimeMinutes) /
      plannedMachineMinutes) *
    100;

  return {
    availability: Math.max(
      0,
      Math.min(100, availability)
    ),
    downtimeMinutes,
  };
}

function buildUrgentOpenCalls(
  workOrders: WorkOrder[]
): DashboardOpenCall[] {
  return workOrders
    .filter(
      (workOrder) =>
        workOrder.status !== "closed"
    )
    .sort((first, second) => {
      if (
        first.isDowntime !== second.isDowntime
      ) {
        return first.isDowntime ? -1 : 1;
      }

      if (
        priorityRank[first.priority] !==
        priorityRank[second.priority]
      ) {
        return (
          priorityRank[first.priority] -
          priorityRank[second.priority]
        );
      }

      return (
        new Date(first.openedAt).getTime() -
        new Date(second.openedAt).getTime()
      );
    })
    .slice(0, 10)
    .map((workOrder) => ({
      id: workOrder.id,
      workOrderNumber:
        workOrder.workOrderNumber,
      machineCode: workOrder.machineCode,
      machineDisplayNumber:
        workOrder.machineDisplayNumber,
      machineName: workOrder.machineName,
      department: workOrder.department,
      faultDescription:
        workOrder.faultDescription,
      priority: workOrder.priority,
      isDowntime: workOrder.isDowntime,
      openedAt: workOrder.openedAt,
      openMinutes: getElapsedMinutes(
        workOrder.openedAt
      ),
    }));
}

function buildTopDowntimeMachines(
  workOrders: WorkOrder[]
): DashboardDowntimeMachine[] {
  const downtimeByMachine = new Map<
    string,
    DashboardDowntimeMachine
  >();

  workOrders
    .filter((workOrder) => workOrder.isDowntime)
    .forEach((workOrder) => {
      const downtimeMinutes = getElapsedMinutes(
        workOrder.openedAt,
        workOrder.closedAt
      );

      const existing = downtimeByMachine.get(
        workOrder.machineCode
      );

      if (existing) {
        downtimeByMachine.set(
          workOrder.machineCode,
          {
            ...existing,
            downtimeMinutes:
              existing.downtimeMinutes +
              downtimeMinutes,
          }
        );

        return;
      }

      downtimeByMachine.set(
        workOrder.machineCode,
        {
          machineCode: workOrder.machineCode,
          machineDisplayNumber:
            workOrder.machineDisplayNumber,
          machineName: workOrder.machineName,
          department: workOrder.department,
          downtimeMinutes,
        }
      );
    });

  return Array.from(
    downtimeByMachine.values()
  )
    .sort(
      (first, second) =>
        second.downtimeMinutes -
        first.downtimeMinutes
    )
    .slice(0, 5);
}

function buildMachineStatuses(
  workOrders: WorkOrder[]
): DashboardMachineStatus[] {
  const activeWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.status !== "closed"
  );

  return machines
    .filter((machine) => machine.active)
    .map((machine) => {
      const machineWorkOrders =
        activeWorkOrders.filter(
          (workOrder) =>
            workOrder.machineCode ===
            machine.code
        );

      const downtimeWorkOrders =
        machineWorkOrders.filter(
          (workOrder) =>
            workOrder.isDowntime
        );

      let status: MachineLiveStatus =
        "running";

      if (downtimeWorkOrders.length > 0) {
        status = "alarm";
      } else if (machineWorkOrders.length > 0) {
        status = "warning";
      }

      return {
        machineCode: machine.code,
        machineDisplayNumber:
          machine.displayNumber,
        machineName: machine.name,
        department: machine.department,
        status,
        openWorkOrders:
          machineWorkOrders.length,
        downtimeWorkOrders:
          downtimeWorkOrders.length,
      };
    });
}

export function getDashboardSnapshot(): DashboardSnapshot {
  const workOrders = getWorkOrders();

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const activeWorkOrders = workOrders.filter(
    (workOrder) =>
      workOrder.status !== "closed"
  );

  const downtimeMachineCodes = new Set(
    activeWorkOrders
      .filter(
        (workOrder) => workOrder.isDowntime
      )
      .map(
        (workOrder) =>
          workOrder.machineCode
      )
  );

  const closedToday = workOrders.filter(
    (workOrder) => {
      if (!workOrder.closedAt) {
        return false;
      }

      const closedTime = new Date(
        workOrder.closedAt
      ).getTime();

      return (
        closedTime >= todayStart.getTime() &&
        closedTime <= todayEnd.getTime()
      );
    }
  ).length;

  const availabilityResult =
    calculateAvailabilityToday(workOrders);

  return {
    generatedAt: new Date().toISOString(),

    openWorkOrders:
      activeWorkOrders.length,

    pausedWorkOrders:
      activeWorkOrders.filter(
        (workOrder) =>
          workOrder.status === "paused"
      ).length,

    downtimeMachines:
      downtimeMachineCodes.size,

    closedToday,

    availabilityToday:
      availabilityResult.availability,

    downtimeMinutesToday:
      availabilityResult.downtimeMinutes,

    urgentOpenCalls:
      buildUrgentOpenCalls(workOrders),

    topDowntimeMachines:
      buildTopDowntimeMachines(workOrders),

    machineStatuses:
      buildMachineStatuses(workOrders),
  };
}