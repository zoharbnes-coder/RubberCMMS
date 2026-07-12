import type {
  CreateWorkOrderInput,
  ReplacedPart,
  WorkOrder,
} from "../types/workOrder";

const STORAGE_KEY = "rubbercmms_workorders";

function loadWorkOrders(): WorkOrder[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as WorkOrder[];
  } catch {
    return [];
  }
}

function saveWorkOrders(workOrders: WorkOrder[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(workOrders)
  );
}

function generateWorkOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}${month}`;

  const current = loadWorkOrders();

  const thisMonth = current.filter((workOrder) =>
    workOrder.workOrderNumber.startsWith(prefix)
  );

  const highestNumber = thisMonth.reduce(
    (highest, workOrder) => {
      const runningNumber = Number(
        workOrder.workOrderNumber.split("-")[1]
      );

      return Number.isNaN(runningNumber)
        ? highest
        : Math.max(highest, runningNumber);
    },
    0
  );

  const nextNumber = String(highestNumber + 1).padStart(4, "0");

  return `${prefix}-${nextNumber}`;
}

export function getWorkOrders(): WorkOrder[] {
  return loadWorkOrders();
}

export function getWorkOrderById(
  workOrderId: string
): WorkOrder | undefined {
  return loadWorkOrders().find(
    (workOrder) => workOrder.id === workOrderId
  );
}

export function createWorkOrder(
  input: CreateWorkOrderInput
): WorkOrder {
  const workOrders = loadWorkOrders();

  const alreadyOpen = workOrders.some(
    (workOrder) =>
      workOrder.machineCode === input.machineCode &&
      workOrder.status !== "closed"
  );

  const newWorkOrder: WorkOrder = {
    id: crypto.randomUUID(),
    workOrderNumber: generateWorkOrderNumber(),

    machineCode: input.machineCode,
    machineDisplayNumber: input.machineDisplayNumber,
    machineName: input.machineName,
    department: input.department,

    type: input.type,
    priority: input.priority,
    status: "open",
    isDowntime: input.isDowntime,

    faultDescription: input.faultDescription,
    repairDescription: "",

    openedBy: input.openedBy,
    openedAt: new Date().toISOString(),

    takenBy: null,
    takenAt: null,

    closedBy: null,
    closedAt: null,

    replacedParts: [],

    openedWhileAnotherCallWasOpen: alreadyOpen,
  };

  workOrders.push(newWorkOrder);
  saveWorkOrders(workOrders);

  return newWorkOrder;
}

export function startWorkOrder(
  workOrderId: string,
  username: string
): WorkOrder {
  const workOrders = loadWorkOrders();

  const workOrder = workOrders.find(
    (item) => item.id === workOrderId
  );

  if (!workOrder) {
    throw new Error("הקריאה לא נמצאה.");
  }

  if (workOrder.status === "closed") {
    throw new Error("לא ניתן להתחיל טיפול בקריאה סגורה.");
  }

  if (!workOrder.takenAt) {
    workOrder.takenAt = new Date().toISOString();
    workOrder.takenBy = username;
  }

  workOrder.status = "open";

  saveWorkOrders(workOrders);

  return workOrder;
}

export function pauseWorkOrder(
  workOrderId: string
): WorkOrder {
  const workOrders = loadWorkOrders();

  const workOrder = workOrders.find(
    (item) => item.id === workOrderId
  );

  if (!workOrder) {
    throw new Error("הקריאה לא נמצאה.");
  }

  if (workOrder.status === "closed") {
    throw new Error("לא ניתן להשהות קריאה סגורה.");
  }

  workOrder.status = "paused";

  saveWorkOrders(workOrders);

  return workOrder;
}

type CloseWorkOrderInput = {
  workOrderId: string;
  username: string;
  repairDescription: string;
  replacedParts: ReplacedPart[];
};

export function closeWorkOrder(
  input: CloseWorkOrderInput
): WorkOrder {
  const workOrders = loadWorkOrders();

  const workOrder = workOrders.find(
    (item) => item.id === input.workOrderId
  );

  if (!workOrder) {
    throw new Error("הקריאה לא נמצאה.");
  }

  if (!input.repairDescription.trim()) {
    throw new Error("תיאור הטיפול הוא שדה חובה.");
  }

  if (workOrder.status === "closed") {
    throw new Error("הקריאה כבר סגורה.");
  }

  workOrder.status = "closed";
  workOrder.repairDescription =
    input.repairDescription.trim();
  workOrder.closedBy = input.username;
  workOrder.closedAt = new Date().toISOString();
  workOrder.replacedParts = input.replacedParts;

  saveWorkOrders(workOrders);

  return workOrder;
}