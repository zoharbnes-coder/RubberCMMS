export type RiskStatus =
  | "identified"
  | "assessed"
  | "open"
  | "monitored"
  | "mitigated"
  | "accepted"
  | "closed"
  | "expired";

export type RiskCategory =
  | "safety"
  | "reliability"
  | "availability"
  | "maintenance"
  | "asset"
  | "failure"
  | "inventory"
  | "spare-part"
  | "supplier"
  | "contractor"
  | "people"
  | "skill"
  | "certification"
  | "cost"
  | "energy"
  | "quality"
  | "environment"
  | "production"
  | "compliance"
  | "cyber"
  | "project"
  | "other";

export type RiskSeverity =
  | "negligible"
  | "minor"
  | "moderate"
  | "major"
  | "critical"
  | "catastrophic";

export type RiskLikelihood =
  | "rare"
  | "unlikely"
  | "possible"
  | "likely"
  | "very-likely"
  | "almost-certain";

export type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "extreme";

export type RiskTrend =
  | "improving"
  | "stable"
  | "worsening"
  | "unknown";

export type RiskSourceType =
  | "manual"
  | "failure-event"
  | "work-order"
  | "asset"
  | "inspection"
  | "sensor"
  | "inventory"
  | "contractor"
  | "supplier"
  | "document"
  | "knowledge-graph"
  | "mie"
  | "prediction"
  | "audit"
  | "incident"
  | "other";

export type RiskEntityType =
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
  | "project"
  | "other";

export type RiskControlType =
  | "eliminate"
  | "substitute"
  | "engineering"
  | "administrative"
  | "inspection"
  | "preventive-maintenance"
  | "predictive-maintenance"
  | "spare-part"
  | "training"
  | "certification"
  | "procedure"
  | "ppe"
  | "monitoring"
  | "redundancy"
  | "contingency"
  | "insurance"
  | "acceptance"
  | "other";

export type RiskControlStatus =
  | "planned"
  | "approved"
  | "in-progress"
  | "implemented"
  | "verified"
  | "ineffective"
  | "cancelled";

export type RiskActionStatus =
  | "open"
  | "assigned"
  | "in-progress"
  | "completed"
  | "overdue"
  | "cancelled";

export type RiskReviewStatus =
  | "scheduled"
  | "completed"
  | "overdue"
  | "cancelled";

export type RiskTriggerType =
  | "threshold"
  | "repeat-failure"
  | "critical-failure"
  | "downtime"
  | "cost"
  | "stockout"
  | "low-stock"
  | "overdue-work-order"
  | "inspection-failure"
  | "certification-expiration"
  | "skill-gap"
  | "contractor-performance"
  | "supplier-performance"
  | "sensor-anomaly"
  | "manual"
  | "other";

export type RiskResponseStrategy =
  | "avoid"
  | "reduce"
  | "transfer"
  | "accept"
  | "monitor";

