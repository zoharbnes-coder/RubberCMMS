import {
  getLiveAssets,
} from "./assetService";

import {
  getPreventiveExecutions,
} from "./preventiveMaintenanceService";

import type {
  AnalyticsFilters,
} from "./analyticsService";

import type {
  PreventiveMaintenanceExecution,
} from "../types/preventiveMaintenance";

/*
 * RubberMIP
 * Preventive Maintenance Analytics
 *
 * Phase 3:
 * PM Compliance
 *
 * Compliance definition:
 *
 * Completed on time =
 * completed execution whose completion date
 * is on or before its due date.
 *
 * Compliance % =
 * completed on time /
 * all executions that reached a final outcome
 * or became overdue in the selected period.
 */

export type PmComplianceSummary = {
  totalRelevantExecutions: number;

  completedExecutions: number;

  completedOnTime: number;

  completedLate: number;

  overdueExecutions: number;

  dueExecutions: number;

  inProgressExecutions: number;

  cancelledExecutions: number;

  compliancePercent: number;
};

export type PmStatusBreakdownItem = {
  status:
    | "completed_on_time"
    | "completed_late"
    | "overdue"
    | "due"
    | "in_progress"
    | "cancelled";

  label: string;

  count: number;

  percent: number;
};

export type PmComplianceAssetItem = {
  assetId: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  totalRelevantExecutions: number;

  completedOnTime: number;

  completedLate: number;

  overdueExecutions: number;

  compliancePercent: number;
};

export type PmComplianceSnapshot = {
  generatedAt: string;

  filters:
    AnalyticsFilters;

  periodStart: string;

  periodEnd: string;

  summary:
    PmComplianceSummary;

  statusBreakdown:
    PmStatusBreakdownItem[];

  lowestComplianceAssets:
    PmComplianceAssetItem[];
};

type DateRange = {
  start: Date;

  end: Date;
};

type AssetAccumulator = {
  assetId: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  totalRelevantExecutions: number;

  completedOnTime: number;

  completedLate: number;

  overdueExecutions: number;
};

/* -------------------------------- */
/* Date helpers                     */
/* -------------------------------- */

function startOfDay(
  value: Date,
): Date {
  const date =
    new Date(
      value,
    );

  date.setHours(
    0,
    0,
    0,
    0,
  );

  return date;
}

function endOfDay(
  value: Date,
): Date {
  const date =
    new Date(
      value,
    );

  date.setHours(
    23,
    59,
    59,
    999,
  );

  return date;
}

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
    Number.isNaN(
      time,
    )
  ) {
    return null;
  }

  return time;
}

function getSelectedRange(
  filters:
    AnalyticsFilters,
): DateRange {
  const now =
    new Date();

  const end =
    endOfDay(
      now,
    );

  if (
    filters.periodPreset ===
      "custom" &&
    filters.startDate &&
    filters.endDate
  ) {
    return {
      start:
        startOfDay(
          new Date(
            filters.startDate,
          ),
        ),

      end:
        endOfDay(
          new Date(
            filters.endDate,
          ),
        ),
    };
  }

  if (
    filters.periodPreset ===
    "last_7_days"
  ) {
    const start =
      new Date(
        now,
      );

    start.setDate(
      start.getDate() -
        6,
    );

    return {
      start:
        startOfDay(
          start,
        ),

      end,
    };
  }

  if (
    filters.periodPreset ===
    "last_90_days"
  ) {
    const start =
      new Date(
        now,
      );

    start.setDate(
      start.getDate() -
        89,
    );

    return {
      start:
        startOfDay(
          start,
        ),

      end,
    };
  }

  if (
    filters.periodPreset ===
    "current_year"
  ) {
    return {
      start:
        new Date(
          now.getFullYear(),
          0,
          1,
          0,
          0,
          0,
          0,
        ),

      end,
    };
  }

  const start =
    new Date(
      now,
    );

  start.setDate(
    start.getDate() -
      29,
  );

  return {
    start:
      startOfDay(
        start,
      ),

    end,
  };
}

