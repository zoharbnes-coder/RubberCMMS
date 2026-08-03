import type {
  CreateWorkOrderInput,
  ReplacedPart,
  WorkOrder,
} from "../types/workOrder";

/*
 * RubberMIP
 * Asset-native Work Order Service
 *
 * Work Orders are linked directly
 * to Asset identity:
 *
 * assetId
 * assetCode
 * assetNumber
 * assetName
 */

const STORAGE_KEY =
  "rubbermip_workorders_v2";

/* -------------------------------- */
/* ID generation                    */
/* -------------------------------- */

function generateId():
  string {
  const browserCrypto =
    globalThis.crypto;

  if (
    browserCrypto &&
    typeof browserCrypto.randomUUID ===
      "function"
  ) {
    return browserCrypto.randomUUID();
  }

  if (
    browserCrypto &&
    typeof browserCrypto.getRandomValues ===
      "function"
  ) {
    const randomValues =
      new Uint8Array(
        16,
      );

    browserCrypto.getRandomValues(
      randomValues,
    );

    /*
     * RFC 4122 version 4 UUID.
     */
    randomValues[6] =
      (
        randomValues[6] &
        0x0f
      ) |
      0x40;

    randomValues[8] =
      (
        randomValues[8] &
        0x3f
      ) |
      0x80;

    const hexadecimal =
      Array.from(
        randomValues,
        (value) =>
          value
            .toString(
              16,
            )
            .padStart(
              2,
              "0",
            ),
      ).join("");

    return [
      hexadecimal.slice(
        0,
        8,
      ),

      hexadecimal.slice(
        8,
        12,
      ),

      hexadecimal.slice(
        12,
        16,
      ),

      hexadecimal.slice(
        16,
        20,
      ),

      hexadecimal.slice(
        20,
        32,
      ),
    ].join("-");
  }

  /*
   * Final compatibility fallback for
   * browsers without Web Crypto support.
   */
  return [
    Date.now().toString(
      36,
    ),

    Math.random()
      .toString(
        36,
      )
      .slice(
        2,
      ),

    Math.random()
      .toString(
        36,
      )
      .slice(
        2,
      ),
  ].join("-");
}

/* -------------------------------- */
/* Storage                          */
/* -------------------------------- */

function loadWorkOrders():
  WorkOrder[] {
  const data =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (!data) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        data,
      );

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return [];
    }

    return parsed as WorkOrder[];
  } catch {
    return [];
  }
}

function saveWorkOrders(
  workOrders:
    WorkOrder[],
): void {
  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify(
      workOrders,
    ),
  );
}

/* -------------------------------- */
/* Work Order number                */
/* -------------------------------- */

function generateWorkOrderNumber():
  string {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() +
        1,
    ).padStart(
      2,
      "0",
    );

  const prefix =
    `${year}${month}`;

  const current =
    loadWorkOrders();

  const thisMonth =
    current.filter(
      (workOrder) =>
        workOrder.workOrderNumber.startsWith(
          `${prefix}-`,
        ),
    );

  const highestNumber =
    thisMonth.reduce(
      (
        highest,
        workOrder,
      ) => {
        const parts =
          workOrder.workOrderNumber.split(
            "-",
          );

        const runningNumber =
          Number(
            parts[1],
          );

        if (
          Number.isNaN(
            runningNumber,
          )
        ) {
          return highest;
        }

        return Math.max(
          highest,
          runningNumber,
        );
      },

      0,
    );

  const nextNumber =
    String(
      highestNumber +
        1,
    ).padStart(
      4,
      "0",
    );

  return `${prefix}-${nextNumber}`;
}

/* -------------------------------- */
/* Read                             */
/* -------------------------------- */

export function getWorkOrders():
  WorkOrder[] {
  return loadWorkOrders();
}

export function getWorkOrderById(
  workOrderId: string,
): WorkOrder | undefined {
  return loadWorkOrders().find(
    (workOrder) =>
      workOrder.id ===
      workOrderId,
  );
}

