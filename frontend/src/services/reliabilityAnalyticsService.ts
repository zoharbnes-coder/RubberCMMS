import {
  getLiveAssets,
} from "./assetService";

import {
  getWorkOrders,
} from "./workOrderService";

import type {
  AnalyticsFilters,
} from "./analyticsService";

import type {
  WorkOrder,
} from "../types/workOrder";

/*
 * RubberMIP
 * Reliability Analytics Service
 *
 * Phase 2:
 *
 * - Availability trend
 * - Downtime trend
 * - MTTR trend
 * - MTBF trend
 * - Failure Pareto
 * - Repeated failures
 *
 * The current failure grouping uses the
 * normalized fault description because a
 * dedicated Failure Mode field has not yet
 * been added to WorkOrder.
 */

export type ReliabilityTrendGranularity =
  | "day"
  | "week"
  | "month";

export type ReliabilityTrendPoint = {
  key: string;

  label: string;

  periodStart: string;

  periodEnd: string;

  availabilityPercent: number;

  downtimeMinutes: number;

  mttrMinutes: number;

  mtbfHours: number;

  failureCount: number;
};

export type FailureParetoItem = {
  key: string;

  label: string;

  failureCount: number;

  downtimeMinutes: number;

  cumulativePercent: number;
};

export type RepeatedFailureItem = {
  key: string;

  assetId: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  description: string;

  occurrences: number;

  downtimeMinutes: number;

  lastOccurrenceAt: string;
};

export type ReliabilityAnalyticsSnapshot = {
  generatedAt: string;

  filters:
    AnalyticsFilters;

  granularity:
    ReliabilityTrendGranularity;

  periodStart: string;

  periodEnd: string;

  trend:
    ReliabilityTrendPoint[];

  pareto:
    FailureParetoItem[];

  repeatedFailures:
    RepeatedFailureItem[];
};

type DateRange = {
  start: Date;

  end: Date;
};

type TrendBucket = {
  key: string;

  label: string;

  range:
    DateRange;
};

type FailureAccumulator = {
  key: string;

  label: string;

  failureCount: number;

  downtimeMinutes: number;
};

