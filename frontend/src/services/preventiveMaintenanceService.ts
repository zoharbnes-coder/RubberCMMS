import type {
  AssetMaintenanceSummary,
  PreventiveMaintenanceExecution,
  PreventiveMaintenancePlan,
} from "../types/preventiveMaintenance";

import {
  getAssetById,
} from "./assetRepository";

/*
 * RubberMIP
 * Asset-native Preventive Maintenance Service
 *
 * Asset is the single source of truth.
 *
 * PM Plans and PM Executions are linked by:
 *
 * assetId
 *
 * Legacy Machine-based PM storage is
 * intentionally not migrated.
 */

const PLAN_STORAGE_KEY =
  "rubbermip_preventive_plans_v2";

const EXECUTION_STORAGE_KEY =
  "rubbermip_preventive_executions_v2";

const DAY_IN_MILLISECONDS =
  24 * 60 * 60 * 1000;

/* -------------------------------- */
/* Storage                          */
/* -------------------------------- */

function loadPlans():
  PreventiveMaintenancePlan[] {
  const raw =
    localStorage.getItem(
      PLAN_STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed as PreventiveMaintenancePlan[];
  } catch {
    return [];
  }
}

function savePlans(
  plans:
    PreventiveMaintenancePlan[],
): void {
  localStorage.setItem(
    PLAN_STORAGE_KEY,
    JSON.stringify(
      plans,
    ),
  );
}

function loadExecutions():
  PreventiveMaintenanceExecution[] {
  const raw =
    localStorage.getItem(
      EXECUTION_STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed as PreventiveMaintenanceExecution[];
  } catch {
    return [];
  }
}

function saveExecutions(
  executions:
    PreventiveMaintenanceExecution[],
): void {
  localStorage.setItem(
    EXECUTION_STORAGE_KEY,
    JSON.stringify(
      executions,
    ),
  );
}

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function getDateTime(
  value:
    string | null,
): number | null {
  if (!value) {
    return null;
  }

  const time =
    new Date(
      value,
    ).getTime();

  if (
    Number.isNaN(time)
  ) {
    return null;
  }

  return time;
}

function isCompletedWithinLastDays(
  execution:
    PreventiveMaintenanceExecution,
  days: number,
): boolean {
  if (
    execution.status !==
      "completed" ||
    !execution.completedAt
  ) {
    return false;
  }

  const completedTime =
    getDateTime(
      execution.completedAt,
    );

  if (
    completedTime === null
  ) {
    return false;
  }

  const minimumTime =
    Date.now() -
    days *
      DAY_IN_MILLISECONDS;

  return (
    completedTime >=
    minimumTime
  );
}

function isExecutionOverdue(
  execution:
    PreventiveMaintenanceExecution,
): boolean {
  if (
    execution.status ===
      "completed" ||
    execution.status ===
      "cancelled"
  ) {
    return false;
  }

  if (
    execution.status ===
    "overdue"
  ) {
    return true;
  }

  const dueTime =
    getDateTime(
      execution.dueAt,
    );

  if (
    dueTime === null
  ) {
    return false;
  }

  return (
    dueTime <
    Date.now()
  );
}

/* -------------------------------- */
/* Plans                            */
/* -------------------------------- */

export function getPreventivePlans():
  PreventiveMaintenancePlan[] {
  return loadPlans();
}

export function getAssetPlans(
  assetId: string,
): PreventiveMaintenancePlan[] {
  return loadPlans()
    .filter(
      (plan) =>
        plan.assetId ===
        assetId,
    )
    .sort(
      (
        first,
        second,
      ) => {
        const firstDueTime =
          getDateTime(
            first.nextDueAt,
          ) ??
          Number.MAX_SAFE_INTEGER;

        const secondDueTime =
          getDateTime(
            second.nextDueAt,
          ) ??
          Number.MAX_SAFE_INTEGER;

        return (
          firstDueTime -
          secondDueTime
        );
      },
    );
}

export function getPreventivePlanById(
  planId: string,
):
  | PreventiveMaintenancePlan
  | undefined {
  return loadPlans().find(
    (plan) =>
      plan.id ===
      planId,
  );
}

export function savePreventivePlan(
  plan:
    PreventiveMaintenancePlan,
): PreventiveMaintenancePlan {
  const plans =
    loadPlans();

  const index =
    plans.findIndex(
      (item) =>
        item.id ===
        plan.id,
    );

  const updatedPlan = {
    ...plan,

    updatedAt:
      new Date().toISOString(),
  };

  if (
    index >= 0
  ) {
    plans[index] =
      updatedPlan;
  } else {
    plans.push(
      updatedPlan,
    );
  }

  savePlans(
    plans,
  );

  return updatedPlan;
}

