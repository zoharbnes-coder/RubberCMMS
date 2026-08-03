import {
  getLiveAssets,
} from "./assetService";

import {
  getPreventiveExecutions,
} from "./preventiveMaintenanceService";

import {
  getWorkOrders,
} from "./workOrderService";

import type {
  PreventiveMaintenanceExecution,
} from "../types/preventiveMaintenance";

import type {
  WorkOrder,
} from "../types/workOrder";

/*
 * RubberMIP
 * Analytics Service
 *
 * Phase 1:
 * Executive Overview
 *
 * Global filter hierarchy:
 *
 * Period
 *   ↓
 * Department
 *   ↓
 * Area / Group
 *   ↓
 * Asset
 *
 * This service is read-only.
 */

export type AnalyticsPeriodPreset =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "current_year"
  | "custom";

export type AnalyticsFilters = {
  periodPreset:
    AnalyticsPeriodPreset;

  startDate:
    string | null;

  endDate:
    string | null;

  department:
    string | null;

  area:
    string | null;

  assetId:
    string | null;
};

export type AnalyticsTrendDirection =
  | "up"
  | "down"
  | "stable";

export type AnalyticsKpiTrend = {
  direction:
    AnalyticsTrendDirection;

  value: number;

  displayValue: string;

  isPositive:
    boolean | null;
};

export type AnalyticsExecutiveKpi = {
  id:
    | "open_work_orders"
    | "closed_work_orders"
    | "availability"
    | "downtime"
    | "mttr"
    | "mtbf";

  title: string;

  value: number;

  displayValue: string;

  subtitle: string;

  trend:
    AnalyticsKpiTrend | null;
};

export type AnalyticsExecutiveSummary = {
  title: string;

  text: string;

  generatedAt: string;

  severity:
    | "positive"
    | "info"
    | "warning"
    | "danger";
};

export type AnalyticsTopDowntimeAsset = {
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  downtimeMinutes: number;

  failureCount: number;

  mttrMinutes: number;

  availabilityPercent: number;
};

export type AnalyticsAvailableArea = {
  area: string;

  department: string;
};

export type AnalyticsAvailableAsset = {
  assetId: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;
};

export type AnalyticsExecutiveSnapshot = {
  generatedAt: string;

  filters:
    AnalyticsFilters;

  periodStart:
    string;

  periodEnd:
    string;

  previousPeriodStart:
    string;

  previousPeriodEnd:
    string;

  kpis:
    AnalyticsExecutiveKpi[];

  executiveSummary:
    AnalyticsExecutiveSummary;

  topDowntimeAssets:
    AnalyticsTopDowntimeAsset[];

  availableDepartments:
    string[];

  availableAreas:
    AnalyticsAvailableArea[];

  availableAssets:
    AnalyticsAvailableAsset[];
};

type DateRange = {
  start: Date;

  end: Date;
};

type PeriodMetrics = {
  openWorkOrders: number;

  closedWorkOrders: number;

  downtimeMinutes: number;

  availabilityPercent: number;

  mttrMinutes: number;

  mtbfHours: number;
};

type AssetDowntimeAccumulator = {
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  downtimeMinutes: number;

  failureCount: number;

  repairMinutes: number;

  completedRepairCount: number;
};

const PLANNED_MINUTES_PER_DAY =
  9 * 60;

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

function getDifferenceDays(
  start: Date,
  end: Date,
): number {
  const startTime =
    startOfDay(
      start,
    ).getTime();

  const endTime =
    startOfDay(
      end,
    ).getTime();

  return Math.max(
    1,
    Math.floor(
      (
        endTime -
        startTime
      ) /
        (
          24 *
          60 *
          60 *
          1000
        ),
    ) +
      1,
  );
}

