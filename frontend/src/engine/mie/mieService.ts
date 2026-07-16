import {
  buildMieRuleContext,
} from "./contextBuilder";

import {
  runMieRuleEngine,
} from "./ruleEngine";

import type {
  MieEngineSnapshot,
  MieRecommendation,
  MieRuleResult,
} from "./types";

export type MieAssetSnapshot = {
  generatedAt: string;

  assetNumber: string;
  machineCode: string;

  healthScore: number;
  baseHealthScore: number;

  riskLevel:
    | "low"
    | "medium"
    | "high"
    | "critical";

  triggeredRules: MieRuleResult[];
  passedRules: MieRuleResult[];

  recommendations:
    MieRecommendation[];

  urgentRecommendations:
    MieRecommendation[];

  engine: MieEngineSnapshot;
};

function sortTriggeredRules(
  results: MieRuleResult[]
): MieRuleResult[] {
  const severityRank = {
    positive: 0,
    info: 1,
    warning: 2,
    danger: 3,
    critical: 4,
  };

  return [...results].sort(
    (first, second) => {
      const severityDifference =
        severityRank[
          second.severity
        ] -
        severityRank[
          first.severity
        ];

      if (severityDifference !== 0) {
        return severityDifference;
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
          second.evaluatedAt
        ).getTime() -
        new Date(
          first.evaluatedAt
        ).getTime()
      );
    }
  );
}

function sortRecommendations(
  recommendations:
    MieRecommendation[]
): MieRecommendation[] {
  const priorityRank = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };

  return [...recommendations].sort(
    (first, second) => {
      const priorityDifference =
        priorityRank[
          second.priority
        ] -
        priorityRank[
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

export function getMieAssetSnapshot(
  assetNumber: string
): MieAssetSnapshot | null {
  const context =
    buildMieRuleContext(
      assetNumber
    );

  if (!context) {
    return null;
  }

  const engine =
    runMieRuleEngine(
      context
    );

  const triggeredRules =
    sortTriggeredRules(
      engine.results.filter(
        (result) =>
          result.status ===
          "triggered"
      )
    );

  const passedRules =
    engine.results.filter(
      (result) =>
        result.status ===
        "passed"
    );

  const recommendations =
    sortRecommendations(
      engine.recommendations
    );

  const urgentRecommendations =
    recommendations.filter(
      (recommendation) =>
        recommendation.priority ===
        "urgent"
    );

  return {
    generatedAt:
      new Date().toISOString(),

    assetNumber:
      engine.assetNumber,

    machineCode:
      engine.machineCode,

    healthScore:
      engine.calculatedHealthScore,

    baseHealthScore:
      engine.baseHealthScore,

    riskLevel:
      engine.riskLevel,

    triggeredRules,

    passedRules,

    recommendations,

    urgentRecommendations,

    engine,
  };
}

export function getMieHealthScore(
  assetNumber: string
): number | null {
  const snapshot =
    getMieAssetSnapshot(
      assetNumber
    );

  return (
    snapshot?.healthScore ??
    null
  );
}

export function getMieRecommendations(
  assetNumber: string
): MieRecommendation[] {
  return (
    getMieAssetSnapshot(
      assetNumber
    )?.recommendations ?? []
  );
}

export function getMieTriggeredRules(
  assetNumber: string
): MieRuleResult[] {
  return (
    getMieAssetSnapshot(
      assetNumber
    )?.triggeredRules ?? []
  );
}