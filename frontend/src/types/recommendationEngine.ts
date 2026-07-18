export type RecommendationStatus =
  | "draft"
  | "generated"
  | "active"
  | "accepted"
  | "rejected"
  | "executed"
  | "expired"
  | "cancelled"
  | "archived";

export type RecommendationType =
  | "maintenance-action"
  | "work-order"
  | "technician-assignment"
  | "team-assignment"
  | "contractor-assignment"
  | "inspection"
  | "preventive-maintenance"
  | "predictive-maintenance"
  | "repair"
  | "replacement"
  | "shutdown"
  | "monitoring"
  | "spare-part"
  | "inventory"
  | "procurement"
  | "document"
  | "training"
  | "certification"
  | "risk-control"
  | "failure-response"
  | "scheduling"
  | "planning"
  | "cost-optimization"
  | "reliability-improvement"
  | "energy-optimization"
  | "other";

export type RecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RecommendationConfidence =
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type RecommendationSourceType =
  | "manual"
  | "rule"
  | "knowledge-graph"
  | "mie-decision-engine"
  | "risk-engine"
  | "predictive-engine"
  | "historical-data"
  | "failure-event"
  | "work-order"
  | "asset"
  | "inventory"
  | "document"
  | "sensor"
  | "user-feedback"
  | "ai"
  | "other";

export type RecommendationEntityType =
  | "organization"
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
  | "supplier"
  | "spare-part"
  | "inventory"
  | "document"
  | "risk"
  | "project"
  | "other";

export type RecommendationActionType =
  | "create-request"
  | "create-work-order"
  | "assign-person"
  | "assign-team"
  | "assign-contractor"
  | "change-priority"
  | "schedule-work"
  | "reschedule-work"
  | "inspect"
  | "repair"
  | "replace"
  | "monitor"
  | "shutdown"
  | "reserve-spare-part"
  | "reorder-spare-part"
  | "transfer-inventory"
  | "purchase-spare-part"
  | "review-document"
  | "use-document"
  | "perform-training"
  | "renew-certification"
  | "add-risk-control"
  | "escalate"
  | "notify"
  | "other";

export type RecommendationBenefitType =
  | "availability"
  | "reliability"
  | "safety"
  | "cost"
  | "quality"
  | "downtime"
  | "response-time"
  | "repair-time"
  | "inventory"
  | "energy"
  | "compliance"
  | "knowledge"
  | "productivity"
  | "other";

export type RecommendationImpactLevel =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type RecommendationEffortLevel =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type RecommendationUrgency =
  | "immediate"
  | "within-hours"
  | "within-day"
  | "within-week"
  | "planned"
  | "no-deadline";

export type RecommendationFeedbackType =
  | "useful"
  | "not-useful"
  | "incorrect"
  | "partially-correct"
  | "too-late"
  | "too-early"
  | "not-actionable"
  | "duplicate"
  | "other";

