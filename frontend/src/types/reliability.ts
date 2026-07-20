export type ReliabilityStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export type ReliabilityCategory =
  | "asset"
  | "equipment-class"
  | "functional-location"
  | "plant"
  | "failure-mode"
  | "system"
  | "fleet"
  | "process"
  | "other";

export type ReliabilityMetricType =
  | "mtbf"
  | "mttr"
  | "mttf"
  | "availability"
  | "inherent-availability"
  | "operational-availability"
  | "failure-rate"
  | "repair-rate"
  | "reliability"
  | "maintainability"
  | "downtime"
  | "uptime"
  | "failure-count"
  | "repeat-failure-rate"
  | "first-time-fix-rate"
  | "planned-maintenance-ratio"
  | "emergency-maintenance-ratio"
  | "pm-compliance"
  | "schedule-compliance"
  | "other";

export type ReliabilityTrend =
  | "improving"
  | "stable"
  | "worsening"
  | "unknown";

export type ReliabilitySeverity =
  | "normal"
  | "warning"
  | "high"
  | "critical"
  | "unknown";

export type ReliabilityEntityType =
  | "organization"
  | "plant"
  | "department"
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
  | "other";

export type ReliabilitySourceType =
  | "system"
  | "manual"
  | "failure-event"
  | "work-order"
  | "asset"
  | "sensor"
  | "inspection"
  | "erp"
  | "external-system"
  | "other";

export type ReliabilityPeriodType =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type ReliabilityFailureClassification =
  | "random"
  | "early-life"
  | "wear-out"
  | "chronic"
  | "intermittent"
  | "catastrophic"
  | "unknown";

