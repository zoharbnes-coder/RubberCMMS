export type MieDecisionStatus =
  | "draft"
  | "pending"
  | "evaluating"
  | "recommended"
  | "approved"
  | "rejected"
  | "executed"
  | "expired"
  | "cancelled";

export type MieDecisionType =
  | "work-assignment"
  | "technician-selection"
  | "team-selection"
  | "contractor-selection"
  | "repair-strategy"
  | "maintenance-strategy"
  | "failure-response"
  | "spare-part-selection"
  | "spare-part-reorder"
  | "inventory-transfer"
  | "document-recommendation"
  | "risk-response"
  | "work-order-priority"
  | "escalation"
  | "shutdown-recommendation"
  | "inspection-recommendation"
  | "planning"
  | "scheduling"
  | "other";

export type MieDecisionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MieDecisionConfidence =
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type MieDecisionSourceType =
  | "manual"
  | "rule"
  | "knowledge-graph"
  | "historical-data"
  | "failure-event"
  | "work-order"
  | "asset"
  | "sensor"
  | "inventory"
  | "document"
  | "user-request"
  | "ai"
  | "other";

export type MieDecisionOptionStatus =
  | "candidate"
  | "recommended"
  | "selected"
  | "rejected"
  | "unavailable"
  | "blocked";

export type MieDecisionOutcome =
  | "successful"
  | "partially-successful"
  | "failed"
  | "cancelled"
  | "unknown";

export type MieDecisionEntityType =
  | "plant"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "failure-mode"
  | "failure-event"
  | "maintenance-request"
  | "work-order"
  | "person"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "document"
  | "project"
  | "other";

export type MieDecisionConstraintType =
  | "skill"
  | "certification"
  | "authorization"
  | "availability"
  | "capacity"
  | "location"
  | "time"
  | "cost"
  | "risk"
  | "safety"
  | "inventory"
  | "lead-time"
  | "priority"
  | "asset"
  | "equipment-class"
  | "failure-mode"
  | "contract"
  | "sla"
  | "policy"
  | "other";

export type MieDecisionCriterionType =
  | "expertise"
  | "experience"
  | "availability"
  | "response-time"
  | "repair-time"
  | "success-rate"
  | "first-time-fix"
  | "cost"
  | "risk"
  | "safety"
  | "quality"
  | "reliability"
  | "distance"
  | "lead-time"
  | "stock"
  | "compatibility"
  | "document-relevance"
  | "historical-performance"
  | "workload"
  | "sla"
  | "other";

export type MieDecisionTriggerType =
  | "failure-created"
  | "request-created"
  | "work-order-created"
  | "work-order-delayed"
  | "work-order-escalated"
  | "critical-risk-detected"
  | "repeat-failure-detected"
  | "stockout-risk"
  | "certification-expiring"
  | "capacity-shortage"
  | "manual-request"
  | "scheduled-analysis"
  | "other";

export type MieDecisionActionType =
  | "assign-person"
  | "assign-team"
  | "assign-contractor"
  | "set-priority"
  | "create-work-order"
  | "create-request"
  | "reserve-spare-part"
  | "reorder-spare-part"
  | "transfer-inventory"
  | "recommend-document"
  | "recommend-procedure"
  | "escalate"
  | "notify"
  | "inspect"
  | "shutdown"
  | "monitor"
  | "defer"
  | "other";

export type MieDecisionEntityReference = {
  entityType:
    MieDecisionEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type MieDecisionInput = {
  id: string;

  sourceType:
    MieDecisionSourceType;

  entityReference:
    MieDecisionEntityReference | null;

  key: string;

  displayName: string;

  value:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];

  unit: string;

  weight: number;

  confidenceScore: number;

  mandatory: boolean;

  observedAt: string | null;

  notes: string;
};

export type MieDecisionConstraint = {
  id: string;

  constraintType:
    MieDecisionConstraintType;

  displayName: string;

  description: string;

  mandatory: boolean;

  blocking: boolean;

  operator:
    | "equals"
    | "not-equals"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "contains"
    | "not-contains"
    | "exists"
    | "not-exists"
    | "in"
    | "not-in";

  field: string;

  expectedValue:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];

  satisfied: boolean | null;

  failureReason: string;

  notes: string;
};

export type MieDecisionCriterion = {
  id: string;

  criterionType:
    MieDecisionCriterionType;

  displayName: string;

  description: string;

  weight: number;

  minimumScore:
    number | null;

  maximumScore:
    number | null;

  mandatory: boolean;

  notes: string;
};

