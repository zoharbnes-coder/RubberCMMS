import type {
  WorkOrder,
} from "../types/workOrder";

import {
  getAssetDetailsSnapshot,
  type AssetDetailsSnapshot,
} from "./assetDetailsService";

export type AssetRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AssetInsightSeverity =
  | "positive"
  | "info"
  | "warning"
  | "danger";

export type AssetInsight = {
  id: string;

  severity:
    AssetInsightSeverity;

  title: string;

  description: string;
};

export type AssetRepeatedFailure = {
  normalizedDescription:
    string;

  exampleDescription:
    string;

  count: number;

  downtimeCount: number;

  lastOccurredAt: string;
};

export type AssetIntelligenceSnapshot = {
  generatedAt: string;

  assetId: string;

  assetCode: string;

  assetNumber: string;

  healthScore: number;

  riskLevel:
    AssetRiskLevel;

  failuresLast7Days:
    number;

  failuresLast30Days:
    number;

  downtimeFailuresLast30Days:
    number;

  repeatedFailures:
    AssetRepeatedFailure[];

  insights:
    AssetInsight[];

  recommendations:
    string[];
};

function startOfDaysAgo(
  days: number,
): number {
  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0,
  );

  date.setDate(
    date.getDate() -
      days,
  );

  return date.getTime();
}

function isAfterDate(
  dateValue: string,
  minimumTime: number,
): boolean {
  const time =
    new Date(
      dateValue,
    ).getTime();

  return (
    !Number.isNaN(time) &&
    time >= minimumTime
  );
}

function normalizeDescription(
  description: string,
): string {
  return description
    .trim()
    .toLowerCase()
    .replace(
      /[.,:;!?()[\]{}"']/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    );
}

function getRecentWorkOrders(
  workOrders: WorkOrder[],
  days: number,
): WorkOrder[] {
  const minimumTime =
    startOfDaysAgo(days);

  return workOrders.filter(
    (workOrder) =>
      isAfterDate(
        workOrder.openedAt,
        minimumTime,
      ),
  );
}

function detectRepeatedFailures(
  workOrders: WorkOrder[],
): AssetRepeatedFailure[] {
  const groups =
    new Map<
      string,
      AssetRepeatedFailure
    >();

  workOrders.forEach(
    (workOrder) => {
      const normalizedDescription =
        normalizeDescription(
          workOrder.faultDescription,
        );

      if (
        !normalizedDescription
      ) {
        return;
      }

      const existing =
        groups.get(
          normalizedDescription,
        );

      if (existing) {
        existing.count += 1;

        if (
          workOrder.isDowntime
        ) {
          existing.downtimeCount += 1;
        }

        if (
          new Date(
            workOrder.openedAt,
          ).getTime() >
          new Date(
            existing.lastOccurredAt,
          ).getTime()
        ) {
          existing.lastOccurredAt =
            workOrder.openedAt;

          existing.exampleDescription =
            workOrder.faultDescription;
        }

        return;
      }

      groups.set(
        normalizedDescription,
        {
          normalizedDescription,

          exampleDescription:
            workOrder.faultDescription,

          count: 1,

          downtimeCount:
            workOrder.isDowntime
              ? 1
              : 0,

          lastOccurredAt:
            workOrder.openedAt,
        },
      );
    },
  );

  return Array.from(
    groups.values(),
  )
    .filter(
      (failure) =>
        failure.count >= 2,
    )
    .sort(
      (
        first,
        second,
      ) => {
        if (
          first.count !==
          second.count
        ) {
          return (
            second.count -
            first.count
          );
        }

        return (
          new Date(
            second.lastOccurredAt,
          ).getTime() -
          new Date(
            first.lastOccurredAt,
          ).getTime()
        );
      },
    );
}

function calculateHealthScore(
  snapshot:
    AssetDetailsSnapshot,

  repeatedFailures:
    AssetRepeatedFailure[],

  failuresLast30Days:
    number,

  downtimeFailuresLast30Days:
    number,
): number {
  let score = 100;

  const asset =
    snapshot.asset;

  const summary =
    snapshot.workOrderSummary;

  const timeSummary =
    snapshot.timeSummary;

  /*
   * Critical active downtime
   */
  if (
    summary.openDowntimeWorkOrders >
    0
  ) {
    score -= 35;
  }

  /*
   * Open maintenance load
   */
  score -= Math.min(
    summary.openWorkOrders *
      8,
    24,
  );

  /*
   * Recent failure frequency
   */
  score -= Math.min(
    failuresLast30Days *
      3,
    18,
  );

  /*
   * Recent downtime frequency
   */
  score -= Math.min(
    downtimeFailuresLast30Days *
      7,
    21,
  );

  /*
   * Repeated failures
   */
  score -= Math.min(
    repeatedFailures.length *
      8,
    24,
  );

  /*
   * Repair time impact
   */
  if (
    timeSummary.averageRepairMinutes >
    240
  ) {
    score -= 12;
  } else if (
    timeSummary.averageRepairMinutes >
    120
  ) {
    score -= 7;
  } else if (
    timeSummary.averageRepairMinutes >
    60
  ) {
    score -= 3;
  }

  /*
   * Response time impact
   */
  if (
    timeSummary.averageResponseMinutes >
    120
  ) {
    score -= 10;
  } else if (
    timeSummary.averageResponseMinutes >
    60
  ) {
    score -= 5;
  }

  /*
   * Availability impact
   */
  if (
    asset.availability < 80
  ) {
    score -= 20;
  } else if (
    asset.availability < 90
  ) {
    score -= 12;
  } else if (
    asset.availability < 95
  ) {
    score -= 6;
  }

  /*
   * Asset criticality impact
   */
  if (
    asset.criticality ===
      "critical" &&
    summary.openWorkOrders > 0
  ) {
    score -= 5;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score),
    ),
  );
}