function getPresetRange(
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

function getPreviousRange(
  currentRange:
    DateRange,
): DateRange {
  const duration =
    currentRange.end.getTime() -
    currentRange.start.getTime();

  const previousEnd =
    new Date(
      currentRange.start.getTime() -
        1,
    );

  const previousStart =
    new Date(
      previousEnd.getTime() -
        duration,
    );

  return {
    start:
      startOfDay(
        previousStart,
      ),

    end:
      endOfDay(
        previousEnd,
      ),
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

function getOverlapMinutes(
  startValue: string,
  endValue:
    string | null,
  range:
    DateRange,
): number {
  const startTime =
    getDateTime(
      startValue,
    );

  const endTime =
    endValue
      ? getDateTime(
          endValue,
        )
      : Date.now();

  if (
    startTime === null ||
    endTime === null
  ) {
    return 0;
  }

  const overlapStart =
    Math.max(
      startTime,
      range.start.getTime(),
    );

  const overlapEnd =
    Math.min(
      endTime,
      range.end.getTime(),
      Date.now(),
    );

  if (
    overlapEnd <=
    overlapStart
  ) {
    return 0;
  }

  return Math.floor(
    (
      overlapEnd -
      overlapStart
    ) /
      60000,
  );
}

/* -------------------------------- */
/* Asset filtering                  */
/* -------------------------------- */

function getFilteredAssets(
  filters:
    AnalyticsFilters,
) {
  return getLiveAssets()
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
}

function filterWorkOrders(
  workOrders:
    WorkOrder[],
  allowedAssetIds:
    Set<string>,
): WorkOrder[] {
  return workOrders.filter(
    (workOrder) =>
      allowedAssetIds.has(
        workOrder.assetId,
      ),
  );
}

function filterExecutions(
  executions:
    PreventiveMaintenanceExecution[],
  allowedAssetIds:
    Set<string>,
): PreventiveMaintenanceExecution[] {
  return executions.filter(
    (execution) =>
      allowedAssetIds.has(
        execution.assetId,
      ),
  );
}

/* -------------------------------- */
/* Metric calculations              */
/* -------------------------------- */

function calculateRepairMinutes(
  workOrder:
    WorkOrder,
): number {
  if (
    !workOrder.takenAt ||
    !workOrder.closedAt
  ) {
    return 0;
  }

  const takenTime =
    getDateTime(
      workOrder.takenAt,
    );

  const closedTime =
    getDateTime(
      workOrder.closedAt,
    );

  if (
    takenTime === null ||
    closedTime === null ||
    closedTime <=
      takenTime
  ) {
    return 0;
  }

  return Math.floor(
    (
      closedTime -
      takenTime
    ) /
      60000,
  );
}

function calculateMetrics(
  workOrders:
    WorkOrder[],
  range:
    DateRange,
  activeAssetCount:
    number,
): PeriodMetrics {
  const openedInPeriod =
    workOrders.filter(
      (workOrder) =>
        isWithinRange(
          workOrder.openedAt,
          range,
        ),
    );

  const closedInPeriod =
    workOrders.filter(
      (workOrder) =>
        Boolean(
          workOrder.closedAt,
        ) &&
        isWithinRange(
          workOrder.closedAt as string,
          range,
        ),
    );

  const faultWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.type ===
        "fault",
    );

  const downtimeMinutes =
    faultWorkOrders.reduce(
      (
        total,
        workOrder,
      ) => {
        if (
          !workOrder.isDowntime
        ) {
          return total;
        }

        return (
          total +
          getOverlapMinutes(
            workOrder.openedAt,
            workOrder.closedAt,
            range,
          )
        );
      },
      0,
    );

  const completedRepairs =
    closedInPeriod
      .filter(
        (workOrder) =>
          workOrder.type ===
          "fault",
      )
      .map(
        calculateRepairMinutes,
      )
      .filter(
        (minutes) =>
          minutes > 0,
      );

  const totalRepairMinutes =
    completedRepairs.reduce(
      (
        total,
        minutes,
      ) =>
        total +
        minutes,
      0,
    );

  const mttrMinutes =
    completedRepairs.length >
    0
      ? totalRepairMinutes /
        completedRepairs.length
      : 0;

  const periodDays =
    getDifferenceDays(
      range.start,
      range.end,
    );

  const plannedMinutes =
    Math.max(
      0,
      activeAssetCount *
        periodDays *
        PLANNED_MINUTES_PER_DAY,
    );

  const availabilityPercent =
    plannedMinutes > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (
              (
                plannedMinutes -
                Math.min(
                  plannedMinutes,
                  downtimeMinutes,
                )
              ) /
              plannedMinutes
            ) *
              100,
          ),
        )
      : 100;

  const downtimeFailureCount =
    openedInPeriod.filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        workOrder.isDowntime,
    ).length;

  const operatingHours =
    Math.max(
      0,
      (
        plannedMinutes -
        Math.min(
          plannedMinutes,
          downtimeMinutes,
        )
      ) /
        60,
    );

  const mtbfHours =
    downtimeFailureCount >
    0
      ? operatingHours /
        downtimeFailureCount
      : operatingHours;

  return {
    openWorkOrders:
      openedInPeriod.filter(
        (workOrder) =>
          workOrder.status !==
          "closed",
      ).length,

    closedWorkOrders:
      closedInPeriod.length,

    downtimeMinutes,

    availabilityPercent,

    mttrMinutes,

    mtbfHours,
  };
}

/* -------------------------------- */
/* Trends                           */
/* -------------------------------- */