function isWithinRange(
  value: string,
  range:
    DateRange,
): boolean {
  const time =
    getDateTime(
      value,
    );

  if (
    time === null
  ) {
    return false;
  }

  return (
    time >=
      range.start.getTime() &&
    time <=
      range.end.getTime()
  );
}

/* -------------------------------- */
/* Asset filtering                  */
/* -------------------------------- */

function getFilteredAssetIds(
  filters:
    AnalyticsFilters,
): Set<string> {
  const assets =
    getLiveAssets()
      .filter(
        (asset) =>
          asset.active,
      )
      .filter(
        (asset) => {
          if (
            filters.department &&
            asset.department !==
              filters.department
          ) {
            return false;
          }

          if (
            filters.area &&
            asset.area !==
              filters.area
          ) {
            return false;
          }

          if (
            filters.assetId &&
            asset.id !==
              filters.assetId
          ) {
            return false;
          }

          return true;
        },
      );

  return new Set(
    assets.map(
      (asset) =>
        asset.id,
    ),
  );
}

/* -------------------------------- */
/* Execution classification         */
/* -------------------------------- */

function isCompletedOnTime(
  execution:
    PreventiveMaintenanceExecution,
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

  const dueTime =
    getDateTime(
      execution.dueAt,
    );

  if (
    completedTime ===
      null ||
    dueTime ===
      null
  ) {
    return false;
  }

  return (
    completedTime <=
    dueTime
  );
}

function isCompletedLate(
  execution:
    PreventiveMaintenanceExecution,
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

  const dueTime =
    getDateTime(
      execution.dueAt,
    );

  if (
    completedTime ===
      null ||
    dueTime ===
      null
  ) {
    return false;
  }

  return (
    completedTime >
    dueTime
  );
}

function isRelevantExecution(
  execution:
    PreventiveMaintenanceExecution,
  range:
    DateRange,
): boolean {
  if (
    execution.status ===
      "completed" &&
    execution.completedAt
  ) {
    return isWithinRange(
      execution.completedAt,
      range,
    );
  }

  return isWithinRange(
    execution.dueAt,
    range,
  );
}

/* -------------------------------- */
/* Summary                          */
/* -------------------------------- */

function buildSummary(
  executions:
    PreventiveMaintenanceExecution[],
): PmComplianceSummary {
  const completedOnTime =
    executions.filter(
      isCompletedOnTime,
    ).length;

  const completedLate =
    executions.filter(
      isCompletedLate,
    ).length;

  const completedExecutions =
    completedOnTime +
    completedLate;

  const overdueExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "overdue",
    ).length;

  const dueExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "due",
    ).length;

  const inProgressExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "in_progress",
    ).length;

  const cancelledExecutions =
    executions.filter(
      (execution) =>
        execution.status ===
        "cancelled",
    ).length;

  const totalRelevantExecutions =
    completedOnTime +
    completedLate +
    overdueExecutions;

  const compliancePercent =
    totalRelevantExecutions >
    0
      ? (
          completedOnTime /
          totalRelevantExecutions
        ) *
        100
      : 100;

  return {
    totalRelevantExecutions,

    completedExecutions,

    completedOnTime,

    completedLate,

    overdueExecutions,

    dueExecutions,

    inProgressExecutions,

    cancelledExecutions,

    compliancePercent,
  };
}

