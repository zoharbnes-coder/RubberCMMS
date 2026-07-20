export type DashboardStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type DashboardType =
  | "management"
  | "maintenance"
  | "reliability"
  | "operations"
  | "energy"
  | "cost"
  | "inventory"
  | "risk"
  | "team"
  | "asset"
  | "plant"
  | "tv"
  | "mobile"
  | "custom";

export type DashboardVisibility =
  | "private"
  | "team"
  | "plant"
  | "organization"
  | "public";

export type DashboardRefreshMode =
  | "manual"
  | "automatic"
  | "real-time";

export type DashboardLayoutType =
  | "grid"
  | "free"
  | "list"
  | "cards"
  | "full-screen";

export type DashboardWidgetType =
  | "kpi"
  | "metric"
  | "number"
  | "gauge"
  | "progress"
  | "trend"
  | "line-chart"
  | "bar-chart"
  | "pie-chart"
  | "donut-chart"
  | "area-chart"
  | "table"
  | "list"
  | "timeline"
  | "heatmap"
  | "pareto"
  | "status"
  | "traffic-light"
  | "map"
  | "asset-card"
  | "work-order-list"
  | "failure-list"
  | "risk-list"
  | "recommendation-list"
  | "prediction-list"
  | "inventory-list"
  | "energy"
  | "cost"
  | "reliability"
  | "text"
  | "image"
  | "other";

export type DashboardWidgetStatus =
  | "active"
  | "inactive"
  | "hidden"
  | "error";

export type DashboardDataSourceType =
  | "kpi"
  | "asset"
  | "failure-event"
  | "failure-mode"
  | "maintenance-request"
  | "work-order"
  | "person"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "document"
  | "risk"
  | "recommendation"
  | "prediction"
  | "cost"
  | "reliability"
  | "energy"
  | "iot"
  | "erp"
  | "manual"
  | "custom";

export type DashboardEntityType =
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
  | "recommendation"
  | "prediction"
  | "project"
  | "other";

export type DashboardPeriodType =
  | "real-time"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "last-quarter"
  | "this-year"
  | "last-year"
  | "custom";

export type DashboardWidgetSize =
  | "small"
  | "medium"
  | "large"
  | "wide"
  | "full-width";

export type DashboardSeverity =
  | "normal"
  | "info"
  | "warning"
  | "high"
  | "critical"
  | "unknown";

export type DashboardTrend =
  | "up"
  | "down"
  | "stable"
  | "unknown";