function buildTrend(
  currentValue: number,
  previousValue: number,
  improvementDirection:
    "higher"
    | "lower",
  unit:
    "percent"
    | "minutes"
    | "hours"
    | "count",
): AnalyticsKpiTrend {
  const difference =
    currentValue -
    previousValue;

  const roundedDifference =
    Math.round(
      difference *
        10,
    ) /
    10;

  let direction:
    AnalyticsTrendDirection =
    "stable";

  if (
    roundedDifference >
    0
  ) {
    direction =
      "up";
  } else if (
    roundedDifference <
    0
  ) {
    direction =
      "down";
  }

  let displayValue =
    String(
      Math.abs(
        roundedDifference,
      ),
    );

  if (
    unit ===
    "percent"
  ) {
    displayValue =
      `${displayValue}%`;
  } else if (
    unit ===
    "minutes"
  ) {
    displayValue =
      `${displayValue} דק׳`;
  } else if (
    unit ===
    "hours"
  ) {
    displayValue =
      `${displayValue} שעות`;
  }

  const isPositive =
    direction ===
    "stable"
      ? null
      : improvementDirection ===
          "higher"
        ? direction ===
          "up"
        : direction ===
          "down";

  return {
    direction,

    value:
      roundedDifference,

    displayValue,

    isPositive,
  };
}

/* -------------------------------- */
/* Top downtime assets              */
/* -------------------------------- */

function buildTopDowntimeAssets(
  workOrders:
    WorkOrder[],
  range:
    DateRange,
  periodDays: number,
  areaByAssetId:
    Map<string, string>,
): AnalyticsTopDowntimeAsset[] {
  const accumulator =
    new Map<
      string,
      AssetDowntimeAccumulator
    >();

  workOrders
    .filter(
      (workOrder) =>
        workOrder.type ===
        "fault",
    )
    .forEach(
      (workOrder) => {
        const downtimeMinutes =
          workOrder.isDowntime
            ? getOverlapMinutes(
                workOrder.openedAt,
                workOrder.closedAt,
                range,
              )
            : 0;

        const occurredInPeriod =
          isWithinRange(
            workOrder.openedAt,
            range,
          );

        if (
          downtimeMinutes ===
            0 &&
          !occurredInPeriod
        ) {
          return;
        }

        const existing =
          accumulator.get(
            workOrder.assetId,
          ) ?? {
            assetId:
              workOrder.assetId,

            assetCode:
              workOrder.assetCode,

            assetNumber:
              workOrder.assetNumber,

            assetName:
              workOrder.assetName,

            department:
              workOrder.department,

            area:
              areaByAssetId.get(
                workOrder.assetId,
              ) ?? "",

            downtimeMinutes:
              0,

            failureCount:
              0,

            repairMinutes:
              0,

            completedRepairCount:
              0,
          };

        existing.downtimeMinutes +=
          downtimeMinutes;

        if (
          occurredInPeriod
        ) {
          existing.failureCount +=
            1;
        }

        const repairMinutes =
          calculateRepairMinutes(
            workOrder,
          );

        if (
          repairMinutes >
            0 &&
          workOrder.closedAt &&
          isWithinRange(
            workOrder.closedAt,
            range,
          )
        ) {
          existing.repairMinutes +=
            repairMinutes;

          existing.completedRepairCount +=
            1;
        }

        accumulator.set(
          workOrder.assetId,
          existing,
        );
      },
    );

  const plannedMinutesPerAsset =
    periodDays *
    PLANNED_MINUTES_PER_DAY;

  return Array.from(
    accumulator.values(),
  )
    .map(
      (item) => {
        const cappedDowntime =
          Math.min(
            plannedMinutesPerAsset,
            item.downtimeMinutes,
          );

        return {
          assetId:
            item.assetId,

          assetCode:
            item.assetCode,

          assetNumber:
            item.assetNumber,

          assetName:
            item.assetName,

          department:
            item.department,

          area:
            item.area,

          downtimeMinutes:
            item.downtimeMinutes,

          failureCount:
            item.failureCount,

          mttrMinutes:
            item.completedRepairCount >
            0
              ? item.repairMinutes /
                item.completedRepairCount
              : 0,

          availabilityPercent:
            plannedMinutesPerAsset >
            0
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    (
                      (
                        plannedMinutesPerAsset -
                        cappedDowntime
                      ) /
                      plannedMinutesPerAsset
                    ) *
                      100,
                  ),
                )
              : 100,
        };
      },
    )
    .sort(
      (
        first,
        second,
      ) =>
        second.downtimeMinutes -
        first.downtimeMinutes,
    )
    .slice(
      0,
      10,
    );
}

