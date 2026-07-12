export type WorkOrderStatus = "open" | "paused" | "closed";

export type WorkOrderPriority = "high" | "medium" | "low";

export type WorkOrderType =
  | "fault"
  | "preventive"
  | "safety"
  | "improvement";

export type ReplacedPart = {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
};

export type WorkOrder = {
  id: string;

  workOrderNumber: string;

  machineCode: string;
  machineDisplayNumber: string;
  machineName: string;
  department: string;

  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;

  isDowntime: boolean;

  faultDescription: string;
  repairDescription: string;

  openedBy: string;
  openedAt: string;

  takenBy: string | null;
  takenAt: string | null;

  closedBy: string | null;
  closedAt: string | null;

  replacedParts: ReplacedPart[];

  openedWhileAnotherCallWasOpen: boolean;
};

export type CreateWorkOrderInput = {
  machineCode: string;
  machineDisplayNumber: string;
  machineName: string;
  department: string;

  type: WorkOrderType;
  priority: WorkOrderPriority;
  isDowntime: boolean;

  faultDescription: string;
  openedBy: string;
};