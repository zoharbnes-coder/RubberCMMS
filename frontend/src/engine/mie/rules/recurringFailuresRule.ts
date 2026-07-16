import type { WorkOrder } from "../../../types/workOrder";

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

type FailureGroup = {
  normalizedDescription: string;
  exampleDescription: string;

  count: number;
  downtimeCount: number;

  workOrders: WorkOrder[];

  firstOccurredAt: string;
  lastOccurredAt: string;
};

const configuration: MieRuleConfiguration = {
  id: "MIE-RULE-001",

  name: "Recurring Failures",
  description:
    "מזהה תקלות שחזרו מספר פעמים באותה מכונה במהלך חלון זמן מוגדר.",

  category: "reliability",

  enabled: true,

  severity: "warning",

  thresholds: {
    minimumFailureCount: 3,
    observationDays: 30,
    minimumConfidencePercent: 65,
  },

  healthPenalty: 10,

  recommendationPriority: "high",

  actionType: "perform_rca",

  recommendationTitle:
    "נדרש ניתוח שורש תקלה",

  recommendationDescription:
    "זוהתה תקלה חוזרת. מומלץ לבצע RCA, לבדוק את הרכיב החוזר ולבחון פעולה מתקנת קבועה.",
};

function normalizeText(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,:;!?()[\]{}"']/g, " ")
    .replace(/\s+/g, " ");
}

function getMinimumTime(
  observationDays: number
): number {
  return (
    Date.now() -
    observationDays *
      24 *
      60 *
      60 *
      1000
  );
}

function isWithinObservationWindow(
  openedAt: string,
  minimumTime: number
): boolean {
  const openedTime =
    new Date(openedAt).getTime();

  return (
    !Number.isNaN(openedTime) &&
    openedTime >= minimumTime
  );
}

