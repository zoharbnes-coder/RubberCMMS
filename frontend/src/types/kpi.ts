export type KpiStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export type KpiCategory =
  | "availability"
  | "reliability"
  | "maintainability"
  | "downtime"
  | "work-order"
  | "maintenance"
  | "preventive-maintenance"
  | "corrective-maintenance"
  | "predictive-maintenance"
  | "inspection"
  | "labor"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "cost"
  | "energy"
  | "safety"
  | "quality"
  | "risk"
  | "asset"
  | "failure"
  | "sla"
  | "productivity"
  | "other";

export type KpiValueType =
  | "number"
  | "percent"
  | "duration"
  | "currency"
  | "count"
  | "ratio"
  | "rate"
  | "score";

export type KpiAggregationType =
  | "sum"
  | "average"
  | "minimum"
  | "maximum"
  | "count"
  | "distinct-count"
  | "median"
  | "ratio"
  | "custom";

export type KpiPeriodType =
  | "real-time"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type KpiTrend =
  | "improving"
  | "stable"
  | "worsening"
  | "unknown";

export type KpiDirection =
  | "higher-is-better"
  | "lower-is-better"
  | "target-range"
  | "neutral";

export type KpiSeverity =
  | "normal"
  | "warning"
  | "critical"
  | "unknown";

export type KpiEntityType =
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
  | "inventory"
  | "risk"
  | "energy-meter"
  | "project"
  | "other";

export type KpiSourceType =
  | "manual"
  | "system"
  | "calculated"
  | "work-order"
  | "failure-event"
  | "asset"
  | "inventory"
  | "sensor"
  | "erp"
  | "energy"
  | "risk-engine"
  | "predictive-engine"
  | "recommendation-engine"
  | "external-system"
  | "other";

export type KpiBenchmarkType =
  | "internal"
  | "historical"
  | "target"
  | "industry"
  | "manufacturer"
  | "regulatory"
  | "other";

export type KpiEntityReference = {
  entityType:
    KpiEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type KpiTarget = {
  id: string;

  targetCode: string;

  displayName: string;

  targetValue:
    number;

  minimumAcceptableValue:
    number | null;

  maximumAcceptableValue:
    number | null;

  warningThreshold:
    number | null;

  criticalThreshold:
    number | null;

  validFrom:
    string | null;

  validUntil:
    string | null;

  entityReference:
    KpiEntityReference | null;

  notes: string;
};

export type KpiBenchmark = {
  id: string;

  benchmarkType:
    KpiBenchmarkType;

  displayName: string;

  description: string;

  benchmarkValue:
    number;

  source: string;

  sourceUrl: string;

  referenceDate:
    string | null;

  notes: string;
};

export type KpiDataPoint = {
  id: string;

  timestamp: string;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  value: number;

  previousValue:
    number | null;

  targetValue:
    number | null;

  varianceFromTarget:
    number | null;

  variancePercent:
    number | null;

  trend:
    KpiTrend;

  severity:
    KpiSeverity;

  entityReference:
    KpiEntityReference | null;

  sourceType:
    KpiSourceType;

  sourceReferenceId:
    string | null;

  calculatedAt:
    string | null;

  notes: string;
};

export type KpiFormulaComponent = {
  id: string;

  componentCode: string;

  displayName: string;

  description: string;

  sourceField: string;

  sourceEntityType:
    KpiEntityType | null;

  aggregationType:
    KpiAggregationType;

  multiplier: number;

  divisor: number;

  defaultValue:
    number | null;

  required: boolean;

  notes: string;
};

export type KpiFormula = {
  id: string;

  formulaCode: string;

  displayName: string;

  description: string;

  expression: string;

  components:
    KpiFormulaComponent[];

  resultUnit: string;

  resultValueType:
    KpiValueType;

  roundingDecimals: number;

  minimumValue:
    number | null;

  maximumValue:
    number | null;

  notes: string;
};

export type KpiFilter = {
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
    | "in"
    | "not-in"
    | "exists"
    | "not-exists"
    | "between";

  value:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];

  secondaryValue:
    | string
    | number
    | null;

  notes: string;
};

export type KpiScope = {
  id: string;

  entityType:
    KpiEntityType;

  entityIds:
    string[];

  includeChildren:
    boolean;

  includeInactive:
    boolean;

  filters:
    KpiFilter[];

  notes: string;
};

export type KpiAlertRule = {
  id: string;

  alertCode: string;

  displayName: string;

  description: string;

  active: boolean;

  condition:
    | "below-target"
    | "above-target"
    | "below-threshold"
    | "above-threshold"
    | "outside-range"
    | "negative-trend"
    | "positive-trend"
    | "custom";

  thresholdValue:
    number | null;

  secondaryThresholdValue:
    number | null;

  severity:
    | "info"
    | "warning"
    | "high"
    | "critical";

  consecutivePeriods:
    number;

  notifyPersonIds:
    string[];

  notifyTeamIds:
    string[];

  createRisk:
    boolean;

  createRecommendation:
    boolean;

  activeAlert:
    boolean;

  lastTriggeredAt:
    string | null;

  notes: string;
};