export type MieDecisionScore = {
  id: string;

  criterionId: string;

  criterionType:
    MieDecisionCriterionType;

  rawScore: number;

  normalizedScore: number;

  weight: number;

  weightedScore: number;

  explanation: string;
};

export type MieDecisionOption = {
  id: string;

  optionCode: string;

  displayName: string;

  description: string;

  entityReference:
    MieDecisionEntityReference | null;

  status:
    MieDecisionOptionStatus;

  eligible: boolean;

  blocked: boolean;

  blockingReasons: string[];

  constraintResults:
    MieDecisionConstraint[];

  scores:
    MieDecisionScore[];

  totalScore: number;

  confidenceScore: number;

  rank: number;

  estimatedCost:
    number | null;

  currency: string;

  estimatedDurationMinutes:
    number | null;

  estimatedResponseMinutes:
    number | null;

  estimatedRiskScore:
    number | null;

  estimatedSuccessProbability:
    number | null;

  recommended: boolean;

  selected: boolean;

  explanation: string;

  notes: string;
};

export type MieDecisionRecommendation = {
  id: string;

  title: string;

  summary: string;

  detailedReasoning: string;

  recommendedOptionId:
    string | null;

  alternativeOptionIds:
    string[];

  confidence:
    MieDecisionConfidence;

  confidenceScore: number;

  expectedBenefit: string;

  expectedRisk: string;

  expectedCost:
    number | null;

  currency: string;

  expectedDowntimeMinutes:
    number | null;

  expectedSuccessProbability:
    number | null;

  requiresApproval: boolean;

  approvalRole: string;

  expiresAt: string | null;

  generatedAt: string;
};

export type MieDecisionAction = {
  id: string;

  actionType:
    MieDecisionActionType;

  displayName: string;

  description: string;

  targetEntity:
    MieDecisionEntityReference | null;

  sequence: number;

  mandatory: boolean;

  requiresApproval: boolean;

  approved: boolean | null;

  executed: boolean;

  executedAt: string | null;

  executedByPersonId:
    string | null;

  executedByName: string;

  result: string;

  notes: string;
};

export type MieDecisionEvidence = {
  id: string;

  sourceType:
    MieDecisionSourceType;

  entityReference:
    MieDecisionEntityReference | null;

  documentId: string | null;

  knowledgeGraphNodeId:
    string | null;

  knowledgeGraphEdgeId:
    string | null;

  title: string;

  description: string;

  confidenceScore: number;

  relevanceScore: number;

  observedAt: string | null;

  notes: string;
};

export type MieDecisionHistoricalReference = {
  id: string;

  decisionId: string | null;

  workOrderId: string | null;

  failureEventId: string | null;

  assetId: string | null;

  failureModeId: string | null;

  selectedOptionId:
    string | null;

  outcome:
    MieDecisionOutcome;

  successScore: number;

  similarityScore: number;

  description: string;

  occurredAt: string | null;

  notes: string;
};

export type MieDecisionApproval = {
  required: boolean;

  status:
    | "not-required"
    | "pending"
    | "approved"
    | "rejected";

  requestedAt: string | null;

  requestedByPersonId:
    string | null;

  requestedByName: string;

  assignedToPersonId:
    string | null;

  assignedToName: string;

  approvedAt: string | null;

  rejectedAt: string | null;

  comments: string;
};

export type MieDecisionFeedback = {
  id: string;

  providedByPersonId:
    string | null;

  providedByName: string;

  providedAt: string;

  useful: boolean | null;

  recommendationAccepted:
    boolean | null;

  selectedOptionCorrect:
    boolean | null;

  rating:
    number | null;

  actualOutcome:
    MieDecisionOutcome;

  actualCost:
    number | null;

  actualDurationMinutes:
    number | null;

  actualDowntimeMinutes:
    number | null;

  actualSuccess:
    boolean | null;

  comments: string;
};

export type MieDecisionOutcomeRecord = {
  outcome:
    MieDecisionOutcome;

  completedAt: string | null;

  selectedOptionId:
    string | null;

  actualCost:
    number | null;

  currency: string;

  actualResponseMinutes:
    number | null;

  actualRepairMinutes:
    number | null;

  actualDowntimeMinutes:
    number | null;

  repeatFailureOccurred:
    boolean | null;

  repeatFailureWithinDays:
    number | null;

  safetyIncidentOccurred:
    boolean;

  qualityIssueOccurred:
    boolean;

  successful:
    boolean | null;

  outcomeScore: number;

  lessonsLearned: string;

  notes: string;
};

export type MieDecisionRuleCondition = {
  id: string;

  field: string;

  operator:
    | "equals"
    | "not-equals"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "contains"
    | "not-contains"
    | "exists"
    | "not-exists"
    | "in"
    | "not-in";

  value:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];
};

