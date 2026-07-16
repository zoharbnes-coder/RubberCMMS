import type { Machine } from "../../types/machine";
import type { WorkOrder } from "../../types/workOrder";
import type {
  PreventiveMaintenanceExecution,
  PreventiveMaintenancePlan,
} from "../../types/preventiveMaintenance";

export type MieRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MieSeverity =
  | "positive"
  | "info"
  | "warning"
  | "danger"
  | "critical";

export type MieRuleCategory =
  | "reliability"
  | "downtime"
  | "preventive_maintenance"
  | "response"
  | "repair"
  | "availability"
  | "safety"
  | "cost"
  | "inventory"
  | "condition"
  | "data_quality";

export type MieRuleStatus =
  | "passed"
  | "triggered"
  | "not_applicable"
  | "insufficient_data"
  | "disabled";

export type MieRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type MieRecommendationActionType =
  | "monitor"
  | "inspect"
  | "repair"
  | "replace"
  | "schedule_pm"
  | "open_work_order"
  | "perform_rca"
  | "review_spares"
  | "review_documents"
  | "review_staffing"
  | "review_process"
  | "safety_action";

export type MieEvidenceType =
  | "work_order"
  | "preventive_maintenance"
  | "machine_metric"
  | "timeline_event"
  | "spare_part"
  | "document"
  | "condition_measurement"
  | "calculated_metric";

export type MieEvidence = {
  id: string;

  type: MieEvidenceType;

  label: string;
  value: string;

  sourceId: string | null;
  sourceNumber: string | null;

  occurredAt: string | null;

  weight: number;
};

export type MieRuleThresholds = {
  minimumFailureCount?: number;
  observationDays?: number;

  minimumDowntimeMinutes?: number;
  maximumResponseMinutes?: number;
  maximumRepairMinutes?: number;

  minimumAvailabilityPercent?: number;
  maximumOverdueDays?: number;

  minimumHealthScore?: number;
  minimumConfidencePercent?: number;

  comparisonDecreasePercent?: number;
};

export type MieRuleConfiguration = {
  id: string;

  name: string;
  description: string;

  category: MieRuleCategory;

  enabled: boolean;

  severity: MieSeverity;

  thresholds: MieRuleThresholds;

  healthPenalty: number;

  recommendationPriority:
    MieRecommendationPriority;

  actionType:
    MieRecommendationActionType;

  recommendationTitle: string;
  recommendationDescription: string;
};

export type MieRuleContext = {
  generatedAt: string;

  assetNumber: string;
  machineCode: string;

  machine: Machine;

  workOrders: WorkOrder[];

  openWorkOrders: WorkOrder[];
  closedWorkOrders: WorkOrder[];

  preventiveMaintenancePlans:
    PreventiveMaintenancePlan[];

  preventiveMaintenanceExecutions:
    PreventiveMaintenanceExecution[];

  currentHealthScore: number;

  availabilityPercent: number;
  mttrHours: number;
  mtbfHours: number;

  totalDowntimeMinutes: number;
  averageResponseMinutes: number;
  averageRepairMinutes: number;

  failuresLast7Days: number;
  failuresLast30Days: number;
  downtimeFailuresLast30Days: number;

  overduePmCount: number;
  duePmCount: number;
};

export type MieRuleResult = {
  ruleId: string;
  ruleName: string;

  category: MieRuleCategory;

  status: MieRuleStatus;
  severity: MieSeverity;

  title: string;
  description: string;

  healthPenalty: number;

  confidencePercent: number;

  evidence: MieEvidence[];

  recommendation: MieRecommendation | null;

  evaluatedAt: string;
};

export type MieRecommendation = {
  id: string;

  ruleId: string;

  assetNumber: string;
  machineCode: string;

  priority: MieRecommendationPriority;
  actionType: MieRecommendationActionType;

  title: string;
  description: string;

  reason: string;

  confidencePercent: number;

  evidence: MieEvidence[];

  createdAt: string;

  status:
    | "new"
    | "reviewed"
    | "accepted"
    | "dismissed"
    | "completed";

  reviewedBy: string | null;
  reviewedAt: string | null;

  relatedWorkOrderId: string | null;
  relatedMaintenancePlanId: string | null;
};

