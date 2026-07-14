import type { WorkOrder } from "../types/workOrder";

import {
  getMachineDetailsSnapshot,
  type MachineDetailsSnapshot,
} from "./machineDetailsService";

export type MachineRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MachineInsightSeverity =
  | "positive"
  | "info"
  | "warning"
  | "danger";

export type MachineInsight = {
  id: string;
  severity: MachineInsightSeverity;
  title: string;
  description: string;
};

export type RepeatedFailure = {
  normalizedDescription: string;
  exampleDescription: string;
  count: number;
  downtimeCount: number;
  lastOccurredAt: string;
};

export type MachineIntelligenceSnapshot = {
  generatedAt: string;
  assetNumber: string;

  healthScore: number;
  riskLevel: MachineRiskLevel;

  failuresLast7Days: number;
  failuresLast30Days: number;
  downtimeFailuresLast30Days: number;

  repeatedFailures: RepeatedFailure[];

  insights: MachineInsight[];
  recommendations: string[];
};

function startOfDaysAgo(days: number): number {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date.getTime();
}

function isAfterDate(
  dateValue: string,
  minimumTime: number
): boolean {
  const time = new Date(dateValue).getTime();

  return !Number.isNaN(time) && time >= minimumTime;
}

function normalizeDescription(
  description: string
): string {
  return description
    .trim()
    .toLowerCase()
    .replace(/[.,:;!?()[\]{}"']/g, " ")
    .replace(/\s+/g, " ");
}

function getRecentWorkOrders(
  workOrders: WorkOrder[],
  days: number
): WorkOrder[] {
  const minimumTime = startOfDaysAgo(days);

  return workOrders.filter((workOrder) =>
    isAfterDate(
      workOrder.openedAt,
      minimumTime
    )
  );
}

function detectRepeatedFailures(
  workOrders: WorkOrder[]
): RepeatedFailure[] {
  const groups = new Map<
    string,
    RepeatedFailure
  >();

  workOrders.forEach((workOrder) => {
    const normalizedDescription =
      normalizeDescription(
        workOrder.faultDescription
      );

    if (!normalizedDescription) {
      return;
    }

    const existing = groups.get(
      normalizedDescription
    );

    if (existing) {
      existing.count += 1;

      if (workOrder.isDowntime) {
        existing.downtimeCount += 1;
      }

      if (
        new Date(
          workOrder.openedAt
        ).getTime() >
        new Date(
          existing.lastOccurredAt
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
          workOrder.isDowntime ? 1 : 0,
        lastOccurredAt:
          workOrder.openedAt,
      }
    );
  });

  return Array.from(groups.values())
    .filter(
      (failure) =>
        failure.count >= 2
    )
    .sort((first, second) => {
      if (
        first.count !== second.count
      ) {
        return (
          second.count -
          first.count
        );
      }

      return (
        new Date(
          second.lastOccurredAt
        ).getTime() -
        new Date(
          first.lastOccurredAt
        ).getTime()
      );
    });
}

function calculateHealthScore(
  snapshot: MachineDetailsSnapshot,
  repeatedFailures: RepeatedFailure[],
  failuresLast30Days: number,
  downtimeFailuresLast30Days: number
): number {
  let score = 100;

  const machine = snapshot.machine;
  const summary =
    snapshot.workOrderSummary;
  const timeSummary =
    snapshot.timeSummary;

  if (
    summary.openDowntimeWorkOrders >
    0
  ) {
    score -= 35;
  }

  score -= Math.min(
    summary.openWorkOrders * 8,
    24
  );

  score -= Math.min(
    failuresLast30Days * 3,
    18
  );

  score -= Math.min(
    downtimeFailuresLast30Days * 7,
    21
  );

  score -= Math.min(
    repeatedFailures.length * 8,
    24
  );

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

  if (machine.availability < 80) {
    score -= 20;
  } else if (
    machine.availability < 90
  ) {
    score -= 12;
  } else if (
    machine.availability < 95
  ) {
    score -= 6;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score)
    )
  );
}

function getRiskLevel(
  healthScore: number,
  snapshot: MachineDetailsSnapshot
): MachineRiskLevel {
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
  snapshot: MachineDetailsSnapshot,
  repeatedFailures: RepeatedFailure[],
  failuresLast7Days: number,
  failuresLast30Days: number,
  downtimeFailuresLast30Days: number,
  healthScore: number
): MachineInsight[] {
  const insights: MachineInsight[] =
    [];

  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders > 0
  ) {
    insights.push({
      id: "open-downtime",
      severity: "danger",
      title: "המכונה מושבתת",
      description: `קיימות ${snapshot.workOrderSummary.openDowntimeWorkOrders} קריאות משביתות פתוחות.`,
    });
  } else {
    insights.push({
      id: "no-open-downtime",
      severity: "positive",
      title: "אין השבתה פעילה",
      description:
        "כרגע אין קריאה משביתה פתוחה למכונה.",
    });
  }

  if (
    snapshot.workOrderSummary
      .openWorkOrders > 0
  ) {
    insights.push({
      id: "open-work-orders",
      severity: "warning",
      title: "קריאות פתוחות",
      description: `קיימות ${snapshot.workOrderSummary.openWorkOrders} קריאות שטרם נסגרו.`,
    });
  }

  if (failuresLast7Days >= 3) {
    insights.push({
      id: "many-failures-seven-days",
      severity: "danger",
      title:
        "ריבוי תקלות בשבוע האחרון",
      description: `נפתחו ${failuresLast7Days} קריאות ב־7 הימים האחרונים.`,
    });
  } else if (
    failuresLast30Days >= 4
  ) {
    insights.push({
      id: "many-failures-thirty-days",
      severity: "warning",
      title: "תדירות תקלות גבוהה",
      description: `נפתחו ${failuresLast30Days} קריאות ב־30 הימים האחרונים.`,
    });
  }

  if (
    downtimeFailuresLast30Days >= 2
  ) {
    insights.push({
      id: "downtime-failures",
      severity: "danger",
      title: "השבתות חוזרות",
      description: `נרשמו ${downtimeFailuresLast30Days} קריאות משביתות ב־30 הימים האחרונים.`,
    });
  }

  if (repeatedFailures.length > 0) {
    const mostRepeated =
      repeatedFailures[0];

    insights.push({
      id: "repeated-failure",
      severity: "warning",
      title: "זוהתה תקלה חוזרת",
      description: `"${mostRepeated.exampleDescription}" הופיעה ${mostRepeated.count} פעמים.`,
    });
  }

  if (
    snapshot.timeSummary
      .averageRepairMinutes > 120
  ) {
    insights.push({
      id: "high-repair-time",
      severity: "warning",
      title:
        "זמן תיקון ממוצע גבוה",
      description:
        "זמן התיקון הממוצע גבוה משעתיים.",
    });
  }

  if (
    snapshot.timeSummary
      .averageResponseMinutes > 60
  ) {
    insights.push({
      id: "high-response-time",
      severity: "warning",
      title: "זמן תגובה גבוה",
      description:
        "זמן התגובה הממוצע לקריאה גבוה משעה.",
    });
  }

  if (
    snapshot.machine.availability >=
    95
  ) {
    insights.push({
      id: "high-availability",
      severity: "positive",
      title: "זמינות גבוהה",
      description: `זמינות המכונה היא ${snapshot.machine.availability.toFixed(
        1
      )}%.`,
    });
  }

  if (
    healthScore >= 85 &&
    insights.every(
      (insight) =>
        insight.severity !== "danger"
    )
  ) {
    insights.push({
      id: "good-health",
      severity: "positive",
      title: "מצב מכונה טוב",
      description:
        "לא זוהו כרגע סימנים משמעותיים להידרדרות.",
    });
  }

  return insights;
}