function getRiskLevel(
  healthScore: number,
  snapshot:
    AssetDetailsSnapshot,
): AssetRiskLevel {
  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders >= 2 ||
    healthScore < 40
  ) {
    return "critical";
  }

  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders > 0 ||
    healthScore < 60
  ) {
    return "high";
  }

  if (
    snapshot.workOrderSummary
      .openWorkOrders > 0 ||
    healthScore < 80
  ) {
    return "medium";
  }

  return "low";
}

function buildInsights(
  snapshot:
    AssetDetailsSnapshot,

  repeatedFailures:
    AssetRepeatedFailure[],

  failuresLast7Days:
    number,

  failuresLast30Days:
    number,

  downtimeFailuresLast30Days:
    number,

  healthScore: number,
): AssetInsight[] {
  const insights:
    AssetInsight[] = [];

  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders >
    0
  ) {
    insights.push({
      id:
        "open-downtime",

      severity:
        "danger",

      title:
        "הנכס מושבת",

      description:
        `קיימות ${snapshot.workOrderSummary.openDowntimeWorkOrders} קריאות משביתות פתוחות.`,
    });
  } else {
    insights.push({
      id:
        "no-open-downtime",

      severity:
        "positive",

      title:
        "אין השבתה פעילה",

      description:
        "כרגע אין קריאה משביתה פתוחה לנכס.",
    });
  }

  if (
    snapshot.workOrderSummary
      .openWorkOrders >
    0
  ) {
    insights.push({
      id:
        "open-work-orders",

      severity:
        "warning",

      title:
        "קריאות פתוחות",

      description:
        `קיימות ${snapshot.workOrderSummary.openWorkOrders} קריאות שטרם נסגרו.`,
    });
  }

  if (
    failuresLast7Days >= 3
  ) {
    insights.push({
      id:
        "many-failures-seven-days",

      severity:
        "danger",

      title:
        "ריבוי תקלות בשבוע האחרון",

      description:
        `נפתחו ${failuresLast7Days} קריאות ב־7 הימים האחרונים.`,
    });
  } else if (
    failuresLast30Days >= 4
  ) {
    insights.push({
      id:
        "many-failures-thirty-days",

      severity:
        "warning",

      title:
        "תדירות תקלות גבוהה",

      description:
        `נפתחו ${failuresLast30Days} קריאות ב־30 הימים האחרונים.`,
    });
  }

  if (
    downtimeFailuresLast30Days >=
    2
  ) {
    insights.push({
      id:
        "downtime-failures",

      severity:
        "danger",

      title:
        "השבתות חוזרות",

      description:
        `נרשמו ${downtimeFailuresLast30Days} קריאות משביתות ב־30 הימים האחרונים.`,
    });
  }

  if (
    repeatedFailures.length >
    0
  ) {
    const mostRepeated =
      repeatedFailures[0];

    insights.push({
      id:
        "repeated-failure",

      severity:
        "warning",

      title:
        "זוהתה תקלה חוזרת",

      description:
        `"${mostRepeated.exampleDescription}" הופיעה ${mostRepeated.count} פעמים.`,
    });
  }

  if (
    snapshot.timeSummary
      .averageRepairMinutes >
    120
  ) {
    insights.push({
      id:
        "high-repair-time",

      severity:
        "warning",

      title:
        "זמן תיקון ממוצע גבוה",

      description:
        "זמן התיקון הממוצע גבוה משעתיים.",
    });
  }

  if (
    snapshot.timeSummary
      .averageResponseMinutes >
    60
  ) {
    insights.push({
      id:
        "high-response-time",

      severity:
        "warning",

      title:
        "זמן תגובה גבוה",

      description:
        "זמן התגובה הממוצע לקריאה גבוה משעה.",
    });
  }

  if (
    snapshot.asset.availability >=
    95
  ) {
    insights.push({
      id:
        "high-availability",

      severity:
        "positive",

      title:
        "זמינות גבוהה",

      description:
        `זמינות הנכס היא ${snapshot.asset.availability.toFixed(
          1,
        )}%.`,
    });
  }

  if (
    snapshot.asset.criticality ===
      "critical" &&
    snapshot.workOrderSummary
      .openWorkOrders >
      0
  ) {
    insights.push({
      id:
        "critical-asset-open-work",

      severity:
        "danger",

      title:
        "נכס קריטי עם קריאה פתוחה",

      description:
        "הנכס מוגדר כקריטי וקיימת בו לפחות קריאה פתוחה. מומלץ לתעדף את הטיפול.",
    });
  }

  if (
    healthScore >= 85 &&
    insights.every(
      (insight) =>
        insight.severity !==
        "danger",
    )
  ) {
    insights.push({
      id:
        "good-health",

      severity:
        "positive",

      title:
        "מצב נכס טוב",

      description:
        "לא זוהו כרגע סימנים משמעותיים להידרדרות.",
    });
  }

  return insights;
}