export type MieRule = {
  configuration: MieRuleConfiguration;

  evaluate: (
    context: MieRuleContext
  ) => MieRuleResult;
};

export type MieEngineSummary = {
  totalRules: number;

  triggeredRules: number;
  passedRules: number;

  warningRules: number;
  dangerRules: number;
  criticalRules: number;

  totalHealthPenalty: number;

  highestSeverity: MieSeverity;

  recommendationCount: number;

  urgentRecommendationCount: number;
};

export type MieEngineSnapshot = {
  generatedAt: string;

  assetNumber: string;
  machineCode: string;

  baseHealthScore: number;
  calculatedHealthScore: number;

  riskLevel: MieRiskLevel;

  results: MieRuleResult[];

  recommendations: MieRecommendation[];

  summary: MieEngineSummary;
};

export type MieAssetQuestion =
  | "what_requires_attention"
  | "why_health_is_low"
  | "why_availability_dropped"
  | "repeated_failures"
  | "pm_status"
  | "recommended_actions"
  | "downtime_causes"
  | "general";

export type MieAskRequest = {
  id: string;

  question: string;
  questionType: MieAssetQuestion;

  assetNumber: string | null;
  department: string | null;

  requestedBy: string;
  requestedAt: string;
};

export type MieAskAnswerSection = {
  title: string;
  content: string;

  severity: MieSeverity;

  evidence: MieEvidence[];
};

export type MieAskAnswer = {
  requestId: string;

  answer: string;

  confidencePercent: number;

  sections: MieAskAnswerSection[];

  recommendations: MieRecommendation[];

  generatedAt: string;
};

export function createMieEvidence(
  evidence: Omit<MieEvidence, "id">
): MieEvidence {
  return {
    id: crypto.randomUUID(),
    ...evidence,
  };
}

export function createMieRecommendation(
  input: {
    ruleId: string;

    assetNumber: string;
    machineCode: string;

    priority: MieRecommendationPriority;
    actionType: MieRecommendationActionType;

    title: string;
    description: string;
    reason: string;

    confidencePercent: number;

    evidence: MieEvidence[];

    relatedWorkOrderId?: string | null;
    relatedMaintenancePlanId?: string | null;
  }
): MieRecommendation {
  return {
    id: crypto.randomUUID(),

    ruleId: input.ruleId,

    assetNumber: input.assetNumber,
    machineCode: input.machineCode,

    priority: input.priority,
    actionType: input.actionType,

    title: input.title,
    description: input.description,
    reason: input.reason,

    confidencePercent: Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.confidencePercent
        )
      )
    ),

    evidence: input.evidence,

    createdAt:
      new Date().toISOString(),

    status: "new",

    reviewedBy: null,
    reviewedAt: null,

    relatedWorkOrderId:
      input.relatedWorkOrderId ?? null,

    relatedMaintenancePlanId:
      input.relatedMaintenancePlanId ??
      null,
  };
}

export function createMieRuleResult(
  input: {
    rule: MieRuleConfiguration;

    status: MieRuleStatus;

    title: string;
    description: string;

    confidencePercent?: number;

    evidence?: MieEvidence[];

    recommendation?: MieRecommendation | null;
  }
): MieRuleResult {
  const isTriggered =
    input.status === "triggered";

  return {
    ruleId: input.rule.id,
    ruleName: input.rule.name,

    category:
      input.rule.category,

    status: input.status,

    severity:
      input.rule.severity,

    title: input.title,
    description:
      input.description,

    healthPenalty:
      isTriggered
        ? Math.max(
            0,
            input.rule.healthPenalty
          )
        : 0,

    confidencePercent: Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.confidencePercent ?? 100
        )
      )
    ),

    evidence:
      input.evidence ?? [],

    recommendation:
      input.recommendation ?? null,

    evaluatedAt:
      new Date().toISOString(),
  };
}