export type KpiPerformanceSummary = {
  currentValue: number;

  previousValue:
    number | null;

  targetValue:
    number | null;

  bestValue:
    number | null;

  worstValue:
    number | null;

  averageValue:
    number | null;

  medianValue:
    number | null;

  varianceFromTarget:
    number | null;

  variancePercent:
    number | null;

  achievementPercent:
    number | null;

  trend:
    KpiTrend;

  severity:
    KpiSeverity;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  lastCalculatedAt:
    string | null;
};

export type KpiComparison = {
  id: string;

  comparisonType:
    | "previous-period"
    | "previous-year"
    | "target"
    | "benchmark"
    | "plant"
    | "department"
    | "asset"
    | "team"
    | "contractor"
    | "other";

  displayName: string;

  currentValue: number;

  comparisonValue: number;

  variance: number;

  variancePercent:
    number | null;

  favorable:
    boolean | null;

  notes: string;
};

export type KpiContribution = {
  id: string;

  entityReference:
    KpiEntityReference;

  contributionValue: number;

  contributionPercent:
    number;

  rank: number;

  impact:
    | "positive"
    | "negative"
    | "neutral";

  notes: string;
};

export type KpiInsight = {
  id: string;

  insightType:
    | "positive"
    | "negative"
    | "warning"
    | "opportunity"
    | "risk"
    | "anomaly"
    | "trend"
    | "other";

  title: string;

  description: string;

  impactScore: number;

  confidenceScore: number;

  relatedEntityIds:
    string[];

  relatedRiskIds:
    string[];

  relatedRecommendationIds:
    string[];

  generatedAt: string;

  notes: string;
};