export type RecommendationEntityReference = {
  entityType:
    RecommendationEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type RecommendationEvidence = {
  id: string;

  sourceType:
    RecommendationSourceType;

  sourceEntity:
    RecommendationEntityReference | null;

  documentId: string | null;

  knowledgeGraphNodeId:
    string | null;

  knowledgeGraphEdgeId:
    string | null;

  mieDecisionId: string | null;

  riskId: string | null;

  predictionId: string | null;

  title: string;

  description: string;

  relevanceScore: number;

  confidenceScore: number;

  observedAt: string | null;

  notes: string;
};

export type RecommendationBenefit = {
  id: string;

  benefitType:
    RecommendationBenefitType;

  displayName: string;

  description: string;

  impactLevel:
    RecommendationImpactLevel;

  estimatedValue:
    number | null;

  unit: string;

  estimatedAnnualValue:
    number | null;

  currency: string;

  confidenceScore: number;

  notes: string;
};

export type RecommendationCostEstimate = {
  laborCost:
    number | null;

  sparePartCost:
    number | null;

  contractorCost:
    number | null;

  materialCost:
    number | null;

  downtimeCost:
    number | null;

  otherCost:
    number | null;

  totalEstimatedCost:
    number | null;

  currency: string;

  confidenceScore: number;

  notes: string;
};

export type RecommendationTimeEstimate = {
  estimatedResponseMinutes:
    number | null;

  estimatedPreparationMinutes:
    number | null;

  estimatedExecutionMinutes:
    number | null;

  estimatedDowntimeMinutes:
    number | null;

  estimatedTotalMinutes:
    number | null;

  earliestStartAt:
    string | null;

  recommendedStartAt:
    string | null;

  deadlineAt:
    string | null;

  confidenceScore: number;

  notes: string;
};

export type RecommendationRiskAssessment = {
  currentRiskScore:
    number | null;

  currentRiskLevel:
    | "low"
    | "medium"
    | "high"
    | "critical"
    | "extreme"
    | null;

  predictedRiskWithoutAction:
    number | null;

  predictedRiskWithAction:
    number | null;

  expectedRiskReductionPercent:
    number | null;

  safetyImpactScore:
    number | null;

  productionImpactScore:
    number | null;

  financialImpactScore:
    number | null;

  confidenceScore: number;

  notes: string;
};

export type RecommendationAction = {
  id: string;

  actionType:
    RecommendationActionType;

  actionCode: string;

  displayName: string;

  description: string;

  sequence: number;

  targetEntity:
    RecommendationEntityReference | null;

  mandatory: boolean;

  requiresApproval: boolean;

  approved: boolean | null;

  status:
    | "planned"
    | "approved"
    | "in-progress"
    | "completed"
    | "failed"
    | "cancelled";

  assignedPersonId:
    string | null;

  assignedPersonName: string;

  assignedTeamId:
    string | null;

  assignedTeamName: string;

  contractorId: string | null;

  plannedStartAt:
    string | null;

  plannedCompletionAt:
    string | null;

  startedAt: string | null;

  completedAt: string | null;

  result: string;

  notes: string;
};

export type RecommendationAlternative = {
  id: string;

  recommendationId:
    string | null;

  displayName: string;

  description: string;

  score: number;

  confidenceScore: number;

  estimatedCost:
    number | null;

  currency: string;

  estimatedDurationMinutes:
    number | null;

  estimatedRiskScore:
    number | null;

  estimatedBenefitScore:
    number | null;

  reasonNotSelected: string;

  notes: string;
};

export type RecommendationApproval = {
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

export type RecommendationExecution = {
  executed: boolean;

  executionStartedAt:
    string | null;

  executionCompletedAt:
    string | null;

  executedByPersonId:
    string | null;

  executedByName: string;

  createdWorkOrderId:
    string | null;

  createdMaintenanceRequestId:
    string | null;

  createdInventoryTransactionId:
    string | null;

  createdPurchaseRequestId:
    string | null;

  executionResult: string;

  executionError: string;

  notes: string;
};

export type RecommendationOutcome = {
  evaluated: boolean;

  evaluatedAt: string | null;

  successful:
    boolean | null;

  actualBenefitValue:
    number | null;

  actualCost:
    number | null;

  currency: string;

  actualDowntimeMinutes:
    number | null;

  actualExecutionMinutes:
    number | null;

  failurePrevented:
    boolean | null;

  repeatFailureOccurred:
    boolean | null;

  repeatFailureWithinDays:
    number | null;

  riskReduced:
    boolean | null;

  actualRiskReductionPercent:
    number | null;

  safetyIncidentOccurred:
    boolean;

  qualityIssueOccurred:
    boolean;

  outcomeScore: number;

  lessonsLearned: string;

  notes: string;
};

export type RecommendationFeedback = {
  id: string;

  feedbackType:
    RecommendationFeedbackType;

  providedByPersonId:
    string | null;

  providedByName: string;

  providedAt: string;

  accepted:
    boolean | null;

  rating:
    number | null;

  useful:
    boolean | null;

  accurate:
    boolean | null;

  actionable:
    boolean | null;

  comments: string;
};

export type RecommendationRuleCondition = {
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

export type RecommendationRule = {
  id: string;

  ruleCode: string;

  displayName: string;

  description: string;

  recommendationType:
    RecommendationType;

  active: boolean;

  priority: number;

  sourceEntityType:
    RecommendationEntityType | null;

  targetEntityType:
    RecommendationEntityType | null;

  conditions:
    RecommendationRuleCondition[];

  actionType:
    RecommendationActionType;

  minimumConfidenceScore:
    number;

  automaticGenerationEnabled:
    boolean;

  automaticExecutionAllowed:
    boolean;

  approvalRequired: boolean;

  createdAt: string;

  updatedAt: string;

  lastExecutedAt:
    string | null;
};

export type RecommendationTrigger = {
  id: string;

  triggerType:
    | "failure-created"
    | "repeat-failure"
    | "work-order-created"
    | "work-order-overdue"
    | "critical-risk"
    | "risk-increase"
    | "prediction"
    | "stockout-risk"
    | "low-stock"
    | "asset-condition"
    | "inspection-result"
    | "skill-gap"
    | "certification-expiration"
    | "manual"
    | "scheduled"
    | "other";

  sourceEntity:
    RecommendationEntityReference | null;

  triggeredAt: string;

  description: string;

  priority:
    RecommendationPriority;

  automatic: boolean;

  processed: boolean;

  processedAt: string | null;

  notes: string;
};

export type Recommendation = {
  id: string;

  /*
   * Identification
   */
  recommendationNumber: string;

  recommendationCode: string;

  displayName: string;

  title: string;

  summary: string;

  description: string;

  /*
   * Classification
   */
  recommendationType:
    RecommendationType;

  status:
    RecommendationStatus;

  priority:
    RecommendationPriority;

  urgency:
    RecommendationUrgency;

  /*
   * Context
   */
  primaryEntity:
    RecommendationEntityReference | null;

  relatedEntities:
    RecommendationEntityReference[];

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

  riskId: string | null;

  /*
   * Source
   */
  sourceType:
    RecommendationSourceType;

  trigger:
    RecommendationTrigger | null;

  /*
   * Evidence
   */
  evidence:
    RecommendationEvidence[];

  /*
   * Scoring
   */
  recommendationScore: number;

  confidence:
    RecommendationConfidence;

  confidenceScore: number;

  impactLevel:
    RecommendationImpactLevel;

  effortLevel:
    RecommendationEffortLevel;

  priorityScore: number;

  urgencyScore: number;

  benefitScore: number;

  riskReductionScore: number;

  feasibilityScore: number;

  /*
   * Benefits
   */
  benefits:
    RecommendationBenefit[];

  /*
   * Cost
   */
  costEstimate:
    RecommendationCostEstimate;

  /*
   * Time
   */
  timeEstimate:
    RecommendationTimeEstimate;

  /*
   * Risk
   */
  riskAssessment:
    RecommendationRiskAssessment;

  /*
   * Actions
   */
  actions:
    RecommendationAction[];

  /*
   * Alternatives
   */
  alternatives:
    RecommendationAlternative[];

  /*
   * Approval
   */
  approval:
    RecommendationApproval;

  /*
   * Execution
   */
  execution:
    RecommendationExecution;

  /*
   * Outcome
   */
  outcome:
    RecommendationOutcome;

  /*
   * Feedback
   */
  feedback:
    RecommendationFeedback[];

  /*
   * Intelligence relationships
   */
  knowledgeGraphNodeIds:
    string[];

  knowledgeGraphEdgeIds:
    string[];

  mieDecisionIds: string[];

  relatedRiskIds: string[];

  predictionIds: string[];

  sourceRuleIds: string[];

  /*
   * Validity
   */
  generatedAt: string;

  validFrom: string | null;

  expiresAt: string | null;

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

export type RecommendationEngineMetrics = {
  totalRecommendationCount:
    number;

  activeRecommendationCount:
    number;

  acceptedRecommendationCount:
    number;

  rejectedRecommendationCount:
    number;

  executedRecommendationCount:
    number;

  expiredRecommendationCount:
    number;

  successfulRecommendationCount:
    number;

  failedRecommendationCount:
    number;

  acceptanceRatePercent:
    number;

  executionRatePercent: number;

  successRatePercent: number;

  averageConfidenceScore:
    number;

  averageRecommendationScore:
    number;

  averageBenefitScore: number;

  averageRiskReductionScore:
    number;

  averageTimeToAcceptanceMinutes:
    number;

  averageTimeToExecutionMinutes:
    number;

  estimatedTotalSavings:
    number;

  actualTotalSavings: number;

  estimatedDowntimeSavedMinutes:
    number;

  actualDowntimeSavedMinutes:
    number;

  preventedFailureCount: number;

  humanOverrideCount: number;

  feedbackCount: number;

  positiveFeedbackPercent:
    number;

  lastRecommendationAt:
    string | null;

  lastExecutedAt: string | null;
};

export type RecommendationEngineProfile = {
  engineHealthScore: number;

  recommendationAccuracyScore:
    number;

  acceptanceScore: number;

  executionScore: number;

  outcomeSuccessScore: number;

  benefitRealizationScore:
    number;

  riskReductionAccuracyScore:
    number;

  knowledgeUtilizationScore:
    number;

  historicalLearningScore:
    number;

  userTrustScore: number;

  overallIntelligenceScore:
    number;

  highValueRecommendationIds:
    string[];

  lowConfidenceRecommendationIds:
    string[];

  rejectedHighScoreRecommendationIds:
    string[];

  failedRecommendationIds:
    string[];

  frequentlyRejectedRuleIds:
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

export type RecommendationEngine = {
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

  automaticGenerationEnabled:
    boolean;

  automaticScoringEnabled:
    boolean;

  automaticExecutionEnabled:
    boolean;

  humanApprovalRequired:
    boolean;

  minimumRecommendationScore:
    number;

  minimumConfidenceScore:
    number;

  minimumAutomaticExecutionScore:
    number;

  minimumAutomaticExecutionConfidence:
    number;

  maximumActiveRecommendationsPerEntity:
    number;

  recommendationExpirationDays:
    number;

  /*
   * Rules
   */
  rules:
    RecommendationRule[];

  /*
   * Recommendations
   */
  recommendations:
    Recommendation[];

  /*
   * Metrics
   */
  metrics:
    RecommendationEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    RecommendationEngineProfile;

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

export type CreateRecommendationInput =
  Omit<
    Recommendation,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateRecommendationInput =
  Partial<CreateRecommendationInput>;

export type CreateRecommendationEngineInput =
  Omit<
    RecommendationEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateRecommendationEngineInput =
  Partial<CreateRecommendationEngineInput>;

export type RecommendationRepositoryResult = {
  success: boolean;

  recommendation:
    Recommendation | null;

  message: string;
};

export type RecommendationEngineRepositoryResult = {
  success: boolean;

  recommendationEngine:
    RecommendationEngine | null;

  message: string;
};

export const defaultRecommendationCostEstimate:
  RecommendationCostEstimate = {
  laborCost: null,

  sparePartCost: null,

  contractorCost: null,

  materialCost: null,

  downtimeCost: null,

  otherCost: null,

  totalEstimatedCost: null,

  currency: "ILS",

  confidenceScore: 0,

  notes: "",
};

export const defaultRecommendationTimeEstimate:
  RecommendationTimeEstimate = {
  estimatedResponseMinutes:
    null,

  estimatedPreparationMinutes:
    null,

  estimatedExecutionMinutes:
    null,

  estimatedDowntimeMinutes:
    null,

  estimatedTotalMinutes: null,

  earliestStartAt: null,

  recommendedStartAt: null,

  deadlineAt: null,

  confidenceScore: 0,

  notes: "",
};

export const defaultRecommendationRiskAssessment:
  RecommendationRiskAssessment = {
  currentRiskScore: null,

  currentRiskLevel: null,

  predictedRiskWithoutAction:
    null,

  predictedRiskWithAction:
    null,

  expectedRiskReductionPercent:
    null,

  safetyImpactScore: null,

  productionImpactScore: null,

  financialImpactScore: null,

  confidenceScore: 0,

  notes: "",
};

export const defaultRecommendationApproval:
  RecommendationApproval = {
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

export const defaultRecommendationExecution:
  RecommendationExecution = {
  executed: false,

  executionStartedAt: null,

  executionCompletedAt: null,

  executedByPersonId: null,

  executedByName: "",

  createdWorkOrderId: null,

  createdMaintenanceRequestId:
    null,

  createdInventoryTransactionId:
    null,

  createdPurchaseRequestId:
    null,

  executionResult: "",

  executionError: "",

  notes: "",
};

export const defaultRecommendationOutcome:
  RecommendationOutcome = {
  evaluated: false,

  evaluatedAt: null,

  successful: null,

  actualBenefitValue: null,

  actualCost: null,

  currency: "ILS",

  actualDowntimeMinutes: null,

  actualExecutionMinutes: null,

  failurePrevented: null,

  repeatFailureOccurred: null,

  repeatFailureWithinDays:
    null,

  riskReduced: null,

  actualRiskReductionPercent:
    null,

  safetyIncidentOccurred:
    false,

  qualityIssueOccurred: false,

  outcomeScore: 0,

  lessonsLearned: "",

  notes: "",
};

export const defaultRecommendationEngineMetrics:
  RecommendationEngineMetrics = {
  totalRecommendationCount: 0,

  activeRecommendationCount: 0,

  acceptedRecommendationCount: 0,

  rejectedRecommendationCount: 0,

  executedRecommendationCount: 0,

  expiredRecommendationCount: 0,

  successfulRecommendationCount:
    0,

  failedRecommendationCount: 0,

  acceptanceRatePercent: 0,

  executionRatePercent: 0,

  successRatePercent: 0,

  averageConfidenceScore: 0,

  averageRecommendationScore: 0,

  averageBenefitScore: 0,

  averageRiskReductionScore: 0,

  averageTimeToAcceptanceMinutes:
    0,

  averageTimeToExecutionMinutes:
    0,

  estimatedTotalSavings: 0,

  actualTotalSavings: 0,

  estimatedDowntimeSavedMinutes:
    0,

  actualDowntimeSavedMinutes: 0,

  preventedFailureCount: 0,

  humanOverrideCount: 0,

  feedbackCount: 0,

  positiveFeedbackPercent: 0,

  lastRecommendationAt: null,

  lastExecutedAt: null,
};

export const defaultRecommendationEngineProfile:
  RecommendationEngineProfile = {
  engineHealthScore: 0,

  recommendationAccuracyScore:
    0,

  acceptanceScore: 0,

  executionScore: 0,

  outcomeSuccessScore: 0,

  benefitRealizationScore: 0,

  riskReductionAccuracyScore:
    0,

  knowledgeUtilizationScore: 0,

  historicalLearningScore: 0,

  userTrustScore: 0,

  overallIntelligenceScore: 0,

  highValueRecommendationIds:
    [],

  lowConfidenceRecommendationIds:
    [],

  rejectedHighScoreRecommendationIds:
    [],

  failedRecommendationIds: [],

  frequentlyRejectedRuleIds:
    [],

  recommendedRuleReviewIds: [],

  knowledgeGapEntityIds: [],

  recommendedImprovements: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultRecommendation:
  CreateRecommendationInput = {
  recommendationNumber: "",

  recommendationCode: "",

  displayName: "",

  title: "",

  summary: "",

  description: "",

  recommendationType:
    "maintenance-action",

  status: "draft",

  priority: "medium",

  urgency: "planned",

  primaryEntity: null,

  relatedEntities: [],

  plantId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  failureModeId: null,

  failureEventId: null,

  maintenanceRequestId: null,

  workOrderId: null,

  riskId: null,

  sourceType: "manual",

  trigger: null,

  evidence: [],

  recommendationScore: 0,

  confidence: "low",

  confidenceScore: 0,

  impactLevel: "medium",

  effortLevel: "medium",

  priorityScore: 0,

  urgencyScore: 0,

  benefitScore: 0,

  riskReductionScore: 0,

  feasibilityScore: 0,

  benefits: [],

  costEstimate:
    defaultRecommendationCostEstimate,

  timeEstimate:
    defaultRecommendationTimeEstimate,

  riskAssessment:
    defaultRecommendationRiskAssessment,

  actions: [],

  alternatives: [],

  approval:
    defaultRecommendationApproval,

  execution:
    defaultRecommendationExecution,

  outcome:
    defaultRecommendationOutcome,

  feedback: [],

  knowledgeGraphNodeIds: [],

  knowledgeGraphEdgeIds: [],

  mieDecisionIds: [],

  relatedRiskIds: [],

  predictionIds: [],

  sourceRuleIds: [],

  generatedAt: "",

  validFrom: null,

  expiresAt: null,

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",
};

export const defaultRecommendationEngine:
  CreateRecommendationEngineInput = {
  engineCode: "RECOMMENDATION",

  displayName:
    "Maintenance Recommendation Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticGenerationEnabled:
    true,

  automaticScoringEnabled:
    true,

  automaticExecutionEnabled:
    false,

  humanApprovalRequired:
    true,

  minimumRecommendationScore:
    50,

  minimumConfidenceScore: 0.7,

  minimumAutomaticExecutionScore:
    90,

  minimumAutomaticExecutionConfidence:
    0.95,

  maximumActiveRecommendationsPerEntity:
    10,

  recommendationExpirationDays:
    30,

  rules: [],

  recommendations: [],

  tags: [],

  notes: "",
};