type RepeatedFailureAccumulator = {
  key: string;

  assetId: string;

  assetNumber: string;

  assetName: string;

  department: string;

  area: string;

  description: string;

  occurrences: number;

  downtimeMinutes: number;

  lastOccurrenceAt: string;
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
  const difference =
    startOfDay(
      end,
    ).getTime() -
    startOfDay(
      start,
    ).getTime();

  return Math.max(
    1,
    Math.floor(
      difference /
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

function getOverlapMinutes(
  workOrder:
    WorkOrder,
  range:
    DateRange,
): number {
  if (
    workOrder.type !==
      "fault" ||
    !workOrder.isDowntime
  ) {
    return 0;
  }

  const startTime =
    getDateTime(
      workOrder.openedAt,
    );

  const endTime =
    workOrder.closedAt
      ? getDateTime(
          workOrder.closedAt,
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

  const startTime =
    getDateTime(
      workOrder.takenAt,
    );

  const endTime =
    getDateTime(
      workOrder.closedAt,
    );

  if (
    startTime === null ||
    endTime === null ||
    endTime <=
      startTime
  ) {
    return 0;
  }

  return Math.floor(
    (
      endTime -
      startTime
    ) /
      60000,
  );
}

/* -------------------------------- */
/* Filtered population              */
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

function getFilteredWorkOrders(
  filters:
    AnalyticsFilters,
): WorkOrder[] {
  const assetIds =
    getFilteredAssetIds(
      filters,
    );

  return getWorkOrders().filter(
    (workOrder) =>
      assetIds.has(
        workOrder.assetId,
      ),
  );
}

/* -------------------------------- */
/* Trend buckets                    */
/* -------------------------------- */

function getGranularity(
  range:
    DateRange,
): ReliabilityTrendGranularity {
  const days =
    getDifferenceDays(
      range.start,
      range.end,
    );

  if (
    days <=
    31
  ) {
    return "day";
  }

  if (
    days <=
    120
  ) {
    return "week";
  }

  return "month";
}

function formatBucketLabel(
  date: Date,
  granularity:
    ReliabilityTrendGranularity,
): string {
  if (
    granularity ===
    "month"
  ) {
    return new Intl.DateTimeFormat(
      "he-IL",
      {
        month:
          "short",

        year:
          "2-digit",
      },
    ).format(
      date,
    );
  }

  return new Intl.DateTimeFormat(
    "he-IL",
    {
      day:
        "2-digit",

      month:
        "2-digit",
    },
  ).format(
    date,
  );
}

function buildTrendBuckets(
  range:
    DateRange,
  granularity:
    ReliabilityTrendGranularity,
): TrendBucket[] {
  const buckets:
    TrendBucket[] = [];

  let cursor =
    startOfDay(
      range.start,
    );

  while (
    cursor.getTime() <=
    range.end.getTime()
  ) {
    const bucketStart =
      startOfDay(
        cursor,
      );

    let bucketEnd:
      Date;

    if (
      granularity ===
      "day"
    ) {
      bucketEnd =
        endOfDay(
          bucketStart,
        );

      cursor =
        new Date(
          bucketStart,
        );

      cursor.setDate(
        cursor.getDate() +
          1,
      );
    } else if (
      granularity ===
      "week"
    ) {
      bucketEnd =
        new Date(
          bucketStart,
        );

      bucketEnd.setDate(
        bucketEnd.getDate() +
          6,
      );

      bucketEnd =
        endOfDay(
          bucketEnd,
        );

      cursor =
        new Date(
          bucketStart,
        );

      cursor.setDate(
        cursor.getDate() +
          7,
      );
    } else {
      bucketEnd =
        new Date(
          bucketStart.getFullYear(),
          bucketStart.getMonth() +
            1,
          0,
        );

      bucketEnd =
        endOfDay(
          bucketEnd,
        );

      cursor =
        new Date(
          bucketStart.getFullYear(),
          bucketStart.getMonth() +
            1,
          1,
        );
    }

    const boundedEnd =
      bucketEnd.getTime() >
      range.end.getTime()
        ? range.end
        : bucketEnd;

    buckets.push({
      key:
        bucketStart.toISOString(),

      label:
        formatBucketLabel(
          bucketStart,
          granularity,
        ),

      range: {
        start:
          bucketStart,

        end:
          boundedEnd,
      },
    });
  }

  return buckets;
}

/* -------------------------------- */
/* Trend metrics                    */
/* -------------------------------- */

function buildTrendPoint(
  bucket:
    TrendBucket,
  workOrders:
    WorkOrder[],
  activeAssetCount:
    number,
): ReliabilityTrendPoint {
  const failures =
    workOrders.filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        isWithinRange(
          workOrder.openedAt,
          bucket.range,
        ),
    );

  const downtimeMinutes =
    workOrders.reduce(
      (
        total,
        workOrder,
      ) =>
        total +
        getOverlapMinutes(
          workOrder,
          bucket.range,
        ),
      0,
    );

  const repairs =
    workOrders
      .filter(
        (workOrder) =>
          workOrder.type ===
            "fault" &&
          Boolean(
            workOrder.closedAt,
          ) &&
          isWithinRange(
            workOrder.closedAt as string,
            bucket.range,
          ),
      )
      .map(
        calculateRepairMinutes,
      )
      .filter(
        (minutes) =>
          minutes >
          0,
      );

  const repairMinutes =
    repairs.reduce(
      (
        total,
        minutes,
      ) =>
        total +
        minutes,
      0,
    );

  const mttrMinutes =
    repairs.length >
    0
      ? repairMinutes /
        repairs.length
      : 0;

  const periodDays =
    getDifferenceDays(
      bucket.range.start,
      bucket.range.end,
    );

  const plannedMinutes =
    activeAssetCount *
    periodDays *
    PLANNED_MINUTES_PER_DAY;

  const cappedDowntime =
    Math.min(
      plannedMinutes,
      downtimeMinutes,
    );

  const availabilityPercent =
    plannedMinutes >
    0
      ? Math.max(
          0,
          Math.min(
            100,
            (
              (
                plannedMinutes -
                cappedDowntime
              ) /
              plannedMinutes
            ) *
              100,
          ),
        )
      : 100;

  const operatingHours =
    Math.max(
      0,
      (
        plannedMinutes -
        cappedDowntime
      ) /
        60,
    );

  const mtbfHours =
    failures.length >
    0
      ? operatingHours /
        failures.length
      : operatingHours;

  return {
    key:
      bucket.key,

    label:
      bucket.label,

    periodStart:
      bucket.range.start.toISOString(),

    periodEnd:
      bucket.range.end.toISOString(),

    availabilityPercent,

    downtimeMinutes,

    mttrMinutes,

    mtbfHours,

    failureCount:
      failures.length,
  };
}

/* -------------------------------- */
/* Failure grouping                 */
/* -------------------------------- */

function normalizeFailureDescription(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "he-IL",
    )
    .replace(
      /\s+/g,
      " ",
    );
}

function buildFailurePareto(
  workOrders:
    WorkOrder[],
  range:
    DateRange,
): FailureParetoItem[] {
  const accumulator =
    new Map<
      string,
      FailureAccumulator
    >();

  workOrders
    .filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        isWithinRange(
          workOrder.openedAt,
          range,
        ),
    )
    .forEach(
      (workOrder) => {
        const key =
          normalizeFailureDescription(
            workOrder.faultDescription,
          ) ||
          "ללא תיאור";

        const existing =
          accumulator.get(
            key,
          ) ?? {
            key,

            label:
              workOrder.faultDescription.trim() ||
              "ללא תיאור",

            failureCount:
              0,

            downtimeMinutes:
              0,
          };

        existing.failureCount +=
          1;

        existing.downtimeMinutes +=
          getOverlapMinutes(
            workOrder,
            range,
          );

        accumulator.set(
          key,
          existing,
        );
      },
    );

  const sorted =
    Array.from(
      accumulator.values(),
    )
      .sort(
        (
          first,
          second,
        ) =>
          second.downtimeMinutes -
            first.downtimeMinutes ||
          second.failureCount -
            first.failureCount,
      )
      .slice(
        0,
        10,
      );

  const totalDowntime =
    sorted.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.downtimeMinutes,
      0,
    );

  let cumulativeDowntime =
    0;

  return sorted.map(
    (item) => {
      cumulativeDowntime +=
        item.downtimeMinutes;

      return {
        ...item,

        cumulativePercent:
          totalDowntime >
          0
            ? (
                cumulativeDowntime /
                totalDowntime
              ) *
              100
            : 0,
      };
    },
  );
}