function buildRecommendations(
  snapshot:
    AssetDetailsSnapshot,

  repeatedFailures:
    AssetRepeatedFailure[],

  failuresLast7Days:
    number,

  downtimeFailuresLast30Days:
    number,
): string[] {
  const recommendations:
    string[] = [];

  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders >
    0
  ) {
    recommendations.push(
      "לתעדף טיפול מיידי בקריאות המשביתות הפתוחות.",
    );
  }

  if (
    snapshot.asset.criticality ===
      "critical" &&
    snapshot.workOrderSummary
      .openWorkOrders >
      0
  ) {
    recommendations.push(
      "בגלל קריטיות הנכס, מומלץ לבצע הערכת סיכון ולוודא זמינות צוות וחלפים לפני המשך הפעלה.",
    );
  }

  if (
    repeatedFailures.length >
    0
  ) {
    recommendations.push(
      "לבצע ניתוח שורש תקלה לתקלה החוזרת ולבדוק אם נדרש שינוי מכני, חשמלי או תהליכי.",
    );
  }

  if (
    failuresLast7Days >= 3
  ) {
    recommendations.push(
      "לקבוע בדיקת אמינות יזומה לנכס במהלך השבוע הקרוב.",
    );
  }

  if (
    downtimeFailuresLast30Days >=
    2
  ) {
    recommendations.push(
      "לבחון הכנסת טיפול מונע ייעודי לרכיב או לתת־הנכס שגרם להשבתות.",
    );
  }

  if (
    snapshot.timeSummary
      .averageRepairMinutes >
    120
  ) {
    recommendations.push(
      "לבדוק זמינות חלפים, שרטוטים והוראות עבודה כדי לקצר את זמן התיקון.",
    );
  }

  if (
    snapshot.timeSummary
      .averageResponseMinutes >
    60
  ) {
    recommendations.push(
      "לבדוק עומס צוות, תהליך הקצאת קריאות וזמינות אנשי מקצוע.",
    );
  }

  if (
    snapshot.workOrderSummary
      .openWorkOrders === 0 &&
    repeatedFailures.length ===
      0 &&
    failuresLast7Days === 0
  ) {
    recommendations.push(
      "להמשיך בתוכנית התחזוקה הנוכחית ולעקוב אחר מגמות האמינות והזמינות.",
    );
  }

  return recommendations;
}

export function getAssetIntelligenceSnapshot(
  assetNumber: string,
): AssetIntelligenceSnapshot | null {
  const snapshot =
    getAssetDetailsSnapshot(
      assetNumber,
    );

  if (!snapshot) {
    return null;
  }

  const workOrdersLast7Days =
    getRecentWorkOrders(
      snapshot.workOrders,
      7,
    );

  const workOrdersLast30Days =
    getRecentWorkOrders(
      snapshot.workOrders,
      30,
    );

  const repeatedFailures =
    detectRepeatedFailures(
      workOrdersLast30Days,
    );

  const downtimeFailuresLast30Days =
    workOrdersLast30Days.filter(
      (workOrder) =>
        workOrder.isDowntime,
    ).length;

  const healthScore =
    calculateHealthScore(
      snapshot,
      repeatedFailures,
      workOrdersLast30Days.length,
      downtimeFailuresLast30Days,
    );

  const riskLevel =
    getRiskLevel(
      healthScore,
      snapshot,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    assetId:
      snapshot.asset.id,

    assetCode:
      snapshot.asset.assetCode,

    assetNumber:
      snapshot.asset.assetNumber,

    healthScore,

    riskLevel,

    failuresLast7Days:
      workOrdersLast7Days.length,

    failuresLast30Days:
      workOrdersLast30Days.length,

    downtimeFailuresLast30Days,

    repeatedFailures,

    insights:
      buildInsights(
        snapshot,
        repeatedFailures,
        workOrdersLast7Days.length,
        workOrdersLast30Days.length,
        downtimeFailuresLast30Days,
        healthScore,
      ),

    recommendations:
      buildRecommendations(
        snapshot,
        repeatedFailures,
        workOrdersLast7Days.length,
        downtimeFailuresLast30Days,
      ),
  };
}