/* -------------------------------- */
/* Executive summary                */
/* -------------------------------- */

function buildExecutiveSummary(
  metrics:
    PeriodMetrics,
  topAssets:
    AnalyticsTopDowntimeAsset[],
): AnalyticsExecutiveSummary {
  const leadingAsset =
    topAssets[0] ??
    null;

  if (
    metrics.downtimeMinutes ===
    0 &&
    metrics.openWorkOrders ===
    0
  ) {
    return {
      title:
        "מצב האחזקה יציב",

      text:
        "לא נרשמו השבתות או קריאות פתוחות בתקופה שנבחרה.",

      generatedAt:
        new Date().toISOString(),

      severity:
        "positive",
    };
  }

  const summaryParts:
    string[] = [];

  if (
    metrics.openWorkOrders >
    0
  ) {
    summaryParts.push(
      `קיימות ${metrics.openWorkOrders} קריאות פתוחות בתקופה שנבחרה.`,
    );
  }

  if (
    metrics.downtimeMinutes >
    0
  ) {
    summaryParts.push(
      `נרשמו ${Math.round(
        metrics.downtimeMinutes,
      )} דקות השבתה.`,
    );
  }

  if (
    leadingAsset &&
    metrics.downtimeMinutes >
      0
  ) {
    const sharePercent =
      Math.round(
        (
          leadingAsset.downtimeMinutes /
          metrics.downtimeMinutes
        ) *
          100,
      );

    summaryParts.push(
      `הנכס ${leadingAsset.assetNumber} - ${leadingAsset.assetName} אחראי לכ־${sharePercent}% מזמן ההשבתה.`,
    );
  }

  if (
    metrics.availabilityPercent <
    90
  ) {
    summaryParts.push(
      "הזמינות נמוכה מהיעד ודורשת בדיקה ניהולית.",
    );
  } else if (
    metrics.availabilityPercent <
    97
  ) {
    summaryParts.push(
      "הזמינות נמצאת בטווח בינוני ומומלץ לעקוב אחר הנכסים המובילים בהשבתה.",
    );
  }

  return {
    title:
      "סיכום מנהלים",

    text:
      summaryParts.join(
        " ",
      ),

    generatedAt:
      new Date().toISOString(),

    severity:
      metrics.availabilityPercent <
        90 ||
      metrics.downtimeMinutes >
        1000
        ? "danger"
        : metrics.openWorkOrders >
              0 ||
            metrics.downtimeMinutes >
              0
          ? "warning"
          : "info",
  };
}

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

export function getDefaultAnalyticsFilters():
  AnalyticsFilters {
  return {
    periodPreset:
      "last_30_days",

    startDate:
      null,

    endDate:
      null,

    department:
      null,

    area:
      null,

    assetId:
      null,
  };
}