export type DashboardEntityReference = {
  entityType:
    DashboardEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type DashboardFilter = {
  id: string;

  field: string;

  displayName: string;

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

  active: boolean;

  userEditable: boolean;

  notes: string;
};

export type DashboardDataSource = {
  id: string;

  sourceType:
    DashboardDataSourceType;

  sourceId: string | null;

  sourceCode: string;

  displayName: string;

  query: string;

  entityReference:
    DashboardEntityReference | null;

  aggregationType:
    | "none"
    | "sum"
    | "average"
    | "minimum"
    | "maximum"
    | "count"
    | "distinct-count"
    | "ratio"
    | "custom";

  valueField: string;

  categoryField: string;

  timestampField: string;

  unit: string;

  filters:
    DashboardFilter[];

  refreshIntervalSeconds:
    number | null;

  cacheEnabled: boolean;

  cacheDurationSeconds:
    number;

  active: boolean;

  notes: string;
};

export type DashboardWidgetPosition = {
  row: number;

  column: number;

  width: number;

  height: number;

  size:
    DashboardWidgetSize;

  order: number;
};

export type DashboardWidgetThreshold = {
  id: string;

  thresholdType:
    | "minimum"
    | "maximum"
    | "warning"
    | "critical"
    | "target";

  value: number;

  secondaryValue:
    number | null;

  severity:
    DashboardSeverity;

  label: string;

  active: boolean;

  notes: string;
};

export type DashboardWidgetMetric = {
  currentValue:
    number | null;

  previousValue:
    number | null;

  targetValue:
    number | null;

  unit: string;

  variance:
    number | null;

  variancePercent:
    number | null;

  achievementPercent:
    number | null;

  trend:
    DashboardTrend;

  severity:
    DashboardSeverity;

  updatedAt:
    string | null;
};

export type DashboardWidgetAction = {
  id: string;

  actionType:
    | "navigate"
    | "open-entity"
    | "open-report"
    | "open-work-order"
    | "open-asset"
    | "open-risk"
    | "open-recommendation"
    | "open-prediction"
    | "refresh"
    | "export"
    | "custom";

  displayName: string;

  targetUrl: string;

  targetEntity:
    DashboardEntityReference | null;

  iconName: string;

  active: boolean;

  requiredRoleIds: string[];

  notes: string;
};

export type DashboardWidget = {
  id: string;

  /*
   * Identification
   */
  widgetCode: string;

  displayName: string;

  title: string;

  description: string;

  /*
   * Classification
   */
  widgetType:
    DashboardWidgetType;

  status:
    DashboardWidgetStatus;

  active: boolean;

  /*
   * Data
   */
  dataSource:
    DashboardDataSource | null;

  secondaryDataSource:
    DashboardDataSource | null;

  /*
   * Display
   */
  position:
    DashboardWidgetPosition;

  showTitle: boolean;

  showDescription: boolean;

  showLegend: boolean;

  showTarget: boolean;

  showTrend: boolean;

  showTimestamp: boolean;

  showValues: boolean;

  maximumItems:
    number | null;

  decimalPlaces: number;

  unit: string;

  /*
   * Metric
   */
  metric:
    DashboardWidgetMetric | null;

  /*
   * Thresholds
   */
  thresholds:
    DashboardWidgetThreshold[];

  /*
   * Filters
   */
  filters:
    DashboardFilter[];

  /*
   * Actions
   */
  actions:
    DashboardWidgetAction[];

  /*
   * Refresh
   */
  refreshMode:
    DashboardRefreshMode;

  refreshIntervalSeconds:
    number;

  lastRefreshedAt:
    string | null;

  /*
   * Drill down
   */
  drillDownEnabled:
    boolean;

  drillDownDashboardId:
    string | null;

  drillDownEntityType:
    DashboardEntityType | null;

  /*
   * General
   */
  tags: string[];

  notes: string;
};

export type DashboardSection = {
  id: string;

  sectionCode: string;

  displayName: string;

  description: string;

  order: number;

  active: boolean;

  collapsible: boolean;

  collapsedByDefault:
    boolean;

  widgetIds: string[];

  notes: string;
};

export type DashboardRoleAccess = {
  id: string;

  roleId: string;

  roleName: string;

  canView: boolean;

  canEdit: boolean;

  canConfigure: boolean;

  canShare: boolean;

  canExport: boolean;

  notes: string;
};

export type DashboardPersonAccess = {
  id: string;

  personId: string;

  personName: string;

  canView: boolean;

  canEdit: boolean;

  canConfigure: boolean;

  canShare: boolean;

  canExport: boolean;

  notes: string;
};

export type DashboardTeamAccess = {
  id: string;

  teamId: string;

  teamName: string;

  canView: boolean;

  canEdit: boolean;

  canConfigure: boolean;

  canShare: boolean;

  canExport: boolean;

  notes: string;
};

export type DashboardTvMode = {
  enabled: boolean;

  fullScreen: boolean;

  autoRotateEnabled:
    boolean;

  rotationIntervalSeconds:
    number;

  dashboardIds:
    string[];

  hideNavigation: boolean;

  hideFilters: boolean;

  autoRefreshEnabled:
    boolean;

  refreshIntervalSeconds:
    number;

  showClock: boolean;

  showLastRefreshTime:
    boolean;

  notes: string;
};

export type DashboardExportConfiguration = {
  pdfEnabled: boolean;

  excelEnabled: boolean;

  imageEnabled: boolean;

  csvEnabled: boolean;

  includeFilters: boolean;

  includeTimestamp: boolean;

  includeCompanyLogo:
    boolean;

  orientation:
    | "portrait"
    | "landscape";

  notes: string;
};

export type DashboardAlert = {
  id: string;

  alertCode: string;

  displayName: string;

  description: string;

  severity:
    DashboardSeverity;

  widgetId:
    string | null;

  entityReference:
    DashboardEntityReference | null;

  value:
    number | null;

  thresholdValue:
    number | null;

  active: boolean;

  triggeredAt: string;

  acknowledgedAt:
    string | null;

  acknowledgedByPersonId:
    string | null;

  acknowledgedByName: string;

  resolvedAt:
    string | null;

  riskId:
    string | null;

  recommendationId:
    string | null;

  notes: string;
};

export type DashboardInsight = {
  id: string;

  insightType:
    | "trend"
    | "anomaly"
    | "risk"
    | "opportunity"
    | "performance"
    | "cost"
    | "reliability"
    | "energy"
    | "inventory"
    | "other";

  title: string;

  description: string;

  impactScore: number;

  confidenceScore: number;

  entityReference:
    DashboardEntityReference | null;

  relatedWidgetIds:
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

export type DashboardSnapshotWidget = {
  widgetId: string;

  widgetName: string;

  value:
    number | string | null;

  unit: string;

  severity:
    DashboardSeverity;

  trend:
    DashboardTrend;

  capturedAt: string;
};

export type DashboardSnapshot = {
  id: string;

  snapshotCode: string;

  dashboardId: string;

  dashboardName: string;

  capturedAt: string;

  periodType:
    DashboardPeriodType;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  entityReference:
    DashboardEntityReference | null;

  widgetSnapshots:
    DashboardSnapshotWidget[];

  capturedByPersonId:
    string | null;

  capturedByName: string;

  notes: string;
};

export type DashboardUsageMetrics = {
  viewCount: number;

  uniqueViewerCount: number;

  exportCount: number;

  widgetClickCount: number;

  drillDownCount: number;

  filterUsageCount: number;

  tvDisplayCount: number;

  mobileViewCount: number;

  desktopViewCount: number;

  averageSessionDurationSeconds:
    number;

  lastViewedAt:
    string | null;

  lastExportedAt:
    string | null;
};

export type DashboardPerformanceMetrics = {
  totalDashboardCount:
    number;

  activeDashboardCount:
    number;

  totalWidgetCount:
    number;

  activeWidgetCount:
    number;

  errorWidgetCount:
    number;

  activeAlertCount:
    number;

  criticalAlertCount:
    number;

  generatedInsightCount:
    number;

  averageWidgetRefreshTimeMs:
    number;

  averageDashboardLoadTimeMs:
    number;

  dataFreshnessScore:
    number;

  dashboardAvailabilityPercent:
    number;

  lastDashboardRefreshAt:
    string | null;
};

export type DashboardEngineProfile = {
  engineHealthScore: number;

  dashboardCoverageScore:
    number;

  widgetHealthScore: number;

  dataFreshnessScore: number;

  performanceScore: number;

  userAdoptionScore: number;

  managementVisibilityScore:
    number;

  mobileCoverageScore:
    number;

  tvCoverageScore: number;

  overallDashboardScore:
    number;

  lowUsageDashboardIds:
    string[];

  highErrorWidgetIds:
    string[];

  staleWidgetIds: string[];

  missingDashboardEntityIds:
    string[];

  recommendedWidgetIds:
    string[];

  recommendedDashboardIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type Dashboard = {
  id: string;

  /*
   * Identification
   */
  dashboardNumber: string;

  dashboardCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  dashboardType:
    DashboardType;

  status:
    DashboardStatus;

  active: boolean;

  visibility:
    DashboardVisibility;

  layoutType:
    DashboardLayoutType;

  /*
   * Scope
   */
  primaryEntity:
    DashboardEntityReference | null;

  plantId:
    string | null;

  departmentId:
    string | null;

  functionalLocationId:
    string | null;

  equipmentClassId:
    string | null;

  assetId:
    string | null;

  /*
   * Period
   */
  defaultPeriodType:
    DashboardPeriodType;

  customPeriodStart:
    string | null;

  customPeriodEnd:
    string | null;

  /*
   * Widgets
   */
  widgets:
    DashboardWidget[];

  /*
   * Sections
   */
  sections:
    DashboardSection[];

  /*
   * Filters
   */
  globalFilters:
    DashboardFilter[];

  filtersVisible: boolean;

  /*
   * Refresh
   */
  refreshMode:
    DashboardRefreshMode;

  refreshIntervalSeconds:
    number;

  autoRefreshEnabled:
    boolean;

  lastRefreshedAt:
    string | null;

  /*
   * Access
   */
  roleAccess:
    DashboardRoleAccess[];

  personAccess:
    DashboardPersonAccess[];

  teamAccess:
    DashboardTeamAccess[];

  /*
   * TV
   */
  tvMode:
    DashboardTvMode;

  /*
   * Export
   */
  exportConfiguration:
    DashboardExportConfiguration;

  /*
   * Alerts
   */
  alerts:
    DashboardAlert[];

  /*
   * Intelligence
   */
  insights:
    DashboardInsight[];

  riskIds: string[];

  recommendationIds:
    string[];

  predictionIds:
    string[];

  /*
   * Snapshots
   */
  snapshots:
    DashboardSnapshot[];

  /*
   * Usage
   */
  usageMetrics:
    DashboardUsageMetrics;

  /*
   * General
   */
  defaultDashboard:
    boolean;

  favorite: boolean;

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

export type DashboardEngine = {
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

  automaticRefreshEnabled:
    boolean;

  automaticAlertEnabled:
    boolean;

  automaticInsightGenerationEnabled:
    boolean;

  automaticSnapshotEnabled:
    boolean;

  defaultRefreshIntervalSeconds:
    number;

  defaultPeriodType:
    DashboardPeriodType;

  maximumWidgetsPerDashboard:
    number;

  /*
   * Dashboards
   */
  dashboards:
    Dashboard[];

  /*
   * Metrics
   */
  metrics:
    DashboardPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    DashboardEngineProfile;

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

export type CreateDashboardInput =
  Omit<
    Dashboard,
    | "id"
    | "usageMetrics"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateDashboardInput =
  Partial<CreateDashboardInput>;

export type CreateDashboardEngineInput =
  Omit<
    DashboardEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateDashboardEngineInput =
  Partial<CreateDashboardEngineInput>;

export type DashboardRepositoryResult = {
  success: boolean;

  dashboard:
    Dashboard | null;

  message: string;
};

export type DashboardEngineRepositoryResult = {
  success: boolean;

  dashboardEngine:
    DashboardEngine | null;

  message: string;
};

export const defaultDashboardWidgetPosition:
  DashboardWidgetPosition = {
  row: 0,

  column: 0,

  width: 1,

  height: 1,

  size: "medium",

  order: 0,
};

export const defaultDashboardWidgetMetric:
  DashboardWidgetMetric = {
  currentValue: null,

  previousValue: null,

  targetValue: null,

  unit: "",

  variance: null,

  variancePercent: null,

  achievementPercent: null,

  trend: "unknown",

  severity: "unknown",

  updatedAt: null,
};

export const defaultDashboardTvMode:
  DashboardTvMode = {
  enabled: false,

  fullScreen: true,

  autoRotateEnabled: false,

  rotationIntervalSeconds: 30,

  dashboardIds: [],

  hideNavigation: true,

  hideFilters: true,

  autoRefreshEnabled: true,

  refreshIntervalSeconds: 60,

  showClock: true,

  showLastRefreshTime: true,

  notes: "",
};

export const defaultDashboardExportConfiguration:
  DashboardExportConfiguration = {
  pdfEnabled: true,

  excelEnabled: true,

  imageEnabled: true,

  csvEnabled: true,

  includeFilters: true,

  includeTimestamp: true,

  includeCompanyLogo: true,

  orientation: "landscape",

  notes: "",
};

export const defaultDashboardUsageMetrics:
  DashboardUsageMetrics = {
  viewCount: 0,

  uniqueViewerCount: 0,

  exportCount: 0,

  widgetClickCount: 0,

  drillDownCount: 0,

  filterUsageCount: 0,

  tvDisplayCount: 0,

  mobileViewCount: 0,

  desktopViewCount: 0,

  averageSessionDurationSeconds:
    0,

  lastViewedAt: null,

  lastExportedAt: null,
};

export const defaultDashboardPerformanceMetrics:
  DashboardPerformanceMetrics = {
  totalDashboardCount: 0,

  activeDashboardCount: 0,

  totalWidgetCount: 0,

  activeWidgetCount: 0,

  errorWidgetCount: 0,

  activeAlertCount: 0,

  criticalAlertCount: 0,

  generatedInsightCount: 0,

  averageWidgetRefreshTimeMs: 0,

  averageDashboardLoadTimeMs: 0,

  dataFreshnessScore: 0,

  dashboardAvailabilityPercent: 0,

  lastDashboardRefreshAt: null,
};

export const defaultDashboardEngineProfile:
  DashboardEngineProfile = {
  engineHealthScore: 0,

  dashboardCoverageScore: 0,

  widgetHealthScore: 0,

  dataFreshnessScore: 0,

  performanceScore: 0,

  userAdoptionScore: 0,

  managementVisibilityScore: 0,

  mobileCoverageScore: 0,

  tvCoverageScore: 0,

  overallDashboardScore: 0,

  lowUsageDashboardIds: [],

  highErrorWidgetIds: [],

  staleWidgetIds: [],

  missingDashboardEntityIds: [],

  recommendedWidgetIds: [],

  recommendedDashboardIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultDashboard:
  CreateDashboardInput = {
  dashboardNumber: "",

  dashboardCode: "",

  displayName: "",

  shortName: "",

  description: "",

  dashboardType:
    "maintenance",

  status: "draft",

  active: true,

  visibility: "plant",

  layoutType: "grid",

  primaryEntity: null,

  plantId: null,

  departmentId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  defaultPeriodType:
    "this-month",

  customPeriodStart: null,

  customPeriodEnd: null,

  widgets: [],

  sections: [],

  globalFilters: [],

  filtersVisible: true,

  refreshMode: "automatic",

  refreshIntervalSeconds: 60,

  autoRefreshEnabled: true,

  lastRefreshedAt: null,

  roleAccess: [],

  personAccess: [],

  teamAccess: [],

  tvMode:
    defaultDashboardTvMode,

  exportConfiguration:
    defaultDashboardExportConfiguration,

  alerts: [],

  insights: [],

  riskIds: [],

  recommendationIds: [],

  predictionIds: [],

  snapshots: [],

  defaultDashboard: false,

  favorite: false,

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",
};

export const defaultDashboardEngine:
  CreateDashboardEngineInput = {
  engineCode: "DASHBOARD",

  displayName:
    "Enterprise Dashboard Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticRefreshEnabled:
    true,

  automaticAlertEnabled:
    true,

  automaticInsightGenerationEnabled:
    true,

  automaticSnapshotEnabled:
    false,

  defaultRefreshIntervalSeconds:
    60,

  defaultPeriodType:
    "this-month",

  maximumWidgetsPerDashboard:
    30,

  dashboards: [],

  tags: [],

  notes: "",
};