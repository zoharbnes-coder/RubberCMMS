import type {
  PreventiveMaintenanceExecution,
} from "../../../types/preventiveMaintenance";

import {
  createMieEvidence,
  createMieRecommendation,
  createMieRuleResult,
  type MieEvidence,
  type MieRule,
  type MieRuleConfiguration,
  type MieRuleContext,
  type MieRuleResult,
} from "../types";

const configuration: MieRuleConfiguration = {
  id: "MIE-RULE-002",

  name: "Overdue Preventive Maintenance",

  description:
    "מזהה טיפולים מונעים שעבר מועד הביצוע שלהם ומחשב את חומרת האיחור.",

  category: "preventive_maintenance",

  enabled: true,

  severity: "danger",

  thresholds: {
    maximumOverdueDays: 14,
    minimumConfidencePercent: 80,
  },

  healthPenalty: 12,

  recommendationPriority: "urgent",

  actionType: "schedule_pm",

  recommendationTitle:
    "נדרש לבצע טיפול מונע באיחור",

  recommendationDescription:
    "זוהה טיפול מונע שמועד הביצוע שלו עבר. מומלץ לתאם ביצוע, לוודא זמינות כוח אדם וחלפים ולבחון את השפעת האיחור על אמינות המכונה.",
};

function getDateTime(
  value: string | null
): number | null {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();

  if (Number.isNaN(time)) {
    return null;
  }

  return time;
}

function getOverdueDays(
  dueAt: string
): number {
  const dueTime =
    getDateTime(dueAt);

  if (dueTime === null) {
    return 0;
  }

  const difference =
    Date.now() - dueTime;

  if (difference <= 0) {
    return 0;
  }

  return Math.floor(
    difference /
      (24 * 60 * 60 * 1000)
  );
}

function isOverdueExecution(
  execution: PreventiveMaintenanceExecution
): boolean {
  if (
    execution.status === "completed" ||
    execution.status === "cancelled"
  ) {
    return false;
  }

  if (
    execution.status === "overdue"
  ) {
    return true;
  }

  return getOverdueDays(
    execution.dueAt
  ) > 0;
}

function getOverdueExecutions(
  context: MieRuleContext
): PreventiveMaintenanceExecution[] {
  return context
    .preventiveMaintenanceExecutions
    .filter(isOverdueExecution)
    .sort((first, second) => {
      const firstDays =
        getOverdueDays(first.dueAt);

      const secondDays =
        getOverdueDays(second.dueAt);

      return secondDays - firstDays;
    });
}

function getSeverityByDays(
  overdueDays: number
): "warning" | "danger" | "critical" {
  const maximumOverdueDays =
    configuration.thresholds
      .maximumOverdueDays ?? 14;

  if (
    overdueDays >=
    maximumOverdueDays * 2
  ) {
    return "critical";
  }

  if (
    overdueDays >=
    maximumOverdueDays
  ) {
    return "danger";
  }

  return "warning";
}

function calculateConfidence(
  executions: PreventiveMaintenanceExecution[]
): number {
  if (executions.length === 0) {
    return 100;
  }

  const highestOverdueDays =
    Math.max(
      ...executions.map(
        (execution) =>
          getOverdueDays(
            execution.dueAt
          )
      )
    );

  let confidence = 80;

  confidence += Math.min(
    10,
    executions.length * 3
  );

  confidence += Math.min(
    10,
    Math.floor(
      highestOverdueDays / 7
    ) * 2
  );

  return Math.max(
    0,
    Math.min(100, confidence)
  );
}