function buildRepeatedFailures(
  workOrders:
    WorkOrder[],
  range:
    DateRange,
): RepeatedFailureItem[] {
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
      RepeatedFailureAccumulator
    >();

  workOrders
    .filter(
      (workOrder) =>
        workOrder.type ===
          "fault" &&
        isWithinRange(
          workOrder.openedAt,
          range,
        ),
    )
    .forEach(
      (workOrder) => {
        const signature =
          normalizeFailureDescription(
            workOrder.faultDescription,
          ) ||
          "ללא תיאור";

        const key =
          `${workOrder.assetId}::${signature}`;

        const asset =
          assets.get(
            workOrder.assetId,
          );

        const existing =
          accumulator.get(
            key,
          ) ?? {
            key,

            assetId:
              workOrder.assetId,

            assetNumber:
              workOrder.assetNumber,

            assetName:
              workOrder.assetName,

            department:
              workOrder.department,

            area:
              asset?.area ??
              "",

            description:
              workOrder.faultDescription.trim() ||
              "ללא תיאור",

            occurrences:
              0,

            downtimeMinutes:
              0,

            lastOccurrenceAt:
              workOrder.openedAt,
          };

        existing.occurrences +=
          1;

        existing.downtimeMinutes +=
          getOverlapMinutes(
            workOrder,
            range,
          );

        const existingTime =
          getDateTime(
            existing.lastOccurrenceAt,
          ) ??
          0;

        const currentTime =
          getDateTime(
            workOrder.openedAt,
          ) ??
          0;

        if (
          currentTime >
          existingTime
        ) {
          existing.lastOccurrenceAt =
            workOrder.openedAt;
        }

        accumulator.set(
          key,
          existing,
        );
      },
    );

  return Array.from(
    accumulator.values(),
  )
    .filter(
      (item) =>
        item.occurrences >=
        2,
    )
    .sort(
      (
        first,
        second,
      ) =>
        second.occurrences -
          first.occurrences ||
        second.downtimeMinutes -
          first.downtimeMinutes,
    )
    .slice(
      0,
      10,
    );
}

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

export function getReliabilityAnalyticsSnapshot(
  filters:
    AnalyticsFilters,
): ReliabilityAnalyticsSnapshot {
  const range =
    getSelectedRange(
      filters,
    );

  const granularity =
    getGranularity(
      range,
    );

  const filteredAssetIds =
    getFilteredAssetIds(
      filters,
    );

  const workOrders =
    getFilteredWorkOrders(
      filters,
    );

  const buckets =
    buildTrendBuckets(
      range,
      granularity,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    filters,

    granularity,

    periodStart:
      range.start.toISOString(),

    periodEnd:
      range.end.toISOString(),

    trend:
      buckets.map(
        (bucket) =>
          buildTrendPoint(
            bucket,
            workOrders,
            filteredAssetIds.size,
          ),
      ),

    pareto:
      buildFailurePareto(
        workOrders,
        range,
      ),

    repeatedFailures:
      buildRepeatedFailures(
        workOrders,
        range,
      ),
  };
}