export type RiskEntityReference = {
  entityType:
    RiskEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type RiskScoreComponent = {
  id: string;

  name: string;

  description: string;

  score: number;

  weight: number;

  weightedScore: number;

  sourceType:
    RiskSourceType;

  confidenceScore: number;

  notes: string;
};

export type RiskAssessment = {
  id: string;

  assessmentNumber: string;

  assessedAt: string;

  assessedByPersonId:
    string | null;

  assessedByName: string;

  severity:
    RiskSeverity;

  likelihood:
    RiskLikelihood;

  severityScore: number;

  likelihoodScore: number;

  detectabilityScore:
    number | null;

  exposureScore:
    number | null;

  consequenceScore:
    number | null;

  baseRiskScore: number;

  calculatedRiskScore: number;

  riskLevel:
    RiskLevel;

  confidenceScore: number;

  scoreComponents:
    RiskScoreComponent[];

  assumptions: string[];

  notes: string;
};

export type RiskControl = {
  id: string;

  controlCode: string;

  displayName: string;

  description: string;

  controlType:
    RiskControlType;

  status:
    RiskControlStatus;

  effectivenessScore:
    number | null;

  targetRiskReductionPercent:
    number | null;

  actualRiskReductionPercent:
    number | null;

  ownerPersonId:
    string | null;

  ownerName: string;

  responsibleTeamId:
    string | null;

  responsibleTeamName: string;

  contractorId: string | null;

  workOrderId: string | null;

  documentId: string | null;

  sparePartId: string | null;

  plannedStartAt:
    string | null;

  plannedCompletionAt:
    string | null;

  completedAt: string | null;

  verificationRequired:
    boolean;

  verified: boolean;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  notes: string;
};

export type RiskAction = {
  id: string;

  actionNumber: string;

  title: string;

  description: string;

  status:
    RiskActionStatus;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  ownerPersonId:
    string | null;

  ownerName: string;

  assignedTeamId:
    string | null;

  assignedTeamName: string;

  contractorId: string | null;

  plannedStartAt:
    string | null;

  dueAt: string | null;

  startedAt: string | null;

  completedAt: string | null;

  workOrderId: string | null;

  maintenanceRequestId:
    string | null;

  documentIds: string[];

  completionPercent: number;

  result: string;

  notes: string;
};

export type RiskTrigger = {
  id: string;

  triggerType:
    RiskTriggerType;

  displayName: string;

  description: string;

  active: boolean;

  field: string;

  operator:
    | "equals"
    | "not-equals"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "contains"
    | "exists"
    | "not-exists";

  thresholdValue:
    string | number | boolean | null;

  triggered: boolean;

  triggeredAt: string | null;

  sourceEntity:
    RiskEntityReference | null;

  notes: string;
};

export type RiskIndicator = {
  id: string;

  indicatorCode: string;

  displayName: string;

  description: string;

  currentValue: number;

  unit: string;

  warningThreshold:
    number | null;

  criticalThreshold:
    number | null;

  targetValue:
    number | null;

  trend:
    RiskTrend;

  updatedAt: string;

  notes: string;
};

export type RiskReview = {
  id: string;

  reviewNumber: string;

  status:
    RiskReviewStatus;

  scheduledAt: string;

  completedAt: string | null;

  reviewedByPersonId:
    string | null;

  reviewedByName: string;

  previousRiskScore: number;

  currentRiskScore: number;

  previousRiskLevel:
    RiskLevel;

  currentRiskLevel:
    RiskLevel;

  controlsEffective:
    boolean | null;

  newControlsRequired:
    boolean;

  newActionsRequired:
    boolean;

  reviewSummary: string;

  notes: string;
};

export type RiskHistoricalEvent = {
  id: string;

  eventType:
    | "assessment"
    | "control-added"
    | "control-updated"
    | "action-added"
    | "action-completed"
    | "risk-increased"
    | "risk-decreased"
    | "review"
    | "accepted"
    | "closed"
    | "reopened"
    | "other";

  occurredAt: string;

  personId: string | null;

  personName: string;

  previousRiskScore:
    number | null;

  newRiskScore:
    number | null;

  previousRiskLevel:
    RiskLevel | null;

  newRiskLevel:
    RiskLevel | null;

  description: string;

  notes: string;
};

export type RiskRecommendation = {
  id: string;

  recommendationCode: string;

  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  recommendedControlType:
    RiskControlType | null;

  recommendedActionType:
    string;

  expectedRiskReductionPercent:
    number | null;

  estimatedCost:
    number | null;

  currency: string;

  estimatedImplementationDays:
    number | null;

  confidenceScore: number;

  requiresApproval: boolean;

  approved: boolean | null;

  generatedBy:
    | "rule"
    | "mie"
    | "knowledge-graph"
    | "prediction"
    | "manual"
    | "other";

  generatedAt: string;

  notes: string;
};

export type RiskOutcome = {
  riskAvoided: boolean | null;

  failureOccurred:
    boolean | null;

  safetyIncidentOccurred:
    boolean;

  productionLossOccurred:
    boolean;

  qualityIssueOccurred:
    boolean;

  financialImpact:
    number | null;

  currency: string;

  downtimeMinutes:
    number | null;

  actualImpactDescription:
    string;

  controlsWorked:
    boolean | null;

  lessonsLearned: string;

  recordedAt: string | null;
};

export type Risk = {
  id: string;

  /*
   * Identification
   */
  riskNumber: string;

  riskCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  category:
    RiskCategory;

  status:
    RiskStatus;

  currentLevel:
    RiskLevel;

  trend:
    RiskTrend;

  active: boolean;

  /*
   * Context
   */
  primaryEntity:
    RiskEntityReference | null;

  relatedEntities:
    RiskEntityReference[];

  plantId: string | null;

  functionalLocationId:
    string | null;

  equipmentClassId:
    string | null;

  assetId: string | null;

  failureModeId: string | null;

  failureEventId: string | null;

  workOrderId: string | null;

  /*
   * Source
   */
  sourceType:
    RiskSourceType;

  sourceReferenceId:
    string | null;

  /*
   * Assessment
   */
  assessments:
    RiskAssessment[];

  currentAssessment:
    RiskAssessment | null;

  /*
   * Response
   */
  responseStrategy:
    RiskResponseStrategy;

  riskOwnerPersonId:
    string | null;

  riskOwnerName: string;

  responsibleTeamId:
    string | null;

  responsibleTeamName: string;

  /*
   * Controls
   */
  controls:
    RiskControl[];

  /*
   * Actions
   */
  actions:
    RiskAction[];

  /*
   * Triggers
   */
  triggers:
    RiskTrigger[];

  /*
   * Indicators
   */
  indicators:
    RiskIndicator[];

  /*
   * Reviews
   */
  reviews:
    RiskReview[];

  nextReviewAt:
    string | null;

  reviewIntervalDays:
    number | null;

  /*
   * Residual risk
   */
  residualSeverity:
    RiskSeverity | null;

  residualLikelihood:
    RiskLikelihood | null;

  residualRiskScore:
    number | null;

  residualRiskLevel:
    RiskLevel | null;

  /*
   * Acceptance
   */
  acceptanceRequired:
    boolean;

  accepted: boolean;

  acceptedAt: string | null;

  acceptedByPersonId:
    string | null;

  acceptedByName: string;

  acceptanceReason: string;

  acceptanceExpiresAt:
    string | null;

  /*
   * Recommendations
   */
  recommendations:
    RiskRecommendation[];

  /*
   * History
   */
  historicalEvents:
    RiskHistoricalEvent[];

  /*
   * Outcome
   */
  outcome:
    RiskOutcome | null;

  /*
   * Intelligence
   */
  confidenceScore: number;

  predictedRiskScore:
    number | null;

  predictedRiskLevel:
    RiskLevel | null;

  predictedRiskAt:
    string | null;

  knowledgeGraphNodeIds:
    string[];

  knowledgeGraphEdgeIds:
    string[];

  mieDecisionIds: string[];

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

export type RiskRule = {
  id: string;

  ruleCode: string;

  displayName: string;

  description: string;

  category:
    RiskCategory;

  active: boolean;

  priority: number;

  entityType:
    RiskEntityType | null;

  triggerType:
    RiskTriggerType;

  conditions:
    RiskTrigger[];

  defaultSeverity:
    RiskSeverity;

  defaultLikelihood:
    RiskLikelihood;

  defaultResponseStrategy:
    RiskResponseStrategy;

  automaticRiskCreation:
    boolean;

  automaticNotification:
    boolean;

  automaticEscalation:
    boolean;

  createdAt: string;

  updatedAt: string;

  lastExecutedAt:
    string | null;
};

export type RiskEngineMetrics = {
  totalRiskCount: number;

  openRiskCount: number;

  lowRiskCount: number;

  mediumRiskCount: number;

  highRiskCount: number;

  criticalRiskCount: number;

  extremeRiskCount: number;

  mitigatedRiskCount: number;

  acceptedRiskCount: number;

  overdueActionCount: number;

  overdueReviewCount: number;

  activeTriggerCount: number;

  triggeredRiskCount: number;

  averageRiskScore: number;

  averageResidualRiskScore:
    number;

  riskReductionPercent:
    number;

  controlEffectivenessPercent:
    number;

  highRiskAssetCount: number;

  highRiskFailureModeCount:
    number;

  highRiskSparePartCount:
    number;

  highRiskContractorCount:
    number;

  predictedHighRiskCount:
    number;

  lastRiskCreatedAt:
    string | null;

  lastRiskAssessmentAt:
    string | null;
};

export type RiskEngineProfile = {
  engineHealthScore: number;

  riskCoverageScore: number;

  detectionAccuracyScore:
    number;

  predictionAccuracyScore:
    number;

  mitigationEffectivenessScore:
    number;

  controlEffectivenessScore:
    number;

  riskClosureScore: number;

  overallRiskManagementScore:
    number;

  highestRiskEntityIds:
    string[];

  risingRiskIds: string[];

  overdueMitigationRiskIds:
    string[];

  weakControlRiskIds:
    string[];

  predictedCriticalRiskIds:
    string[];

  recommendedReviewRiskIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type RiskEngine = {
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

  automaticDetectionEnabled:
    boolean;

  automaticAssessmentEnabled:
    boolean;

  automaticPredictionEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  automaticRiskCreationEnabled:
    boolean;

  minimumRiskScoreForAlert:
    number;

  minimumRiskScoreForEscalation:
    number;

  predictionHorizonDays:
    number;

  /*
   * Rules
   */
  rules:
    RiskRule[];

  /*
   * Risks
   */
  risks:
    Risk[];

  /*
   * Metrics
   */
  metrics:
    RiskEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    RiskEngineProfile;

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

export type CreateRiskInput =
  Omit<
    Risk,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateRiskInput =
  Partial<CreateRiskInput>;

export type CreateRiskEngineInput =
  Omit<
    RiskEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateRiskEngineInput =
  Partial<CreateRiskEngineInput>;

export type RiskRepositoryResult = {
  success: boolean;

  risk: Risk | null;

  message: string;
};

export type RiskEngineRepositoryResult = {
  success: boolean;

  riskEngine:
    RiskEngine | null;

  message: string;
};

export const defaultRiskEngineMetrics:
  RiskEngineMetrics = {
  totalRiskCount: 0,

  openRiskCount: 0,

  lowRiskCount: 0,

  mediumRiskCount: 0,

  highRiskCount: 0,

  criticalRiskCount: 0,

  extremeRiskCount: 0,

  mitigatedRiskCount: 0,

  acceptedRiskCount: 0,

  overdueActionCount: 0,

  overdueReviewCount: 0,

  activeTriggerCount: 0,

  triggeredRiskCount: 0,

  averageRiskScore: 0,

  averageResidualRiskScore: 0,

  riskReductionPercent: 0,

  controlEffectivenessPercent: 0,

  highRiskAssetCount: 0,

  highRiskFailureModeCount: 0,

  highRiskSparePartCount: 0,

  highRiskContractorCount: 0,

  predictedHighRiskCount: 0,

  lastRiskCreatedAt: null,

  lastRiskAssessmentAt: null,
};

export const defaultRiskEngineProfile:
  RiskEngineProfile = {
  engineHealthScore: 0,

  riskCoverageScore: 0,

  detectionAccuracyScore: 0,

  predictionAccuracyScore: 0,

  mitigationEffectivenessScore: 0,

  controlEffectivenessScore: 0,

  riskClosureScore: 0,

  overallRiskManagementScore: 0,

  highestRiskEntityIds: [],

  risingRiskIds: [],

  overdueMitigationRiskIds: [],

  weakControlRiskIds: [],

  predictedCriticalRiskIds: [],

  recommendedReviewRiskIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultRisk:
  CreateRiskInput = {
  riskNumber: "",

  riskCode: "",

  displayName: "",

  description: "",

  category: "maintenance",

  status: "identified",

  currentLevel: "medium",

  trend: "unknown",

  active: true,

  primaryEntity: null,

  relatedEntities: [],

  plantId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  failureModeId: null,

  failureEventId: null,

  workOrderId: null,

  sourceType: "manual",

  sourceReferenceId: null,

  assessments: [],

  currentAssessment: null,

  responseStrategy: "monitor",

  riskOwnerPersonId: null,

  riskOwnerName: "",

  responsibleTeamId: null,

  responsibleTeamName: "",

  controls: [],

  actions: [],

  triggers: [],

  indicators: [],

  reviews: [],

  nextReviewAt: null,

  reviewIntervalDays: null,

  residualSeverity: null,

  residualLikelihood: null,

  residualRiskScore: null,

  residualRiskLevel: null,

  acceptanceRequired: false,

  accepted: false,

  acceptedAt: null,

  acceptedByPersonId: null,

  acceptedByName: "",

  acceptanceReason: "",

  acceptanceExpiresAt: null,

  recommendations: [],

  historicalEvents: [],

  outcome: null,

  confidenceScore: 0,

  predictedRiskScore: null,

  predictedRiskLevel: null,

  predictedRiskAt: null,

  knowledgeGraphNodeIds: [],

  knowledgeGraphEdgeIds: [],

  mieDecisionIds: [],

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",
};

export const defaultRiskEngine:
  CreateRiskEngineInput = {
  engineCode: "RISK",

  displayName:
    "Maintenance Risk Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticDetectionEnabled:
    true,

  automaticAssessmentEnabled:
    true,

  automaticPredictionEnabled:
    true,

  automaticRecommendationEnabled:
    true,

  automaticRiskCreationEnabled:
    false,

  minimumRiskScoreForAlert:
    50,

  minimumRiskScoreForEscalation:
    75,

  predictionHorizonDays: 30,

  rules: [],

  risks: [],

  tags: [],

  notes: "",
};