function buildEvidence(
  executions: PreventiveMaintenanceExecution[]
): MieEvidence[] {
  const evidence: MieEvidence[] = [
    createMieEvidence({
      type: "calculated_metric",

      label:
        "מספר טיפולים באיחור",

      value:
        String(executions.length),

      sourceId: null,
      sourceNumber: null,

      occurredAt:
        new Date().toISOString(),

      weight: 1,
    }),
  ];

  const highestOverdueDays =
    executions.length > 0
      ? Math.max(
          ...executions.map(
            (execution) =>
              getOverdueDays(
                execution.dueAt
              )
          )
        )
      : 0;

  evidence.push(
    createMieEvidence({
      type: "calculated_metric",

      label:
        "האיחור המרבי",

      value: `${highestOverdueDays} ימים`,

      sourceId: null,
      sourceNumber: null,

      occurredAt:
        new Date().toISOString(),

      weight:
        highestOverdueDays >=
        (configuration.thresholds
          .maximumOverdueDays ?? 14)
          ? 1
          : 0.8,
    })
  );

  executions
    .slice(0, 5)
    .forEach((execution) => {
      evidence.push(
        createMieEvidence({
          type:
            "preventive_maintenance",

          label:
            execution.planTitle,

          value: `${getOverdueDays(
            execution.dueAt
          )} ימים באיחור`,

          sourceId:
            execution.id,

          sourceNumber:
            execution.executionNumber,

          occurredAt:
            execution.dueAt,

          weight:
            getOverdueDays(
              execution.dueAt
            ) >=
            (configuration.thresholds
              .maximumOverdueDays ?? 14)
              ? 1
              : 0.8,
        })
      );
    });

  return evidence;
}

function evaluateOverduePm(
  context: MieRuleContext
): MieRuleResult {
  if (!configuration.enabled) {
    return createMieRuleResult({
      rule: configuration,

      status: "disabled",

      title:
        "החוק אינו פעיל",

      description:
        "בדיקת טיפולים מונעים באיחור מושבתת בהגדרות.",

      confidencePercent: 100,
    });
  }

  if (
    context.preventiveMaintenanceExecutions
      .length === 0
  ) {
    return createMieRuleResult({
      rule: configuration,

      status:
        "insufficient_data",

      title:
        "אין נתוני טיפולים מונעים",

      description:
        "לא קיימים ביצועי טיפול מונע שניתן לבדוק עבור נכס זה.",

      confidencePercent: 100,
    });
  }

  const overdueExecutions =
    getOverdueExecutions(
      context
    );

  if (
    overdueExecutions.length === 0
  ) {
    return createMieRuleResult({
      rule: configuration,

      status: "passed",

      title:
        "אין טיפולים מונעים באיחור",

      description:
        "כל הטיפולים המונעים נמצאים בטווח הביצוע התקין.",

      confidencePercent: 100,
    });
  }

  const highestOverdueDays =
    Math.max(
      ...overdueExecutions.map(
        (execution) =>
          getOverdueDays(
            execution.dueAt
          )
      )
    );

  const evidence =
    buildEvidence(
      overdueExecutions
    );

  const confidencePercent =
    calculateConfidence(
      overdueExecutions
    );

  const highestSeverity =
    getSeverityByDays(
      highestOverdueDays
    );

  const mostOverdueExecution =
    overdueExecutions[0];

  const recommendation =
    createMieRecommendation({
      ruleId:
        configuration.id,

      assetNumber:
        context.assetNumber,

      machineCode:
        context.machineCode,

      priority:
        highestSeverity ===
          "critical" ||
        highestSeverity === "danger"
          ? "urgent"
          : "high",

      actionType:
        configuration.actionType,

      title:
        configuration
          .recommendationTitle,

      description:
        configuration
          .recommendationDescription,

      reason: `נמצאו ${overdueExecutions.length} טיפולים באיחור. הטיפול "${mostOverdueExecution.planTitle}" נמצא באיחור של ${highestOverdueDays} ימים.`,

      confidencePercent,

      evidence,

      relatedMaintenancePlanId:
        mostOverdueExecution.planId,
    });

  return {
    ...createMieRuleResult({
      rule: configuration,

      status: "triggered",

      title:
        "נמצאו טיפולים מונעים באיחור",

      description: `נמצאו ${overdueExecutions.length} טיפולים שעבר מועד הביצוע שלהם. האיחור המרבי הוא ${highestOverdueDays} ימים.`,

      confidencePercent,

      evidence,

      recommendation,
    }),

    severity:
      highestSeverity,

    healthPenalty:
      highestSeverity === "critical"
        ? 20
        : highestSeverity === "danger"
          ? 14
          : 8,
  };
}

export const overduePmRule: MieRule = {
  configuration,

  evaluate:
    evaluateOverduePm,
};