import {
  machines as sourceMachines,
  type Machine as SourceMachine,
} from "../data/machines";

import type {
  Machine,
  MachineCriticality,
} from "../types/machine";

function getDefaultCriticality(
  machine: SourceMachine
): MachineCriticality {
  const normalizedDepartment =
    machine.department.toLowerCase();

  if (
    normalizedDepartment.includes("תערובות") ||
    normalizedDepartment.includes("ערבול")
  ) {
    return "critical";
  }

  return "medium";
}

function mapSourceMachine(
  sourceMachine: SourceMachine
): Machine {
  return {
    id: sourceMachine.code,

    assetNumber: sourceMachine.displayNumber,
    machineCode: sourceMachine.code,
    displayName: sourceMachine.name,
    shortName: sourceMachine.name,

    department: sourceMachine.department,
    area: sourceMachine.department,
    location: "",

    manufacturer: "",
    model: "",
    serialNumber: "",

    installationDate: "",
    criticality:
      getDefaultCriticality(sourceMachine),

    active: sourceMachine.active,
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

const machineRepository: Machine[] =
  sourceMachines.map(mapSourceMachine);

export function getMachines(): Machine[] {
  return [...machineRepository];
}

export function getActiveMachines(): Machine[] {
  return machineRepository.filter(
    (machine) => machine.active
  );
}

export function getMachineByCode(
  machineCode: string
): Machine | undefined {
  return machineRepository.find(
    (machine) =>
      machine.machineCode === machineCode
  );
}

export function getMachineByAssetNumber(
  assetNumber: string
): Machine | undefined {
  return machineRepository.find(
    (machine) =>
      machine.assetNumber === assetNumber
  );
}

export function getMachinesByDepartment(
  department: string
): Machine[] {
  return machineRepository.filter(
    (machine) =>
      machine.active &&
      machine.department === department
  );
}

export function getMachineDepartments(): string[] {
  return Array.from(
    new Set(
      machineRepository
        .filter((machine) => machine.active)
        .map((machine) => machine.department)
    )
  ).sort();
}