export function getWorkOrdersByAssetId(
  assetId: string,
): WorkOrder[] {
  return loadWorkOrders()
    .filter(
      (workOrder) =>
        workOrder.assetId ===
        assetId,
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

export function getWorkOrdersByAssetCode(
  assetCode: string,
): WorkOrder[] {
  return loadWorkOrders()
    .filter(
      (workOrder) =>
        workOrder.assetCode ===
        assetCode,
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

/* -------------------------------- */
/* Create                           */
/* -------------------------------- */

export function createWorkOrder(
  input:
    CreateWorkOrderInput,
): WorkOrder {
  const workOrders =
    loadWorkOrders();

  const alreadyOpen =
    workOrders.some(
      (workOrder) =>
        workOrder.assetId ===
          input.assetId &&
        workOrder.status !==
          "closed",
    );

  const timestamp =
    new Date().toISOString();

  const newWorkOrder:
    WorkOrder = {
    id:
      generateId(),

    workOrderNumber:
      generateWorkOrderNumber(),

    /*
     * Asset identity
     */
    assetId:
      input.assetId,

    assetCode:
      input.assetCode,

    assetNumber:
      input.assetNumber,

    assetName:
      input.assetName,

    /*
     * Organizational context
     */
    department:
      input.department,

    /*
     * Classification
     */
    type:
      input.type,

    status:
      "open",

    priority:
      input.priority,

    isDowntime:
      input.isDowntime,

    /*
     * Description
     */
    faultDescription:
      input.faultDescription.trim(),

    repairDescription:
      "",

    /*
     * Opening
     */
    openedBy:
      input.openedBy,

    openedAt:
      timestamp,

    /*
     * Technician response
     */
    takenBy:
      null,

    takenAt:
      null,

    /*
     * Closure
     */
    closedBy:
      null,

    closedAt:
      null,

    /*
     * Parts
     */
    replacedParts:
      [],

    /*
     * Duplicate tracking
     */
    openedWhileAnotherCallWasOpen:
      alreadyOpen,
  };

  workOrders.push(
    newWorkOrder,
  );

  saveWorkOrders(
    workOrders,
  );

  return newWorkOrder;
}

/* -------------------------------- */
/* Start                            */
/* -------------------------------- */

export function startWorkOrder(
  workOrderId: string,
  username: string,
): WorkOrder {
  const workOrders =
    loadWorkOrders();

  const workOrder =
    workOrders.find(
      (item) =>
        item.id ===
        workOrderId,
    );

  if (!workOrder) {
    throw new Error(
      "הקריאה לא נמצאה.",
    );
  }

  if (
    workOrder.status ===
    "closed"
  ) {
    throw new Error(
      "לא ניתן להתחיל טיפול בקריאה סגורה.",
    );
  }

  if (
    !workOrder.takenAt
  ) {
    workOrder.takenAt =
      new Date().toISOString();

    workOrder.takenBy =
      username;
  }

  workOrder.status =
    "open";

  saveWorkOrders(
    workOrders,
  );

  return workOrder;
}

/* -------------------------------- */
/* Pause                            */
/* -------------------------------- */

export function pauseWorkOrder(
  workOrderId: string,
): WorkOrder {
  const workOrders =
    loadWorkOrders();

  const workOrder =
    workOrders.find(
      (item) =>
        item.id ===
        workOrderId,
    );

  if (!workOrder) {
    throw new Error(
      "הקריאה לא נמצאה.",
    );
  }

  if (
    workOrder.status ===
    "closed"
  ) {
    throw new Error(
      "לא ניתן להשהות קריאה סגורה.",
    );
  }

  workOrder.status =
    "paused";

  saveWorkOrders(
    workOrders,
  );

  return workOrder;
}

/* -------------------------------- */
/* Close                            */
/* -------------------------------- */

type CloseWorkOrderInput = {
  workOrderId: string;

  username: string;

  repairDescription:
    string;

  replacedParts:
    ReplacedPart[];
};

export function closeWorkOrder(
  input:
    CloseWorkOrderInput,
): WorkOrder {
  const workOrders =
    loadWorkOrders();

  const workOrder =
    workOrders.find(
      (item) =>
        item.id ===
        input.workOrderId,
    );

  if (!workOrder) {
    throw new Error(
      "הקריאה לא נמצאה.",
    );
  }

  const repairDescription =
    input.repairDescription.trim();

  if (
    !repairDescription
  ) {
    throw new Error(
      "תיאור הטיפול הוא שדה חובה.",
    );
  }

  if (
    workOrder.status ===
    "closed"
  ) {
    throw new Error(
      "הקריאה כבר סגורה.",
    );
  }

  workOrder.status =
    "closed";

  workOrder.repairDescription =
    repairDescription;

  workOrder.closedBy =
    input.username;

  workOrder.closedAt =
    new Date().toISOString();

  workOrder.replacedParts =
    input.replacedParts;

  saveWorkOrders(
    workOrders,
  );

  return workOrder;
}