function buildStatusBreakdown(
  summary:
    PmComplianceSummary,
): PmStatusBreakdownItem[] {
  const total =
    Math.max(
      1,
      summary.completedOnTime +
        summary.completedLate +
        summary.overdueExecutions +
        summary.dueExecutions +
        summary.inProgressExecutions +
        summary.cancelledExecutions,
    );

  const items:
    Array<
      Omit<
        PmStatusBreakdownItem,
        "percent"
      >
    > = [
    {
      status:
        "completed_on_time",

      label:
        "הושלמו בזמן",

      count:
        summary.completedOnTime,
    },

    {
      status:
        "completed_late",

      label:
        "הושלמו באיחור",

      count:
        summary.completedLate,
    },

    {
      status:
        "overdue",

      label:
        "באיחור",

      count:
        summary.overdueExecutions,
    },

    {
      status:
        "due",

      label:
        "לביצוע",

      count:
        summary.dueExecutions,
    },

    {
      status:
        "in_progress",

      label:
        "בביצוע",

      count:
        summary.inProgressExecutions,
    },

    {
      status:
        "cancelled",

      label:
        "בוטלו",

      count:
        summary.cancelledExecutions,
    },
  ];

  return items.map(
    (item) => ({
      ...item,

      percent:
        (
          item.count /
          total
        ) *
        100,
    }),
  );
}

/* -------------------------------- */
/* Asset compliance                 */
/* -------------------------------- */

function buildLowestComplianceAssets(
  executions:
    PreventiveMaintenanceExecution[],
): PmComplianceAssetItem[] {
  const assets =
    new Map(
      getLiveAssets().map(
        (asset) => [
          asset.id,
          asset,
        ],
      ),
    );

  const accumulator =
    new Map<
      string,
      AssetAccumulator
    >();

  executions.forEach(
    (execution) => {
      const asset =
        assets.get(
          execution.assetId,
        );

      const existing =
        accumulator.get(
          execution.assetId,
        ) ?? {
          assetId:
            execution.assetId,

          assetNumber:
            execution.assetNumber,

          assetName:
            execution.assetName,

          department:
            asset?.department ??
            "",

          area:
            asset?.area ??
            "",

          totalRelevantExecutions:
            0,

          completedOnTime:
            0,

          completedLate:
            0,

          overdueExecutions:
            0,
        };

      if (
        isCompletedOnTime(
          execution,
        )
      ) {
        existing.completedOnTime +=
          1;

        existing.totalRelevantExecutions +=
          1;
      } else if (
        isCompletedLate(
          execution,
        )
      ) {
        existing.completedLate +=
          1;

        existing.totalRelevantExecutions +=
          1;
      } else if (
        execution.status ===
        "overdue"
      ) {
        existing.overdueExecutions +=
          1;

        existing.totalRelevantExecutions +=
          1;
      }

      accumulator.set(
        execution.assetId,
        existing,
      );
    },
  );

  return Array.from(
    accumulator.values(),
  )
    .filter(
      (item) =>
        item.totalRelevantExecutions >
        0,
    )
    .map(
      (item) => ({
        ...item,

        compliancePercent:
          (
            item.completedOnTime /
            item.totalRelevantExecutions
          ) *
          100,
      }),
    )
    .sort(
      (
        first,
        second,
      ) =>
        first.compliancePercent -
          second.compliancePercent ||
        second.totalRelevantExecutions -
          first.totalRelevantExecutions,
    )
    .slice(
      0,
      10,
    );
}

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

export function getPmComplianceSnapshot(
  filters:
    AnalyticsFilters,
): PmComplianceSnapshot {
  const range =
    getSelectedRange(
      filters,
    );

  const assetIds =
    getFilteredAssetIds(
      filters,
    );

  const executions =
    getPreventiveExecutions()
      .filter(
        (execution) =>
          assetIds.has(
            execution.assetId,
          ),
      )
      .filter(
        (execution) =>
          isRelevantExecution(
            execution,
            range,
          ),
      );

  const summary =
    buildSummary(
      executions,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    filters,

    periodStart:
      range.start.toISOString(),

    periodEnd:
      range.end.toISOString(),

    summary,

    statusBreakdown:
      buildStatusBreakdown(
        summary,
      ),

    lowestComplianceAssets:
      buildLowestComplianceAssets(
        executions,
      ),
  };
}