export type Kpi = {
  id: string;

  /*
   * Identification
   */
  kpiNumber: string;

  kpiCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  category:
    KpiCategory;

  status:
    KpiStatus;

  active: boolean;

  /*
   * Value
   */
  valueType:
    KpiValueType;

  unit: string;

  direction:
    KpiDirection;

  /*
   * Calculation
   */
  aggregationType:
    KpiAggregationType;

  formula:
    KpiFormula | null;

  sourceTypes:
    KpiSourceType[];

  /*
   * Time
   */
  periodType:
    KpiPeriodType;

  calculationFrequencyMinutes:
    number | null;

  rollingPeriodCount:
    number | null;

  /*
   * Scope
   */
  scope:
    KpiScope;

  /*
   * Targets
   */
  targets:
    KpiTarget[];

  /*
   * Benchmarks
   */
  benchmarks:
    KpiBenchmark[];

  /*
   * Data
   */
  dataPoints:
    KpiDataPoint[];

  /*
   * Current performance
   */
  performanceSummary:
    KpiPerformanceSummary;

  /*
   * Comparison
   */
  comparisons:
    KpiComparison[];

  /*
   * Contribution analysis
   */
  contributions:
    KpiContribution[];

  /*
   * Alerts
   */
  alertRules:
    KpiAlertRule[];

  /*
   * Intelligence
   */
  insights:
    KpiInsight[];

  riskIds: string[];

  recommendationIds:
    string[];

  predictionIds: string[];

  /*
   * Presentation
   */
  dashboardEnabled:
    boolean;

  dashboardOrder: number;

  showTrend:
    boolean;

  showTarget:
    boolean;

  showBenchmark:
    boolean;

  showComparison:
    boolean;

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

export type KpiDashboardSection = {
  id: string;

  sectionCode: string;

  displayName: string;

  description: string;

  order: number;

  kpiIds: string[];

  visible: boolean;

  notes: string;
};

export type KpiDashboard = {
  id: string;

  dashboardCode: string;

  displayName: string;

  description: string;

  entityReference:
    KpiEntityReference | null;

  periodType:
    KpiPeriodType;

  sections:
    KpiDashboardSection[];

  defaultKpiIds:
    string[];

  refreshIntervalSeconds:
    number;

  autoRefreshEnabled:
    boolean;

  fullScreenEnabled:
    boolean;

  active: boolean;

  tags: string[];

  notes: string;

  createdAt: string;

  updatedAt: string;
};

export type KpiEngineMetrics = {
  totalKpiCount: number;

  activeKpiCount: number;

  warningKpiCount: number;

  criticalKpiCount: number;

  targetAchievedCount:
    number;

  targetMissedCount: number;

  improvingKpiCount: number;

  worseningKpiCount: number;

  staleKpiCount: number;

  averageTargetAchievementPercent:
    number;

  activeAlertCount: number;

  generatedRiskCount: number;

  generatedRecommendationCount:
    number;

  lastCalculationAt:
    string | null;
};

export type KpiEngineProfile = {
  engineHealthScore: number;

  dataCoverageScore: number;

  dataFreshnessScore: number;

  targetCoverageScore: number;

  calculationSuccessScore:
    number;

  dashboardCoverageScore:
    number;

  overallPerformanceScore:
    number;

  criticalKpiIds: string[];

  worseningKpiIds: string[];

  staleKpiIds: string[];

  missingTargetKpiIds:
    string[];

  recommendedKpiIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type KpiEngine = {
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

  automaticAlertEnabled:
    boolean;

  automaticRiskCreationEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  defaultCalculationIntervalMinutes:
    number;

  /*
   * KPI definitions
   */
  kpis:
    Kpi[];

  /*
   * Dashboards
   */
  dashboards:
    KpiDashboard[];

  /*
   * Metrics
   */
  metrics:
    KpiEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    KpiEngineProfile;

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

export type CreateKpiInput =
  Omit<
    Kpi,
    | "id"
    | "performanceSummary"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateKpiInput =
  Partial<CreateKpiInput>;

export type CreateKpiDashboardInput =
  Omit<
    KpiDashboard,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateKpiDashboardInput =
  Partial<CreateKpiDashboardInput>;

export type CreateKpiEngineInput =
  Omit<
    KpiEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateKpiEngineInput =
  Partial<CreateKpiEngineInput>;

export type KpiRepositoryResult = {
  success: boolean;

  kpi: Kpi | null;

  message: string;
};

export type KpiEngineRepositoryResult = {
  success: boolean;

  kpiEngine:
    KpiEngine | null;

  message: string;
};

export const defaultKpiScope:
  KpiScope = {
  id: "",

  entityType: "plant",

  entityIds: [],

  includeChildren: true,

  includeInactive: false,

  filters: [],

  notes: "",
};

export const defaultKpiPerformanceSummary:
  KpiPerformanceSummary = {
  currentValue: 0,

  previousValue: null,

  targetValue: null,

  bestValue: null,

  worstValue: null,

  averageValue: null,

  medianValue: null,

  varianceFromTarget: null,

  variancePercent: null,

  achievementPercent: null,

  trend: "unknown",

  severity: "unknown",

  periodStart: null,

  periodEnd: null,

  lastCalculatedAt: null,
};

export const defaultKpiEngineMetrics:
  KpiEngineMetrics = {
  totalKpiCount: 0,

  activeKpiCount: 0,

  warningKpiCount: 0,

  criticalKpiCount: 0,

  targetAchievedCount: 0,

  targetMissedCount: 0,

  improvingKpiCount: 0,

  worseningKpiCount: 0,

  staleKpiCount: 0,

  averageTargetAchievementPercent:
    0,

  activeAlertCount: 0,

  generatedRiskCount: 0,

  generatedRecommendationCount: 0,

  lastCalculationAt: null,
};

export const defaultKpiEngineProfile:
  KpiEngineProfile = {
  engineHealthScore: 0,

  dataCoverageScore: 0,

  dataFreshnessScore: 0,

  targetCoverageScore: 0,

  calculationSuccessScore: 0,

  dashboardCoverageScore: 0,

  overallPerformanceScore: 0,

  criticalKpiIds: [],

  worseningKpiIds: [],

  staleKpiIds: [],

  missingTargetKpiIds: [],

  recommendedKpiIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultKpi:
  CreateKpiInput = {
  kpiNumber: "",

  kpiCode: "",

  displayName: "",

  shortName: "",

  description: "",

  category: "maintenance",

  status: "active",

  active: true,

  valueType: "number",

  unit: "",

  direction: "neutral",

  aggregationType: "average",

  formula: null,

  sourceTypes: [
    "system",
  ],

  periodType: "monthly",

  calculationFrequencyMinutes:
    null,

  rollingPeriodCount: null,

  scope:
    defaultKpiScope,

  targets: [],

  benchmarks: [],

  dataPoints: [],

  comparisons: [],

  contributions: [],

  alertRules: [],

  insights: [],

  riskIds: [],

  recommendationIds: [],

  predictionIds: [],

  dashboardEnabled: true,

  dashboardOrder: 0,

  showTrend: true,

  showTarget: true,

  showBenchmark: false,

  showComparison: true,

  tags: [],

  notes: "",
};

export const defaultKpiDashboard:
  CreateKpiDashboardInput = {
  dashboardCode: "",

  displayName: "",

  description: "",

  entityReference: null,

  periodType: "monthly",

  sections: [],

  defaultKpiIds: [],

  refreshIntervalSeconds: 60,

  autoRefreshEnabled: true,

  fullScreenEnabled: true,

  active: true,

  tags: [],

  notes: "",
};

export const defaultKpiEngine:
  CreateKpiEngineInput = {
  engineCode: "KPI",

  displayName:
    "Maintenance KPI Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticCalculationEnabled:
    true,

  automaticAlertEnabled:
    true,

  automaticRiskCreationEnabled:
    false,

  automaticRecommendationEnabled:
    true,

  defaultCalculationIntervalMinutes:
    60,

  kpis: [],

  dashboards: [],

  tags: [],

  notes: "",
};