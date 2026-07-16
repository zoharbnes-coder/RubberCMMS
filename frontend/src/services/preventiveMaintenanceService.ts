import type {
  MachineMaintenanceSummary,
  PreventiveMaintenanceExecution,
  PreventiveMaintenancePlan,
} from "../types/preventiveMaintenance";

const STORAGE_KEY =
  "rubbercmms_preventive_plans";

const EXECUTION_KEY =
  "rubbercmms_preventive_executions";

/* ------------------------------- */
/* Storage                         */
/* ------------------------------- */

function loadPlans(): PreventiveMaintenancePlan[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePlans(
  plans: PreventiveMaintenancePlan[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(plans)
  );
}

function loadExecutions(): PreventiveMaintenanceExecution[] {
  const raw =
    localStorage.getItem(EXECUTION_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveExecutions(
  executions: PreventiveMaintenanceExecution[]
) {
  localStorage.setItem(
    EXECUTION_KEY,
    JSON.stringify(executions)
  );
}

/* ------------------------------- */
/* Plans                           */
/* ------------------------------- */

export function getPreventivePlans() {
  return loadPlans();
}

export function getMachinePlans(
  assetNumber: string
) {
  return loadPlans().filter(
    (plan) =>
      plan.assetNumber === assetNumber
  );
}

export function savePreventivePlan(
  plan: PreventiveMaintenancePlan
) {
  const plans = loadPlans();

  const index = plans.findIndex(
    (item) => item.id === plan.id
  );

  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }

  savePlans(plans);
}

/* ------------------------------- */
/* Executions                      */
/* ------------------------------- */

export function getExecutions() {
  return loadExecutions();
}

export function getMachineExecutions(
  assetNumber: string
) {
  return loadExecutions().filter(
    (execution) =>
      execution.assetNumber ===
      assetNumber
  );
}

export function saveExecution(
  execution: PreventiveMaintenanceExecution
) {
  const executions =
    loadExecutions();

  const index =
    executions.findIndex(
      (item) =>
        item.id === execution.id
    );

  if (index >= 0) {
    executions[index] = execution;
  } else {
    executions.push(execution);
  }

  saveExecutions(executions);
}

/* ------------------------------- */
/* Dashboard                       */
/* ------------------------------- */

export function getMachineMaintenanceSummary(
  assetNumber: string
): MachineMaintenanceSummary {
  const plans =
    getMachinePlans(assetNumber);

  const executions =
    getMachineExecutions(assetNumber);

  const nextExecution =
    executions
      .filter(
        (item) =>
          item.status === "upcoming" ||
          item.status === "due" ||
          item.status === "overdue"
      )
      .sort((a, b) =>
        a.dueAt.localeCompare(
          b.dueAt
        )
      )[0] ?? null;

  return {
    assetNumber,

    totalPlans: plans.length,

    activePlans:
      plans.filter(
        (plan) =>
          plan.status === "active"
      ).length,

    upcomingExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "upcoming"
      ).length,

    dueExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "due"
      ).length,

    overdueExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "overdue"
      ).length,

    inProgressExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "in_progress"
      ).length,

    completedLast30Days:
      executions.filter(
        (execution) =>
          execution.status ===
          "completed"
      ).length,

    nextExecution,
  };
}

/* ------------------------------- */
/* Helpers                         */
/* ------------------------------- */

export function generatePlanNumber() {
  return `PM-${Date.now()}`;
}

export function generateExecutionNumber() {
  return `PMWO-${Date.now()}`;
}

export function generateId() {
  return crypto.randomUUID();
}