export function getAnalyticsExecutiveSnapshot(
  filters:
    AnalyticsFilters =
      getDefaultAnalyticsFilters(),
): AnalyticsExecutiveSnapshot {
  const currentRange =
    getPresetRange(
      filters,
    );

  const previousRange =
    getPreviousRange(
      currentRange,
    );

  const liveAssets =
    getLiveAssets().filter(
      (asset) =>
        asset.active,
    );

  const availableDepartments =
    Array.from(
      new Set(
        liveAssets
          .map(
            (asset) =>
              asset.department,
          )
          .filter(
            (department) =>
              Boolean(
                department,
              ),
          ),
      ),
    ).sort();

  const availableAreas =
    Array.from(
      new Map(
        liveAssets
          .filter(
            (asset) =>
              Boolean(
                asset.area,
              ),
          )
          .map(
            (asset) => [
              `${asset.department}::${asset.area}`,
              {
                area:
                  asset.area,

                department:
                  asset.department,
              },
            ],
          ),
      ).values(),
    ).sort(
      (
        first,
        second,
      ) => {
        const departmentCompare =
          first.department.localeCompare(
            second.department,
          );

        if (
          departmentCompare !==
          0
        ) {
          return departmentCompare;
        }

        return first.area.localeCompare(
          second.area,
        );
      },
    );

  const availableAssets =
    liveAssets
      .map(
        (asset) => ({
          assetId:
            asset.id,

          assetNumber:
            asset.assetNumber,

          assetName:
            asset.displayName,

          department:
            asset.department,

          area:
            asset.area,
        }),
      )
      .sort(
        (
          first,
          second,
        ) =>
          first.assetNumber.localeCompare(
            second.assetNumber,
            undefined,
            {
              numeric:
                true,
            },
          ),
      );

  const filteredAssets =
    getFilteredAssets(
      filters,
    );

  const allowedAssetIds =
    new Set(
      filteredAssets.map(
        (asset) =>
          asset.id,
      ),
    );

  const areaByAssetId =
    new Map(
      liveAssets.map(
        (asset) => [
          asset.id,
          asset.area,
        ],
      ),
    );

  const workOrders =
    filterWorkOrders(
      getWorkOrders(),
      allowedAssetIds,
    );

  /*
   * PM data is already filtered through
   * the same Asset hierarchy.
   *
   * PM KPI will be added in the
   * Maintenance Analytics phase.
   */
  filterExecutions(
    getPreventiveExecutions(),
    allowedAssetIds,
  );

  const currentMetrics =
    calculateMetrics(
      workOrders,
      currentRange,
      filteredAssets.length,
    );

  const previousMetrics =
    calculateMetrics(
      workOrders,
      previousRange,
      filteredAssets.length,
    );

  const periodDays =
    getDifferenceDays(
      currentRange.start,
      currentRange.end,
    );

  const topDowntimeAssets =
    buildTopDowntimeAssets(
      workOrders,
      currentRange,
      periodDays,
      areaByAssetId,
    );

  const kpis:
    AnalyticsExecutiveKpi[] = [
    {
      id:
        "open_work_orders",

      title:
        "קריאות פתוחות",

      value:
        currentMetrics.openWorkOrders,

      displayValue:
        String(
          currentMetrics.openWorkOrders,
        ),

      subtitle:
        "קריאות שנפתחו בתקופה וטרם נסגרו",

      trend:
        buildTrend(
          currentMetrics.openWorkOrders,
          previousMetrics.openWorkOrders,
          "lower",
          "count",
        ),
    },

    {
      id:
        "closed_work_orders",

      title:
        "קריאות שנסגרו",

      value:
        currentMetrics.closedWorkOrders,

      displayValue:
        String(
          currentMetrics.closedWorkOrders,
        ),

      subtitle:
        "קריאות שנסגרו בתקופה",

      trend:
        buildTrend(
          currentMetrics.closedWorkOrders,
          previousMetrics.closedWorkOrders,
          "higher",
          "count",
        ),
    },

    {
      id:
        "mttr",

      title:
        "MTTR",

      value:
        currentMetrics.mttrMinutes,

      displayValue:
        `${Math.round(
          currentMetrics.mttrMinutes,
        )} דק׳`,

      subtitle:
        "זמן תיקון ממוצע",

      trend:
        buildTrend(
          currentMetrics.mttrMinutes,
          previousMetrics.mttrMinutes,
          "lower",
          "minutes",
        ),
    },

    {
      id:
        "mtbf",

      title:
        "MTBF",

      value:
        currentMetrics.mtbfHours,

      displayValue:
        `${Math.round(
          currentMetrics.mtbfHours *
            10,
        ) /
          10} שעות`,

      subtitle:
        "זמן ממוצע בין השבתות",

      trend:
        buildTrend(
          currentMetrics.mtbfHours,
          previousMetrics.mtbfHours,
          "higher",
          "hours",
        ),
    },

    {
      id:
        "availability",

      title:
        "זמינות",

      value:
        currentMetrics.availabilityPercent,

      displayValue:
        `${currentMetrics.availabilityPercent.toFixed(
          1,
        )}%`,

      subtitle:
        "זמינות הנכסים בתקופה",

      trend:
        buildTrend(
          currentMetrics.availabilityPercent,
          previousMetrics.availabilityPercent,
          "higher",
          "percent",
        ),
    },

    {
      id:
        "downtime",

      title:
        "זמן השבתה",

      value:
        currentMetrics.downtimeMinutes,

      displayValue:
        `${Math.round(
          currentMetrics.downtimeMinutes,
        )} דק׳`,

      subtitle:
        "זמן השבתה מצטבר",

      trend:
        buildTrend(
          currentMetrics.downtimeMinutes,
          previousMetrics.downtimeMinutes,
          "lower",
          "minutes",
        ),
    },
  ];

  return {
    generatedAt:
      new Date().toISOString(),

    filters,

    periodStart:
      currentRange.start.toISOString(),

    periodEnd:
      currentRange.end.toISOString(),

    previousPeriodStart:
      previousRange.start.toISOString(),

    previousPeriodEnd:
      previousRange.end.toISOString(),

    kpis,

    executiveSummary:
      buildExecutiveSummary(
        currentMetrics,
        topDowntimeAssets,
      ),

    topDowntimeAssets,

    availableDepartments,

    availableAreas,

    availableAssets,
  };
}