import {
  machines as sourceMachines,
  type Machine as SourceMachine,
} from "../data/machines";

import type {
  Machine,
  MachineCriticality,
  MachineStatus,
} from "../types/machine";

const STORAGE_KEY =
  "rubbermip_machine_repository_v1";

export type CreateMachineInput = {
  assetNumber: string;
  machineCode: string;
  displayName: string;
  shortName: string;

  department: string;
  area: string;
  location: string;

  manufacturer: string;
  model: string;
  serialNumber: string;

  installationDate: string;
  criticality: MachineCriticality;

  active: boolean;
  status: MachineStatus;
};

export type UpdateMachineInput =
  Partial<CreateMachineInput>;

export type MachineRepositoryResult = {
  success: boolean;
  machine: Machine | null;
  message: string;
};

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `machine-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeValue(
  value: string
): string {
  return value.trim();
}

function normalizeCode(
  value: string
): string {
  return normalizeValue(value).toUpperCase();
}

function normalizeAssetNumber(
  value: string
): string {
  return normalizeValue(value);
}

function getDefaultCriticality(
  machine: SourceMachine
): MachineCriticality {
  const normalizedDepartment =
    machine.department.toLowerCase();

  if (
    normalizedDepartment.includes(
      "תערובות"
    ) ||
    normalizedDepartment.includes(
      "ערבול"
    )
  ) {
    return "critical";
  }

  return "medium";
}

function mapSourceMachine(
  sourceMachine: SourceMachine
): Machine {
  return {
    id:
      sourceMachine.code ||
      createId(),

    assetNumber:
      sourceMachine.displayNumber,

    machineCode:
      sourceMachine.code,

    displayName:
      sourceMachine.name,

    shortName:
      sourceMachine.name,

    department:
      sourceMachine.department,

    area:
      sourceMachine.department,

    location: "",

    manufacturer: "",
    model: "",
    serialNumber: "",

    installationDate: "",

    criticality:
      getDefaultCriticality(
        sourceMachine
      ),

    active:
      sourceMachine.active,

    status: "running",

    openWorkOrders: 0,
    downtimeWorkOrders: 0,

    mttrHours: 0,
    mtbfHours: 0,
    availability: 100,

    preventivePlanCount: 0,
    sparePartsCount: 0,

    drawings: 0,
    manuals: 0,
    images: 0,
  };
}

function createInitialMachines():
  Machine[] {
  return sourceMachines.map(
    mapSourceMachine
  );
}

function isMachine(
  value: unknown
): value is Machine {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const machine =
    value as Partial<Machine>;

  return (
    typeof machine.id === "string" &&
    typeof machine.assetNumber ===
      "string" &&
    typeof machine.machineCode ===
      "string" &&
    typeof machine.displayName ===
      "string" &&
    typeof machine.department ===
      "string" &&
    typeof machine.active ===
      "boolean"
  );
}

function sanitizeMachine(
  machine: Machine
): Machine {
  return {
    ...machine,

    id:
      normalizeValue(machine.id) ||
      createId(),

    assetNumber:
      normalizeAssetNumber(
        machine.assetNumber
      ),

    machineCode:
      normalizeCode(
        machine.machineCode
      ),

    displayName:
      normalizeValue(
        machine.displayName
      ),

    shortName:
      normalizeValue(
        machine.shortName
      ),

    department:
      normalizeValue(
        machine.department
      ),

    area:
      normalizeValue(machine.area),

    location:
      normalizeValue(
        machine.location
      ),

    manufacturer:
      normalizeValue(
        machine.manufacturer
      ),

    model:
      normalizeValue(machine.model),

    serialNumber:
      normalizeValue(
        machine.serialNumber
      ),

    installationDate:
      normalizeValue(
        machine.installationDate
      ),

    openWorkOrders:
      Number.isFinite(
        machine.openWorkOrders
      )
        ? Math.max(
            0,
            machine.openWorkOrders
          )
        : 0,

    downtimeWorkOrders:
      Number.isFinite(
        machine.downtimeWorkOrders
      )
        ? Math.max(
            0,
            machine.downtimeWorkOrders
          )
        : 0,

    mttrHours:
      Number.isFinite(
        machine.mttrHours
      )
        ? Math.max(
            0,
            machine.mttrHours
          )
        : 0,

    mtbfHours:
      Number.isFinite(
        machine.mtbfHours
      )
        ? Math.max(
            0,
            machine.mtbfHours
          )
        : 0,

    availability:
      Number.isFinite(
        machine.availability
      )
        ? Math.max(
            0,
            Math.min(
              100,
              machine.availability
            )
          )
        : 100,

    preventivePlanCount:
      Number.isFinite(
        machine.preventivePlanCount
      )
        ? Math.max(
            0,
            machine.preventivePlanCount
          )
        : 0,

    sparePartsCount:
      Number.isFinite(
        machine.sparePartsCount
      )
        ? Math.max(
            0,
            machine.sparePartsCount
          )
        : 0,

    drawings:
      Number.isFinite(
        machine.drawings
      )
        ? Math.max(
            0,
            machine.drawings
          )
        : 0,

    manuals:
      Number.isFinite(
        machine.manuals
      )
        ? Math.max(
            0,
            machine.manuals
          )
        : 0,

    images:
      Number.isFinite(
        machine.images
      )
        ? Math.max(
            0,
            machine.images
          )
        : 0,
  };
}

function saveMachines(
  machines: Machine[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      machines.map(sanitizeMachine)
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      "rubbermip-machines-changed"
    )
  );
}

function loadMachines(): Machine[] {
  const storedValue =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!storedValue) {
    const initialMachines =
      createInitialMachines();

    saveMachines(initialMachines);

    return initialMachines;
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "Machine repository is not an array"
      );
    }

    const validMachines =
      parsedValue
        .filter(isMachine)
        .map(sanitizeMachine);

    if (
      validMachines.length === 0 &&
      sourceMachines.length > 0
    ) {
      const initialMachines =
        createInitialMachines();

      saveMachines(initialMachines);

      return initialMachines;
    }

    return validMachines;
  } catch {
    const initialMachines =
      createInitialMachines();

    saveMachines(initialMachines);

    return initialMachines;
  }
}

function findDuplicateAssetNumber(
  machines: Machine[],
  assetNumber: string,
  excludedId?: string
): Machine | undefined {
  const normalizedAssetNumber =
    normalizeAssetNumber(
      assetNumber
    ).toLowerCase();

  return machines.find(
    (machine) =>
      machine.id !== excludedId &&
      machine.assetNumber
        .toLowerCase() ===
        normalizedAssetNumber
  );
}

function findDuplicateMachineCode(
  machines: Machine[],
  machineCode: string,
  excludedId?: string
): Machine | undefined {
  const normalizedMachineCode =
    normalizeCode(
      machineCode
    ).toLowerCase();

  return machines.find(
    (machine) =>
      machine.id !== excludedId &&
      machine.machineCode
        .toLowerCase() ===
        normalizedMachineCode
  );
}

function validateRequiredFields(
  input: CreateMachineInput
): string | null {
  if (
    !normalizeValue(
      input.assetNumber
    )
  ) {
    return "חובה להזין מספר מכונה.";
  }

  if (
    !normalizeValue(
      input.machineCode
    )
  ) {
    return "חובה להזין קוד מכונה.";
  }

  if (
    !normalizeValue(
      input.displayName
    )
  ) {
    return "חובה להזין שם מכונה.";
  }

  if (
    !normalizeValue(
      input.department
    )
  ) {
    return "חובה לבחור מחלקה.";
  }

  return null;
}

function buildMachine(
  input: CreateMachineInput
): Machine {
  return sanitizeMachine({
    id: createId(),

    assetNumber:
      input.assetNumber,

    machineCode:
      input.machineCode,

    displayName:
      input.displayName,

    shortName:
      input.shortName ||
      input.displayName,

    department:
      input.department,

    area:
      input.area,

    location:
      input.location,

    manufacturer:
      input.manufacturer,

    model:
      input.model,

    serialNumber:
      input.serialNumber,

    installationDate:
      input.installationDate,

    criticality:
      input.criticality,

    active:
      input.active,

    status:
      input.status,

    openWorkOrders: 0,
    downtimeWorkOrders: 0,

    mttrHours: 0,
    mtbfHours: 0,
    availability: 100,

    preventivePlanCount: 0,
    sparePartsCount: 0,

    drawings: 0,
    manuals: 0,
    images: 0,
  });
}

export function getMachines():
  Machine[] {
  return loadMachines();
}

export function getActiveMachines():
  Machine[] {
  return loadMachines().filter(
    (machine) =>
      machine.active
  );
}

export function getInactiveMachines():
  Machine[] {
  return loadMachines().filter(
    (machine) =>
      !machine.active
  );
}

export function getMachineById(
  machineId: string
): Machine | undefined {
  return loadMachines().find(
    (machine) =>
      machine.id === machineId
  );
}

export function getMachineByCode(
  machineCode: string
): Machine | undefined {
  const normalizedMachineCode =
    normalizeCode(machineCode);

  return loadMachines().find(
    (machine) =>
      machine.machineCode ===
      normalizedMachineCode
  );
}

export function getMachineByAssetNumber(
  assetNumber: string
): Machine | undefined {
  const normalizedAssetNumber =
    normalizeAssetNumber(
      assetNumber
    );

  return loadMachines().find(
    (machine) =>
      machine.assetNumber ===
      normalizedAssetNumber
  );
}

export function getMachinesByDepartment(
  department: string
): Machine[] {
  const normalizedDepartment =
    normalizeValue(department);

  return loadMachines().filter(
    (machine) =>
      machine.active &&
      machine.department ===
        normalizedDepartment
  );
}

export function getMachineDepartments():
  string[] {
  return Array.from(
    new Set(
      loadMachines()
        .map(
          (machine) =>
            machine.department
        )
        .filter(Boolean)
    )
  ).sort((first, second) =>
    first.localeCompare(
      second,
      "he"
    )
  );
}

export function createMachine(
  input: CreateMachineInput
): MachineRepositoryResult {
  const validationError =
    validateRequiredFields(input);

  if (validationError) {
    return {
      success: false,
      machine: null,
      message: validationError,
    };
  }

  const machines =
    loadMachines();

  if (
    findDuplicateAssetNumber(
      machines,
      input.assetNumber
    )
  ) {
    return {
      success: false,
      machine: null,
      message:
        "כבר קיימת מכונה עם מספר זה.",
    };
  }

  if (
    findDuplicateMachineCode(
      machines,
      input.machineCode
    )
  ) {
    return {
      success: false,
      machine: null,
      message:
        "כבר קיימת מכונה עם קוד זה.",
    };
  }

  const machine =
    buildMachine(input);

  saveMachines([
    ...machines,
    machine,
  ]);

  return {
    success: true,
    machine,
    message:
      "המכונה נוספה בהצלחה.",
  };
}

export function updateMachine(
  machineId: string,
  updates: UpdateMachineInput
): MachineRepositoryResult {
  const machines =
    loadMachines();

  const machineIndex =
    machines.findIndex(
      (machine) =>
        machine.id === machineId
    );

  if (machineIndex < 0) {
    return {
      success: false,
      machine: null,
      message:
        "המכונה לא נמצאה.",
    };
  }

  const currentMachine =
    machines[machineIndex];

  const candidateInput:
    CreateMachineInput = {
      assetNumber:
        updates.assetNumber ??
        currentMachine.assetNumber,

      machineCode:
        updates.machineCode ??
        currentMachine.machineCode,

      displayName:
        updates.displayName ??
        currentMachine.displayName,

      shortName:
        updates.shortName ??
        currentMachine.shortName,

      department:
        updates.department ??
        currentMachine.department,

      area:
        updates.area ??
        currentMachine.area,

      location:
        updates.location ??
        currentMachine.location,

      manufacturer:
        updates.manufacturer ??
        currentMachine.manufacturer,

      model:
        updates.model ??
        currentMachine.model,

      serialNumber:
        updates.serialNumber ??
        currentMachine.serialNumber,

      installationDate:
        updates.installationDate ??
        currentMachine.installationDate,

      criticality:
        updates.criticality ??
        currentMachine.criticality,

      active:
        updates.active ??
        currentMachine.active,

      status:
        updates.status ??
        currentMachine.status,
    };

  const validationError =
    validateRequiredFields(
      candidateInput
    );

  if (validationError) {
    return {
      success: false,
      machine: null,
      message: validationError,
    };
  }

  if (
    findDuplicateAssetNumber(
      machines,
      candidateInput.assetNumber,
      machineId
    )
  ) {
    return {
      success: false,
      machine: null,
      message:
        "כבר קיימת מכונה אחרת עם מספר זה.",
    };
  }

  if (
    findDuplicateMachineCode(
      machines,
      candidateInput.machineCode,
      machineId
    )
  ) {
    return {
      success: false,
      machine: null,
      message:
        "כבר קיימת מכונה אחרת עם קוד זה.",
    };
  }

  const updatedMachine =
    sanitizeMachine({
      ...currentMachine,
      ...candidateInput,
      id: currentMachine.id,
    });

  machines[machineIndex] =
    updatedMachine;

  saveMachines(machines);

  return {
    success: true,
    machine: updatedMachine,
    message:
      "פרטי המכונה עודכנו בהצלחה.",
  };
}

export function setMachineActive(
  machineId: string,
  active: boolean
): MachineRepositoryResult {
  return updateMachine(
    machineId,
    {
      active,
      status: active
        ? "running"
        : "maintenance",
    }
  );
}

export function updateMachineStatus(
  machineId: string,
  status: MachineStatus
): MachineRepositoryResult {
  return updateMachine(
    machineId,
    {
      status,
    }
  );
}

export function deleteMachine(
  machineId: string
): MachineRepositoryResult {
  const machines =
    loadMachines();

  const machine =
    machines.find(
      (item) =>
        item.id === machineId
    );

  if (!machine) {
    return {
      success: false,
      machine: null,
      message:
        "המכונה לא נמצאה.",
    };
  }

  /*
   * מחיקה מיועדת רק למכונה שנוצרה בטעות.
   * בשימוש רגיל עדיף להשבית מכונה כדי לשמור
   * את היסטוריית הקריאות והטיפולים שלה.
   */
  const updatedMachines =
    machines.filter(
      (item) =>
        item.id !== machineId
    );

  saveMachines(updatedMachines);

  return {
    success: true,
    machine,
    message:
      "המכונה נמחקה מהמאגר.",
  };
}

export function resetMachineRepository():
  Machine[] {
  const initialMachines =
    createInitialMachines();

  saveMachines(initialMachines);

  return initialMachines;
}

export function subscribeToMachineChanges(
  listener: () => void
): () => void {
  const eventName =
    "rubbermip-machines-changed";

  window.addEventListener(
    eventName,
    listener
  );

  const handleStorageChange = (
    event: StorageEvent
  ) => {
    if (
      event.key === STORAGE_KEY
    ) {
      listener();
    }
  };

  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () => {
    window.removeEventListener(
      eventName,
      listener
    );

    window.removeEventListener(
      "storage",
      handleStorageChange
    );
  };
}