export type MieDecisionRule = {
  id: string;

  ruleCode: string;

  displayName: string;

  description: string;

  decisionType:
    MieDecisionType;

  active: boolean;

  priority: number;

  conditions:
    MieDecisionRuleCondition[];

  actionType:
    MieDecisionActionType;

  targetEntityType:
    MieDecisionEntityType | null;

  minimumConfidenceScore:
    number;

  automaticExecutionAllowed:
    boolean;

  approvalRequired: boolean;

  createdAt: string;

  updatedAt: string;

  lastExecutedAt:
    string | null;
};

export type MieDecisionTrigger = {
  id: string;

  triggerType:
    MieDecisionTriggerType;

  sourceEntity:
    MieDecisionEntityReference | null;

  triggeredAt: string;

  description: string;

  priority:
    MieDecisionPriority;

  automatic: boolean;

  processed: boolean;

  processedAt: string | null;

  notes: string;
};

export type MieDecisionMetrics = {
  totalDecisionCount: number;

  pendingDecisionCount: number;

  recommendedDecisionCount:
    number;

  approvedDecisionCount: number;

  rejectedDecisionCount: number;

  executedDecisionCount: number;

  successfulDecisionCount:
    number;

  failedDecisionCount: number;

  acceptanceRatePercent: number;

  successRatePercent: number;

  averageConfidenceScore:
    number;

  averageDecisionTimeMs:
    number;

  averageOptionCount: number;

  averageOutcomeScore: number;

  humanOverrideCount: number;

  humanOverrideRatePercent:
    number;

  automaticExecutionCount:
    number;

  recommendationAccuracyPercent:
    number;

  lastDecisionAt: string | null;

  lastExecutedAt: string | null;
};