export type ReliabilityCriticality =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ReliabilityEntityReference = {
  entityType:
    ReliabilityEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type ReliabilityMetricValue = {
  id: string;

  metricType:
    ReliabilityMetricType;

  displayName: string;

  value: number;

  unit: string;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  previousValue:
    number | null;

  targetValue:
    number | null;

  variance:
    number | null;

  variancePercent:
    number | null;

  trend:
    ReliabilityTrend;

  severity:
    ReliabilitySeverity;

  calculatedAt:
    string | null;

  notes: string;
};

export type ReliabilityFailureRecord = {
  id: string;

  failureEventId:
    string | null;

  failureModeId:
    string | null;

  failureModeCode: string;

  failureModeName: string;

  assetId: string;

  assetCode: string;

  assetName: string;

  classification:
    ReliabilityFailureClassification;

  criticality:
    ReliabilityCriticality;

  occurredAt: string;

  restoredAt:
    string | null;

  downtimeMinutes:
    number;

  repairMinutes:
    number;

  responseMinutes:
    number;

  productionLossMinutes:
    number;

  repeatFailure:
    boolean;

  repeatFailureWithinDays:
    number | null;

  rootCauseId:
    string | null;

  rootCauseDescription:
    string;

  workOrderId:
    string | null;

  responsiblePersonId:
    string | null;

  responsibleTeamId:
    string | null;

  contractorId:
    string | null;

  notes: string;
};

export type ReliabilityPeriodSummary = {
  id: string;

  periodType:
    ReliabilityPeriodType;

  periodStart: string;

  periodEnd: string;

  entityReference:
    ReliabilityEntityReference | null;

  operatingTimeMinutes:
    number;

  plannedDowntimeMinutes:
    number;

  unplannedDowntimeMinutes:
    number;

  totalDowntimeMinutes:
    number;

  uptimeMinutes:
    number;

  failureCount:
    number;

  repairCount:
    number;

  repeatFailureCount:
    number;

  emergencyWorkOrderCount:
    number;

  preventiveWorkOrderCount:
    number;

  correctiveWorkOrderCount:
    number;

  mtbfMinutes:
    number | null;

  mttrMinutes:
    number | null;

  mttfMinutes:
    number | null;

  availabilityPercent:
    number;

  reliabilityPercent:
    number;

  maintainabilityPercent:
    number;

  failureRate:
    number;

  repairRate:
    number;

  firstTimeFixRatePercent:
    number;

  pmCompliancePercent:
    number;

  scheduleCompliancePercent:
    number;

  notes: string;
};

export type ReliabilityTarget = {
  id: string;

  metricType:
    ReliabilityMetricType;

  entityReference:
    ReliabilityEntityReference | null;

  targetValue: number;

  warningThreshold:
    number | null;

  criticalThreshold:
    number | null;

  direction:
    | "higher-is-better"
    | "lower-is-better"
    | "target-range";

  minimumValue:
    number | null;

  maximumValue:
    number | null;

  validFrom:
    string | null;

  validUntil:
    string | null;

  notes: string;
};

export type ReliabilityBenchmark = {
  id: string;

  metricType:
    ReliabilityMetricType;

  benchmarkType:
    | "internal"
    | "historical"
    | "manufacturer"
    | "industry"
    | "target"
    | "other";

  displayName: string;

  value: number;

  unit: string;

  source: string;

  referenceDate:
    string | null;

  notes: string;
};

export type ReliabilityFailureModePerformance = {
  id: string;

  failureModeId: string;

  failureModeCode: string;

  failureModeName: string;

  failureCount:
    number;

  totalDowntimeMinutes:
    number;

  averageDowntimeMinutes:
    number;

  averageRepairMinutes:
    number;

  repeatFailureCount:
    number;

  repeatFailureRatePercent:
    number;

  totalCost:
    number;

  currency: string;

  riskScore:
    number;

  reliabilityImpactScore:
    number;

  rank: number;

  trend:
    ReliabilityTrend;

  notes: string;
};

export type ReliabilityAssetPerformance = {
  id: string;

  assetId: string;

  assetCode: string;

  assetName: string;

  equipmentClassId:
    string | null;

  operatingTimeMinutes:
    number;

  totalDowntimeMinutes:
    number;

  unplannedDowntimeMinutes:
    number;

  failureCount:
    number;

  repeatFailureCount:
    number;

  mtbfMinutes:
    number | null;

  mttrMinutes:
    number | null;

  availabilityPercent:
    number;

  reliabilityPercent:
    number;

  maintainabilityPercent:
    number;

  failureRate:
    number;

  firstTimeFixRatePercent:
    number;

  totalMaintenanceCost:
    number;

  currency: string;

  reliabilityScore:
    number;

  riskScore:
    number;

  trend:
    ReliabilityTrend;

  rank: number;

  notes: string;
};

export type ReliabilityRootCausePerformance = {
  id: string;

  rootCauseId:
    string | null;

  rootCauseCode: string;

  rootCauseName: string;

  occurrenceCount:
    number;

  affectedAssetCount:
    number;

  totalDowntimeMinutes:
    number;

  totalCost:
    number;

  currency: string;

  repeatFailureCount:
    number;

  impactScore:
    number;

  rank: number;

  notes: string;
};

export type ReliabilityParetoItem = {
  id: string;

  entityReference:
    ReliabilityEntityReference;

  metricType:
    | "failure-count"
    | "downtime"
    | "repair-time"
    | "cost"
    | "repeat-failure"
    | "risk";

  value: number;

  contributionPercent:
    number;

  cumulativePercent:
    number;

  rank: number;

  notes: string;
};

export type ReliabilityBadActor = {
  id: string;

  assetId: string;

  assetCode: string;

  assetName: string;

  badActorScore:
    number;

  failureCount:
    number;

  repeatFailureCount:
    number;

  downtimeMinutes:
    number;

  mtbfMinutes:
    number | null;

  mttrMinutes:
    number | null;

  maintenanceCost:
    number;

  currency: string;

  riskScore:
    number;

  trend:
    ReliabilityTrend;

  primaryFailureModeIds:
    string[];

  recommendationIds:
    string[];

  notes: string;
};

export type ReliabilityWeibullPoint = {
  id: string;

  timeValue: number;

  cumulativeFailureProbability:
    number;

  reliabilityProbability:
    number;

  notes: string;
};

export type ReliabilityWeibullAnalysis = {
  id: string;

  entityReference:
    ReliabilityEntityReference | null;

  failureModeId:
    string | null;

  beta:
    number | null;

  eta:
    number | null;

  gamma:
    number | null;

  shapeInterpretation:
    | "early-life"
    | "random"
    | "wear-out"
    | "unknown";

  sampleSize:
    number;

  confidenceScore:
    number;

  points:
    ReliabilityWeibullPoint[];

  generatedAt: string;

  notes: string;
};

export type ReliabilityRcmTask = {
  id: string;

  taskCode: string;

  displayName: string;

  description: string;

  taskType:
    | "condition-monitoring"
    | "scheduled-restoration"
    | "scheduled-discard"
    | "failure-finding"
    | "run-to-failure"
    | "redesign"
    | "inspection"
    | "lubrication"
    | "other";

  assetId:
    string | null;

  equipmentClassId:
    string | null;

  failureModeId:
    string | null;

  intervalValue:
    number | null;

  intervalUnit:
    | "hours"
    | "days"
    | "weeks"
    | "months"
    | "cycles"
    | "runtime-hours"
    | "none";

  recommended:
    boolean;

  approved:
    boolean;

  active:
    boolean;

  effectivenessScore:
    number | null;

  estimatedCost:
    number | null;

  currency: string;

  riskReductionPercent:
    number | null;

  notes: string;
};

export type ReliabilityImprovementAction = {
  id: string;

  actionCode: string;

  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  status:
    | "proposed"
    | "approved"
    | "in-progress"
    | "completed"
    | "rejected"
    | "cancelled";

  sourceType:
    | "bad-actor"
    | "pareto"
    | "rca"
    | "rcm"
    | "weibull"
    | "risk"
    | "prediction"
    | "recommendation"
    | "manual"
    | "other";

  sourceReferenceId:
    string | null;

  targetEntity:
    ReliabilityEntityReference | null;

  responsiblePersonId:
    string | null;

  responsibleTeamId:
    string | null;

  workOrderId:
    string | null;

  projectId:
    string | null;

  plannedStartAt:
    string | null;

  dueAt:
    string | null;

  completedAt:
    string | null;

  estimatedBenefit:
    string;

  estimatedCost:
    number | null;

  actualCost:
    number | null;

  currency: string;

  expectedReliabilityImprovementPercent:
    number | null;

  actualReliabilityImprovementPercent:
    number | null;

  notes: string;
};

export type ReliabilityInsight = {
  id: string;

  insightType:
    | "bad-actor"
    | "repeat-failure"
    | "mtbf-decline"
    | "mttr-increase"
    | "availability-decline"
    | "failure-trend"
    | "root-cause"
    | "maintenance-opportunity"
    | "risk"
    | "prediction"
    | "other";

  title: string;

  description: string;

  impactScore:
    number;

  confidenceScore:
    number;

  relatedEntityIds:
    string[];

  relatedFailureModeIds:
    string[];

  relatedRiskIds:
    string[];

  relatedRecommendationIds:
    string[];

  relatedPredictionIds:
    string[];

  generatedAt: string;

  notes: string;
};

export type ReliabilitySummary = {
  operatingTimeMinutes:
    number;

  totalDowntimeMinutes:
    number;

  plannedDowntimeMinutes:
    number;

  unplannedDowntimeMinutes:
    number;

  uptimeMinutes:
    number;

  failureCount:
    number;

  repeatFailureCount:
    number;

  mtbfMinutes:
    number | null;

  mttrMinutes:
    number | null;

  mttfMinutes:
    number | null;

  availabilityPercent:
    number;

  inherentAvailabilityPercent:
    number;

  operationalAvailabilityPercent:
    number;

  reliabilityPercent:
    number;

  maintainabilityPercent:
    number;

  failureRate:
    number;

  repairRate:
    number;

  firstTimeFixRatePercent:
    number;

  repeatFailureRatePercent:
    number;

  pmCompliancePercent:
    number;

  emergencyMaintenanceRatioPercent:
    number;

  plannedMaintenanceRatioPercent:
    number;

  reliabilityScore:
    number;
};

export type ReliabilityRecord = {
  id: string;

  /*
   * Identification
   */
  reliabilityNumber: string;

  reliabilityCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  category:
    ReliabilityCategory;

  status:
    ReliabilityStatus;

  active: boolean;

  criticality:
    ReliabilityCriticality;

  /*
   * Scope
   */
  primaryEntity:
    ReliabilityEntityReference | null;

  relatedEntities:
    ReliabilityEntityReference[];

  plantId:
    string | null;

  functionalLocationId:
    string | null;

  equipmentClassId:
    string | null;

  assetId:
    string | null;

  failureModeId:
    string | null;

  /*
   * Period
   */
  periodType:
    ReliabilityPeriodType;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  /*
   * Source
   */
  sourceTypes:
    ReliabilitySourceType[];

  /*
   * Metrics
   */
  metrics:
    ReliabilityMetricValue[];

  /*
   * Summary
   */
  summary:
    ReliabilitySummary;

  /*
   * Failures
   */
  failures:
    ReliabilityFailureRecord[];

  /*
   * Period history
   */
  periodSummaries:
    ReliabilityPeriodSummary[];

  /*
   * Performance
   */
  assetPerformance:
    ReliabilityAssetPerformance[];

  failureModePerformance:
    ReliabilityFailureModePerformance[];

  rootCausePerformance:
    ReliabilityRootCausePerformance[];

  /*
   * Targets
   */
  targets:
    ReliabilityTarget[];

  /*
   * Benchmarks
   */
  benchmarks:
    ReliabilityBenchmark[];

  /*
   * Pareto
   */
  paretoItems:
    ReliabilityParetoItem[];

  /*
   * Bad actors
   */
  badActors:
    ReliabilityBadActor[];

  /*
   * Weibull
   */
  weibullAnalyses:
    ReliabilityWeibullAnalysis[];

  /*
   * RCM
   */
  rcmTasks:
    ReliabilityRcmTask[];

  /*
   * Improvement
   */
  improvementActions:
    ReliabilityImprovementAction[];

  /*
   * Intelligence
   */
  insights:
    ReliabilityInsight[];

  riskIds: string[];

  recommendationIds:
    string[];

  predictionIds:
    string[];

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

export type ReliabilityEngineMetrics = {
  totalAssetCount:
    number;

  analyzedAssetCount:
    number;

  lowReliabilityAssetCount:
    number;

  badActorCount:
    number;

  totalFailureCount:
    number;

  repeatFailureCount:
    number;

  totalDowntimeMinutes:
    number;

  unplannedDowntimeMinutes:
    number;

  averageMtbfMinutes:
    number;

  averageMttrMinutes:
    number;

  averageAvailabilityPercent:
    number;

  averageReliabilityPercent:
    number;

  averageMaintainabilityPercent:
    number;

  firstTimeFixRatePercent:
    number;

  repeatFailureRatePercent:
    number;

  plannedMaintenanceRatioPercent:
    number;

  emergencyMaintenanceRatioPercent:
    number;

  pmCompliancePercent:
    number;

  openImprovementActionCount:
    number;

  completedImprovementActionCount:
    number;

  activeRcmTaskCount:
    number;

  lastAnalysisAt:
    string | null;
};

export type ReliabilityEngineProfile = {
  engineHealthScore:
    number;

  dataCoverageScore:
    number;

  failureDataQualityScore:
    number;

  assetReliabilityScore:
    number;

  availabilityScore:
    number;

  maintainabilityScore:
    number;

  badActorControlScore:
    number;

  repeatFailureControlScore:
    number;

  maintenanceStrategyScore:
    number;

  overallReliabilityScore:
    number;

  criticalAssetIds:
    string[];

  badActorAssetIds:
    string[];

  decliningMtbfAssetIds:
    string[];

  increasingMttrAssetIds:
    string[];

  repeatFailureAssetIds:
    string[];

  highImpactFailureModeIds:
    string[];

  recommendedRcmReviewAssetIds:
    string[];

  recommendedImprovementActionIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type ReliabilityEngine = {
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

  automaticCalculationEnabled:
    boolean;

  automaticBadActorDetectionEnabled:
    boolean;

  automaticParetoAnalysisEnabled:
    boolean;

  automaticRepeatFailureDetectionEnabled:
    boolean;

  automaticWeibullAnalysisEnabled:
    boolean;

  automaticRcmRecommendationEnabled:
    boolean;

  automaticRiskCreationEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  /*
   * Settings
   */
  repeatFailureWindowDays:
    number;

  badActorMinimumFailureCount:
    number;

  badActorMinimumDowntimeMinutes:
    number;

  minimumWeibullSampleSize:
    number;

  defaultPeriodType:
    ReliabilityPeriodType;

  /*
   * Records
   */
  records:
    ReliabilityRecord[];

  /*
   * Metrics
   */
  metrics:
    ReliabilityEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    ReliabilityEngineProfile;

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

export type CreateReliabilityRecordInput =
  Omit<
    ReliabilityRecord,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateReliabilityRecordInput =
  Partial<CreateReliabilityRecordInput>;

export type CreateReliabilityEngineInput =
  Omit<
    ReliabilityEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateReliabilityEngineInput =
  Partial<CreateReliabilityEngineInput>;

export type ReliabilityRepositoryResult = {
  success: boolean;

  reliabilityRecord:
    ReliabilityRecord | null;

  message: string;
};

export type ReliabilityEngineRepositoryResult = {
  success: boolean;

  reliabilityEngine:
    ReliabilityEngine | null;

  message: string;
};

export const defaultReliabilitySummary:
  ReliabilitySummary = {
  operatingTimeMinutes: 0,

  totalDowntimeMinutes: 0,

  plannedDowntimeMinutes: 0,

  unplannedDowntimeMinutes: 0,

  uptimeMinutes: 0,

  failureCount: 0,

  repeatFailureCount: 0,

  mtbfMinutes: null,

  mttrMinutes: null,

  mttfMinutes: null,

  availabilityPercent: 0,

  inherentAvailabilityPercent: 0,

  operationalAvailabilityPercent: 0,

  reliabilityPercent: 0,

  maintainabilityPercent: 0,

  failureRate: 0,

  repairRate: 0,

  firstTimeFixRatePercent: 0,

  repeatFailureRatePercent: 0,

  pmCompliancePercent: 0,

  emergencyMaintenanceRatioPercent:
    0,

  plannedMaintenanceRatioPercent:
    0,

  reliabilityScore: 0,
};

export const defaultReliabilityEngineMetrics:
  ReliabilityEngineMetrics = {
  totalAssetCount: 0,

  analyzedAssetCount: 0,

  lowReliabilityAssetCount: 0,

  badActorCount: 0,

  totalFailureCount: 0,

  repeatFailureCount: 0,

  totalDowntimeMinutes: 0,

  unplannedDowntimeMinutes: 0,

  averageMtbfMinutes: 0,

  averageMttrMinutes: 0,

  averageAvailabilityPercent: 0,

  averageReliabilityPercent: 0,

  averageMaintainabilityPercent: 0,

  firstTimeFixRatePercent: 0,

  repeatFailureRatePercent: 0,

  plannedMaintenanceRatioPercent:
    0,

  emergencyMaintenanceRatioPercent:
    0,

  pmCompliancePercent: 0,

  openImprovementActionCount: 0,

  completedImprovementActionCount:
    0,

  activeRcmTaskCount: 0,

  lastAnalysisAt: null,
};

export const defaultReliabilityEngineProfile:
  ReliabilityEngineProfile = {
  engineHealthScore: 0,

  dataCoverageScore: 0,

  failureDataQualityScore: 0,

  assetReliabilityScore: 0,

  availabilityScore: 0,

  maintainabilityScore: 0,

  badActorControlScore: 0,

  repeatFailureControlScore: 0,

  maintenanceStrategyScore: 0,

  overallReliabilityScore: 0,

  criticalAssetIds: [],

  badActorAssetIds: [],

  decliningMtbfAssetIds: [],

  increasingMttrAssetIds: [],

  repeatFailureAssetIds: [],

  highImpactFailureModeIds: [],

  recommendedRcmReviewAssetIds:
    [],

  recommendedImprovementActionIds:
    [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultReliabilityRecord:
  CreateReliabilityRecordInput = {
  reliabilityNumber: "",

  reliabilityCode: "",

  displayName: "",

  description: "",

  category: "asset",

  status: "active",

  active: true,

  criticality: "medium",

  primaryEntity: null,

  relatedEntities: [],

  plantId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  failureModeId: null,

  periodType: "monthly",

  periodStart: null,

  periodEnd: null,

  sourceTypes: [
    "system",
  ],

  metrics: [],

  summary:
    defaultReliabilitySummary,

  failures: [],

  periodSummaries: [],

  assetPerformance: [],

  failureModePerformance: [],

  rootCausePerformance: [],

  targets: [],

  benchmarks: [],

  paretoItems: [],

  badActors: [],

  weibullAnalyses: [],

  rcmTasks: [],

  improvementActions: [],

  insights: [],

  riskIds: [],

  recommendationIds: [],

  predictionIds: [],

  tags: [],

  notes: "",
};

export const defaultReliabilityEngine:
  CreateReliabilityEngineInput = {
  engineCode: "RELIABILITY",

  displayName:
    "Maintenance Reliability Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticCalculationEnabled:
    true,

  automaticBadActorDetectionEnabled:
    true,

  automaticParetoAnalysisEnabled:
    true,

  automaticRepeatFailureDetectionEnabled:
    true,

  automaticWeibullAnalysisEnabled:
    false,

  automaticRcmRecommendationEnabled:
    true,

  automaticRiskCreationEnabled:
    false,

  automaticRecommendationEnabled:
    true,

  repeatFailureWindowDays: 30,

  badActorMinimumFailureCount: 3,

  badActorMinimumDowntimeMinutes:
    60,

  minimumWeibullSampleSize: 10,

  defaultPeriodType: "monthly",

  records: [],

  tags: [],

  notes: "",
};