function buildRecommendations(
  snapshot: MachineDetailsSnapshot,
  repeatedFailures: RepeatedFailure[],
  failuresLast7Days: number,
  downtimeFailuresLast30Days: number
): string[] {
  const recommendations: string[] =
    [];

  if (
    snapshot.workOrderSummary
      .openDowntimeWorkOrders > 0
  ) {
    recommendations.push(
      "לתעדף טיפול מיידי בקריאות המשביתות הפתוחות."
    );
  }

  if (
    repeatedFailures.length > 0
  ) {
    recommendations.push(
      "לבצע ניתוח שורש תקלה לתקלה החוזרת ולבדוק אם נדרש שינוי מכני, חשמלי או תהליכי."
    );
  }

  if (failuresLast7Days >= 3) {
    recommendations.push(
      "לקבוע בדיקת אמינות יזומה למכונה במהלך השבוע הקרוב."
    );
  }

  if (
    downtimeFailuresLast30Days >= 2
  ) {
    recommendations.push(
      "לבחון הכנסת טיפול מונע ייעודי לרכיב שגרם להשבתות."
    );
  }

  if (
    snapshot.timeSummary
      .averageRepairMinutes > 120
  ) {
    recommendations.push(
      "לבדוק זמינות חלפים, שרטוטים והוראות עבודה כדי לקצר את זמן התיקון."
    );
  }

  if (
    snapshot.timeSummary
      .averageResponseMinutes > 60
  ) {
    recommendations.push(
      "לבדוק עומס צוות, תהליך הקצאת קריאות וזמינות אנשי מקצוע."
    );
  }

  if (
    snapshot.workOrderSummary
      .openWorkOrders === 0 &&
    repeatedFailures.length === 0 &&
    failuresLast7Days === 0
  ) {
    recommendations.push(
      "להמשיך בתוכנית התחזוקה הנוכחית ולעקוב אחר המגמה."
    );
  }

  return recommendations;
}

export function getMachineIntelligenceSnapshot(
  assetNumber: string
): MachineIntelligenceSnapshot | null {
  const snapshot =
    getMachineDetailsSnapshot(
      assetNumber
    );

  if (!snapshot) {
    return null;
  }

  const workOrdersLast7Days =
    getRecentWorkOrders(
      snapshot.workOrders,
      7
    );

  const workOrdersLast30Days =
    getRecentWorkOrders(
      snapshot.workOrders,
      30
    );

  const repeatedFailures =
    detectRepeatedFailures(
      workOrdersLast30Days
    );

  const downtimeFailuresLast30Days =
    workOrdersLast30Days.filter(
      (workOrder) =>
        workOrder.isDowntime
    ).length;

  const healthScore =
    calculateHealthScore(
      snapshot,
      repeatedFailures,
      workOrdersLast30Days.length,
      downtimeFailuresLast30Days
    );

  const riskLevel = getRiskLevel(
    healthScore,
    snapshot
  );

  return {
    generatedAt:
      new Date().toISOString(),

    assetNumber,

    healthScore,
    riskLevel,

    failuresLast7Days:
      workOrdersLast7Days.length,

    failuresLast30Days:
      workOrdersLast30Days.length,

    downtimeFailuresLast30Days,

    repeatedFailures,

    insights: buildInsights(
      snapshot,
      repeatedFailures,
      workOrdersLast7Days.length,
      workOrdersLast30Days.length,
      downtimeFailuresLast30Days,
      healthScore
    ),

    recommendations:
      buildRecommendations(
        snapshot,
        repeatedFailures,
        workOrdersLast7Days.length,
        downtimeFailuresLast30Days
      ),
  };
}