function groupFailures(
  context: MieRuleContext
): FailureGroup[] {
  const observationDays =
    configuration.thresholds
      .observationDays ?? 30;

  const minimumTime =
    getMinimumTime(
      observationDays
    );

  const groups = new Map<
    string,
    FailureGroup
  >();

  context.workOrders
    .filter((workOrder) =>
      isWithinObservationWindow(
        workOrder.openedAt,
        minimumTime
      )
    )
    .forEach((workOrder) => {
      const normalizedDescription =
        normalizeText(
          workOrder.faultDescription
        );

      if (!normalizedDescription) {
        return;
      }

      const existing =
        groups.get(
          normalizedDescription
        );

      if (existing) {
        existing.count += 1;

        if (workOrder.isDowntime) {
          existing.downtimeCount += 1;
        }

        existing.workOrders.push(
          workOrder
        );

        const openedTime =
          new Date(
            workOrder.openedAt
          ).getTime();

        const firstTime =
          new Date(
            existing.firstOccurredAt
          ).getTime();

        const lastTime =
          new Date(
            existing.lastOccurredAt
          ).getTime();

        if (
          !Number.isNaN(openedTime) &&
          openedTime < firstTime
        ) {
          existing.firstOccurredAt =
            workOrder.openedAt;
        }

        if (
          !Number.isNaN(openedTime) &&
          openedTime > lastTime
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

          workOrders: [workOrder],

          firstOccurredAt:
            workOrder.openedAt,

          lastOccurredAt:
            workOrder.openedAt,
        }
      );
    });

  return Array.from(
    groups.values()
  ).sort((first, second) => {
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

function calculateConfidence(
  group: FailureGroup,
  minimumFailureCount: number
): number {
  let confidence = 55;

  confidence +=
    Math.min(
      25,
      Math.max(
        0,
        group.count -
          minimumFailureCount
      ) * 6
    );

  confidence +=
    Math.min(
      15,
      group.downtimeCount * 5
    );

  if (
    group.count >=
    minimumFailureCount + 2
  ) {
    confidence += 5;
  }

  return Math.max(
    0,
    Math.min(
      100,
      confidence
    )
  );
}

function buildEvidence(
  group: FailureGroup
): MieEvidence[] {
  const evidence: MieEvidence[] =
    [
      createMieEvidence({
        type: "calculated_metric",

        label:
          "מספר חזרות של אותה תקלה",

        value:
          String(group.count),

        sourceId: null,
        sourceNumber: null,

        occurredAt:
          group.lastOccurredAt,

        weight: 1,
      }),

      createMieEvidence({
        type: "calculated_metric",

        label:
          "מספר תקלות משביתות מתוך הקבוצה",

        value:
          String(
            group.downtimeCount
          ),

        sourceId: null,
        sourceNumber: null,

        occurredAt:
          group.lastOccurredAt,

        weight:
          group.downtimeCount > 0
            ? 1
            : 0.5,
      }),

      createMieEvidence({
        type: "calculated_metric",

        label:
          "חלון התצפית",

        value: `${
          configuration.thresholds
            .observationDays ?? 30
        } ימים`,

        sourceId: null,
        sourceNumber: null,

        occurredAt:
          group.lastOccurredAt,

        weight: 0.7,
      }),
    ];

  group.workOrders
    .slice(0, 5)
    .forEach((workOrder) => {
      evidence.push(
        createMieEvidence({
          type: "work_order",

          label:
            workOrder.faultDescription,

          value:
            workOrder.status ===
            "closed"
              ? "סגור"
              : "פתוח",

          sourceId:
            workOrder.id,

          sourceNumber:
            workOrder.workOrderNumber,

          occurredAt:
            workOrder.openedAt,

          weight:
            workOrder.isDowntime
              ? 1
              : 0.8,
        })
      );
    });

  return evidence;
}

function evaluateRecurringFailures(
  context: MieRuleContext
): MieRuleResult {
  if (!configuration.enabled) {
    return createMieRuleResult({
      rule: configuration,

      status: "disabled",

      title:
        "החוק אינו פעיל",

      description:
        "בדיקת תקלות חוזרות מושבתת בהגדרות.",

      confidencePercent: 100,
    });
  }

  const minimumFailureCount =
    configuration.thresholds
      .minimumFailureCount ?? 3;

  const groups =
    groupFailures(context);

  if (groups.length === 0) {
    return createMieRuleResult({
      rule: configuration,

      status:
        "insufficient_data",

      title:
        "אין מספיק נתונים",

      description:
        "לא נמצאו קריאות בתקופת התצפית שניתן לנתח.",

      confidencePercent: 100,
    });
  }

  const recurringGroup =
    groups.find(
      (group) =>
        group.count >=
        minimumFailureCount
    );

  if (!recurringGroup) {
    return createMieRuleResult({
      rule: configuration,

      status: "passed",

      title:
        "לא זוהתה תקלה חוזרת",

      description: `לא נמצאה תקלה שחזרה לפחות ${minimumFailureCount} פעמים בתקופת התצפית.`,

      confidencePercent: 100,
    });
  }

  const evidence =
    buildEvidence(
      recurringGroup
    );

  const confidencePercent =
    calculateConfidence(
      recurringGroup,
      minimumFailureCount
    );

  const recommendation =
    createMieRecommendation({
      ruleId:
        configuration.id,

      assetNumber:
        context.assetNumber,

      machineCode:
        context.machineCode,

      priority:
        recurringGroup.downtimeCount >
        0
          ? "urgent"
          : configuration
              .recommendationPriority,

      actionType:
        configuration.actionType,

      title:
        configuration
          .recommendationTitle,

      description:
        configuration
          .recommendationDescription,

      reason: `התקלה "${recurringGroup.exampleDescription}" הופיעה ${recurringGroup.count} פעמים במהלך תקופת התצפית, מתוכן ${recurringGroup.downtimeCount} תקלות משביתות.`,

      confidencePercent,

      evidence,

      relatedWorkOrderId:
        recurringGroup
          .workOrders[0]?.id ??
        null,
    });

  return createMieRuleResult({
    rule: configuration,

    status: "triggered",

    title:
      "זוהתה תקלה חוזרת",

    description: `התקלה "${recurringGroup.exampleDescription}" חזרה ${recurringGroup.count} פעמים במהלך ${
      configuration.thresholds
        .observationDays ?? 30
    } הימים האחרונים.`,

    confidencePercent,

    evidence,

    recommendation,
  });
}

export const recurringFailuresRule: MieRule =
  {
    configuration,

    evaluate:
      evaluateRecurringFailures,
  };