export type MieDecisionEngineProfile = {
  engineHealthScore: number;

  decisionAccuracyScore:
    number;

  recommendationAcceptanceScore:
    number;

  outcomeSuccessScore:
    number;

  knowledgeUtilizationScore:
    number;

  historicalLearningScore:
    number;

  ruleCoverageScore: number;

  humanOverrideScore: number;

  overallIntelligenceScore:
    number;

  highConfidenceDecisionIds:
    string[];

  lowConfidenceDecisionIds:
    string[];

  frequentlyOverriddenRuleIds:
    string[];

  recommendedRuleReviewIds:
    string[];

  knowledgeGapEntityIds:
    string[];

  recommendedImprovements:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type MieDecision = {
  id: string;

  /*
   * Identification
   */
  decisionNumber: string;

  decisionCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  decisionType:
    MieDecisionType;

  status:
    MieDecisionStatus;

  priority:
    MieDecisionPriority;

  /*
   * Context
   */
  plantId: string | null;

  functionalLocationId:
    string | null;

  equipmentClassId:
    string | null;

  assetId: string | null;

  failureModeId: string | null;

  failureEventId: string | null;

  maintenanceRequestId:
    string | null;

  workOrderId: string | null;

  /*
   * Trigger
   */
  trigger:
    MieDecisionTrigger | null;

  /*
   * Inputs
   */
  inputs:
    MieDecisionInput[];

  /*
   * Constraints
   */
  constraints:
    MieDecisionConstraint[];

  /*
   * Criteria
   */
  criteria:
    MieDecisionCriterion[];

  /*
   * Options
   */
  options:
    MieDecisionOption[];

  /*
   * Recommendation
   */
  recommendation:
    MieDecisionRecommendation | null;

  /*
   * Evidence
   */
  evidence:
    MieDecisionEvidence[];

  historicalReferences:
    MieDecisionHistoricalReference[];

  /*
   * Actions
   */
  actions:
    MieDecisionAction[];

  /*
   * Approval
   */
  approval:
    MieDecisionApproval;

  /*
   * Outcome
   */
  outcome:
    MieDecisionOutcomeRecord | null;

  /*
   * Feedback
   */
  feedback:
    MieDecisionFeedback[];

  /*
   * Engine
   */
  engineVersion: string;

  ruleIds: string[];

  knowledgeGraphNodeIds:
    string[];

  knowledgeGraphEdgeIds:
    string[];

  confidence:
    MieDecisionConfidence;

  confidenceScore: number;

  evaluationStartedAt:
    string | null;

  evaluationCompletedAt:
    string | null;

  processingTimeMs:
    number | null;

  /*
   * General
   */
  tags: string[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;

  createdByPersonId:
    string | null;

  createdByName: string;
};

export type MieDecisionEngine = {
  id: string;

  /*
   * Identification
   */
  engineCode: string;

  displayName: string;

  description: string;

  version: string;

  /*
   * Configuration
   */
  active: boolean;

  automaticEvaluationEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  automaticExecutionEnabled:
    boolean;

  humanApprovalRequired:
    boolean;

  minimumRecommendationConfidence:
    number;

  minimumAutomaticExecutionConfidence:
    number;

  maximumOptionsPerDecision:
    number;

  /*
   * Rules
   */
  rules:
    MieDecisionRule[];

  /*
   * Decisions
   */
  decisions:
    MieDecision[];

  /*
   * Metrics
   */
  metrics:
    MieDecisionMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    MieDecisionEngineProfile;

  /*
   * General
   */
  tags: string[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateMieDecisionInput =
  Omit<
    MieDecision,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateMieDecisionInput =
  Partial<CreateMieDecisionInput>;

export type CreateMieDecisionEngineInput =
  Omit<
    MieDecisionEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateMieDecisionEngineInput =
  Partial<CreateMieDecisionEngineInput>;

export type MieDecisionRepositoryResult = {
  success: boolean;

  decision:
    MieDecision | null;

  message: string;
};

export type MieDecisionEngineRepositoryResult = {
  success: boolean;

  decisionEngine:
    MieDecisionEngine | null;

  message: string;
};

export const defaultMieDecisionApproval:
  MieDecisionApproval = {
  required: false,

  status: "not-required",

  requestedAt: null,

  requestedByPersonId: null,

  requestedByName: "",

  assignedToPersonId: null,

  assignedToName: "",

  approvedAt: null,

  rejectedAt: null,

  comments: "",
};

export const defaultMieDecisionMetrics:
  MieDecisionMetrics = {
  totalDecisionCount: 0,

  pendingDecisionCount: 0,

  recommendedDecisionCount: 0,

  approvedDecisionCount: 0,

  rejectedDecisionCount: 0,

  executedDecisionCount: 0,

  successfulDecisionCount: 0,

  failedDecisionCount: 0,

  acceptanceRatePercent: 0,

  successRatePercent: 0,

  averageConfidenceScore: 0,

  averageDecisionTimeMs: 0,

  averageOptionCount: 0,

  averageOutcomeScore: 0,

  humanOverrideCount: 0,

  humanOverrideRatePercent: 0,

  automaticExecutionCount: 0,

  recommendationAccuracyPercent:
    0,

  lastDecisionAt: null,

  lastExecutedAt: null,
};

export const defaultMieDecisionEngineProfile:
  MieDecisionEngineProfile = {
  engineHealthScore: 0,

  decisionAccuracyScore: 0,

  recommendationAcceptanceScore:
    0,

  outcomeSuccessScore: 0,

  knowledgeUtilizationScore: 0,

  historicalLearningScore: 0,

  ruleCoverageScore: 0,

  humanOverrideScore: 0,

  overallIntelligenceScore: 0,

  highConfidenceDecisionIds: [],

  lowConfidenceDecisionIds: [],

  frequentlyOverriddenRuleIds:
    [],

  recommendedRuleReviewIds: [],

  knowledgeGapEntityIds: [],

  recommendedImprovements: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultMieDecision:
  CreateMieDecisionInput = {
  decisionNumber: "",

  decisionCode: "",

  displayName: "",

  description: "",

  decisionType:
    "failure-response",

  status: "draft",

  priority: "medium",

  plantId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  failureModeId: null,

  failureEventId: null,

  maintenanceRequestId: null,

  workOrderId: null,

  trigger: null,

  inputs: [],

  constraints: [],

  criteria: [],

  options: [],

  recommendation: null,

  evidence: [],

  historicalReferences: [],

  actions: [],

  approval:
    defaultMieDecisionApproval,

  outcome: null,

  feedback: [],

  engineVersion: "",

  ruleIds: [],

  knowledgeGraphNodeIds: [],

  knowledgeGraphEdgeIds: [],

  confidence: "low",

  confidenceScore: 0,

  evaluationStartedAt: null,

  evaluationCompletedAt: null,

  processingTimeMs: null,

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",
};

export const defaultMieDecisionEngine:
  CreateMieDecisionEngineInput = {
  engineCode: "MIE",

  displayName:
    "Maintenance Intelligence Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticEvaluationEnabled:
    true,

  automaticRecommendationEnabled:
    true,

  automaticExecutionEnabled:
    false,

  humanApprovalRequired:
    true,

  minimumRecommendationConfidence:
    0.7,

  minimumAutomaticExecutionConfidence:
    0.95,

  maximumOptionsPerDecision: 10,

  rules: [],

  decisions: [],

  tags: [],

  notes: "",
};