export function deletePreventivePlan(
  planId: string,
): boolean {
  const plans =
    loadPlans();

  const filteredPlans =
    plans.filter(
      (plan) =>
        plan.id !==
        planId,
    );

  if (
    filteredPlans.length ===
    plans.length
  ) {
    return false;
  }

  savePlans(
    filteredPlans,
  );

  return true;
}

/* -------------------------------- */
/* Executions                       */
/* -------------------------------- */

export function getPreventiveExecutions():
  PreventiveMaintenanceExecution[] {
  return loadExecutions();
}

export function getAssetExecutions(
  assetId: string,
): PreventiveMaintenanceExecution[] {
  return loadExecutions()
    .filter(
      (execution) =>
        execution.assetId ===
        assetId,
    )
    .sort(
      (
        first,
        second,
      ) => {
        const firstDueTime =
          getDateTime(
            first.dueAt,
          ) ?? 0;

        const secondDueTime =
          getDateTime(
            second.dueAt,
          ) ?? 0;

        return (
          firstDueTime -
          secondDueTime
        );
      },
    );
}

export function getPreventiveExecutionById(
  executionId: string,
):
  | PreventiveMaintenanceExecution
  | undefined {
  return loadExecutions().find(
    (execution) =>
      execution.id ===
      executionId,
  );
}

export function saveExecution(
  execution:
    PreventiveMaintenanceExecution,
): PreventiveMaintenanceExecution {
  const executions =
    loadExecutions();

  const index =
    executions.findIndex(
      (item) =>
        item.id ===
        execution.id,
    );

  const updatedExecution = {
    ...execution,

    updatedAt:
      new Date().toISOString(),
  };

  if (
    index >= 0
  ) {
    executions[index] =
      updatedExecution;
  } else {
    executions.push(
      updatedExecution,
    );
  }

  saveExecutions(
    executions,
  );

  return updatedExecution;
}

export function deleteExecution(
  executionId: string,
): boolean {
  const executions =
    loadExecutions();

  const filteredExecutions =
    executions.filter(
      (execution) =>
        execution.id !==
        executionId,
    );

  if (
    filteredExecutions.length ===
    executions.length
  ) {
    return false;
  }

  saveExecutions(
    filteredExecutions,
  );

  return true;
}

/* -------------------------------- */
/* Asset Maintenance Summary        */
/* -------------------------------- */

export function getAssetMaintenanceSummary(
  assetId: string,
): AssetMaintenanceSummary | null {
  const asset =
    getAssetById(
      assetId,
    );

  if (!asset) {
    return null;
  }

  const plans =
    getAssetPlans(
      assetId,
    );

  const executions =
    getAssetExecutions(
      assetId,
    );

  const activeExecutions =
    executions.filter(
      (execution) =>
        execution.status !==
          "completed" &&
        execution.status !==
          "cancelled",
    );

  const nextExecution =
    activeExecutions
      .filter(
        (execution) =>
          execution.status ===
            "upcoming" ||
          execution.status ===
            "due" ||
          execution.status ===
            "overdue",
      )
      .sort(
        (
          first,
          second,
        ) => {
          const firstDueTime =
            getDateTime(
              first.dueAt,
            ) ??
            Number.MAX_SAFE_INTEGER;

          const secondDueTime =
            getDateTime(
              second.dueAt,
            ) ??
            Number.MAX_SAFE_INTEGER;

          return (
            firstDueTime -
            secondDueTime
          );
        },
      )[0] ??
    null;

  return {
    assetId:
      asset.id,

    assetCode:
      asset.assetCode,

    assetNumber:
      asset.assetNumber,

    totalPlans:
      plans.length,

    activePlans:
      plans.filter(
        (plan) =>
          plan.status ===
          "active",
      ).length,

    upcomingExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "upcoming",
      ).length,

    dueExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
            "due" &&
          !isExecutionOverdue(
            execution,
          ),
      ).length,

    overdueExecutions:
      executions.filter(
        isExecutionOverdue,
      ).length,

    inProgressExecutions:
      executions.filter(
        (execution) =>
          execution.status ===
          "in_progress",
      ).length,

    completedLast30Days:
      executions.filter(
        (execution) =>
          isCompletedWithinLastDays(
            execution,
            30,
          ),
      ).length,

    nextExecution,
  };
}

/* -------------------------------- */
/* Number generation                */
/* -------------------------------- */

export function generatePlanNumber():
  string {
  return `PM-${Date.now()}`;
}

export function generateExecutionNumber():
  string {
  return `PMWO-${Date.now()}`;
}

export function generateId():
  string {
  return crypto.randomUUID();
}