import type {
  MieEngineSnapshot,
  MieEngineSummary,
  MieRecommendation,
  MieRiskLevel,
  MieRule,
  MieRuleContext,
  MieRuleResult,
  MieSeverity,
} from "./types";

import { recurringFailuresRule } from "./rules/recurringFailuresRule";
import { overduePmRule } from "./rules/overduePmRule";

const registeredRules: MieRule[] = [
  recurringFailuresRule,
  overduePmRule,
];

const severityRank: Record<MieSeverity, number> = {
  positive: 0,
  info: 1,
  warning: 2,
  danger: 3,
  critical: 4,
};

const recommendationPriorityRank: Record<
  MieRecommendation["priority"],
  number
> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

function clampNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function calculateHealthScore(
  baseHealthScore: number,
  results: MieRuleResult[]
): number {
  const totalPenalty = results
    .filter(
      (result) =>
        result.status === "triggered"
    )
    .reduce(
      (total, result) =>
        total + result.healthPenalty,
      0
    );

  return clampNumber(
    Math.round(
      baseHealthScore - totalPenalty
    ),
    0,
    100
  );
}

function getRiskLevel(
  healthScore: number,
  results: MieRuleResult[]
): MieRiskLevel {
  const hasCriticalRule = results.some(
    (result) =>
      result.status === "triggered" &&
      result.severity === "critical"
  );

  const hasDangerRule = results.some(
    (result) =>
      result.status === "triggered" &&
      result.severity === "danger"
  );

  if (
    hasCriticalRule ||
    healthScore < 40
  ) {
    return "critical";
  }

  if (
    hasDangerRule ||
    healthScore < 60
  ) {
    return "high";
  }

  const hasWarningRule = results.some(
    (result) =>
      result.status === "triggered" &&
      result.severity === "warning"
  );

  if (
    hasWarningRule ||
    healthScore < 80
  ) {
    return "medium";
  }

  return "low";
}

function getHighestSeverity(
  results: MieRuleResult[]
): MieSeverity {
  if (results.length === 0) {
    return "positive";
  }

  return results.reduce<MieSeverity>(
    (highestSeverity, result) =>
      severityRank[result.severity] >
      severityRank[highestSeverity]
        ? result.severity
        : highestSeverity,
    "positive"
  );
}

function collectRecommendations(
  results: MieRuleResult[]
): MieRecommendation[] {
  const recommendations = results
    .map(
      (result) =>
        result.recommendation
    )
    .filter(
      (
        recommendation
      ): recommendation is MieRecommendation =>
        recommendation !== null
    );

  return recommendations.sort(
    (first, second) => {
      const priorityDifference =
        recommendationPriorityRank[
          second.priority
        ] -
        recommendationPriorityRank[
          first.priority
        ];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      if (
        first.confidencePercent !==
        second.confidencePercent
      ) {
        return (
          second.confidencePercent -
          first.confidencePercent
        );
      }

      return (
        new Date(
          second.createdAt
        ).getTime() -
        new Date(
          first.createdAt
        ).getTime()
      );
    }
  );
}

function buildEngineSummary(
  results: MieRuleResult[],
  recommendations: MieRecommendation[]
): MieEngineSummary {
  return {
    totalRules:
      results.length,

    triggeredRules:
      results.filter(
        (result) =>
          result.status === "triggered"
      ).length,

    passedRules:
      results.filter(
        (result) =>
          result.status === "passed"
      ).length,

    warningRules:
      results.filter(
        (result) =>
          result.status === "triggered" &&
          result.severity === "warning"
      ).length,

    dangerRules:
      results.filter(
        (result) =>
          result.status === "triggered" &&
          result.severity === "danger"
      ).length,

    criticalRules:
      results.filter(
        (result) =>
          result.status === "triggered" &&
          result.severity === "critical"
      ).length,

    totalHealthPenalty:
      results
        .filter(
          (result) =>
            result.status === "triggered"
        )
        .reduce(
          (total, result) =>
            total +
            result.healthPenalty,
          0
        ),

    highestSeverity:
      getHighestSeverity(results),

    recommendationCount:
      recommendations.length,

    urgentRecommendationCount:
      recommendations.filter(
        (recommendation) =>
          recommendation.priority ===
          "urgent"
      ).length,
  };
}

function evaluateRule(
  rule: MieRule,
  context: MieRuleContext
): MieRuleResult {
  try {
    return rule.evaluate(context);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "שגיאה לא ידועה";

    return {
      ruleId:
        rule.configuration.id,

      ruleName:
        rule.configuration.name,

      category:
        rule.configuration.category,

      status:
        "insufficient_data",

      severity:
        "info",

      title:
        "החוק לא הצליח לרוץ",

      description: `אירעה שגיאה בעת הרצת החוק: ${message}`,

      healthPenalty: 0,

      confidencePercent: 0,

      evidence: [],

      recommendation: null,

      evaluatedAt:
        new Date().toISOString(),
    };
  }
}

export function getRegisteredMieRules():
  MieRule[] {
  return [...registeredRules];
}

export function registerMieRule(
  rule: MieRule
): void {
  const existingRuleIndex =
    registeredRules.findIndex(
      (registeredRule) =>
        registeredRule.configuration.id ===
        rule.configuration.id
    );

  if (existingRuleIndex >= 0) {
    registeredRules[
      existingRuleIndex
    ] = rule;

    return;
  }

  registeredRules.push(rule);
}

export function removeMieRule(
  ruleId: string
): boolean {
  const ruleIndex =
    registeredRules.findIndex(
      (rule) =>
        rule.configuration.id ===
        ruleId
    );

  if (ruleIndex < 0) {
    return false;
  }

  registeredRules.splice(
    ruleIndex,
    1
  );

  return true;
}

export function runMieRuleEngine(
  context: MieRuleContext,
  rules: MieRule[] =
    registeredRules
): MieEngineSnapshot {
  const results = rules.map(
    (rule) =>
      evaluateRule(
        rule,
        context
      )
  );

  const recommendations =
    collectRecommendations(results);

  const calculatedHealthScore =
    calculateHealthScore(
      context.currentHealthScore,
      results
    );

  const riskLevel =
    getRiskLevel(
      calculatedHealthScore,
      results
    );

  return {
    generatedAt:
      new Date().toISOString(),

    assetNumber:
      context.assetNumber,

    machineCode:
      context.machineCode,

    baseHealthScore:
      context.currentHealthScore,

    calculatedHealthScore,

    riskLevel,

    results,

    recommendations,

    summary:
      buildEngineSummary(
        results,
        recommendations
      ),
  };
}