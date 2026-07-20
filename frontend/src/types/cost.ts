export type CostStatus =
  | "draft"
  | "active"
  | "closed"
  | "cancelled"
  | "archived";

export type CostCategory =
  | "labor"
  | "spare-part"
  | "contractor"
  | "material"
  | "downtime"
  | "energy"
  | "tooling"
  | "transport"
  | "rental"
  | "service"
  | "inspection"
  | "calibration"
  | "training"
  | "project"
  | "overhead"
  | "other";

export type CostType =
  | "actual"
  | "estimated"
  | "planned"
  | "forecast"
  | "budget"
  | "standard";

export type CostSourceType =
  | "manual"
  | "work-order"
  | "maintenance-request"
  | "failure-event"
  | "asset"
  | "spare-part"
  | "inventory"
  | "contractor"
  | "supplier"
  | "purchase-order"
  | "energy"
  | "erp"
  | "project"
  | "external-system"
  | "other";

export type CostEntityType =
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
  | "supplier"
  | "spare-part"
  | "inventory"
  | "project"
  | "other";

export type CostAllocationMethod =
  | "direct"
  | "manual"
  | "equal"
  | "percentage"
  | "labor-hours"
  | "machine-hours"
  | "downtime"
  | "usage"
  | "quantity"
  | "custom";

export type CostPeriodType =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type CostTrend =
  | "improving"
  | "stable"
  | "worsening"
  | "unknown";

export type CostEntityReference = {
  entityType: CostEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type CostLine = {
  id: string;

  lineNumber: number;

  category: CostCategory;

  costType: CostType;

  description: string;

  quantity: number;

  unitOfMeasure: string;

  unitCost: number;

  totalCost: number;

  currency: string;

  sourceType: CostSourceType;

  sourceReferenceId: string | null;

  entityReference:
    CostEntityReference | null;

  costCenter: string;

  glAccount: string;

  incurredAt: string | null;

  postedAt: string | null;

  notes: string;
};

export type CostAllocation = {
  id: string;

  method: CostAllocationMethod;

  targetEntity:
    CostEntityReference;

  allocationPercent: number;

  allocatedAmount: number;

  currency: string;

  basisValue:
    number | null;

  basisUnit: string;

  notes: string;
};

export type CostBudget = {
  id: string;

  budgetCode: string;

  displayName: string;

  description: string;

  entityReference:
    CostEntityReference | null;

  category:
    CostCategory | null;

  periodType:
    CostPeriodType;

  periodStart: string;

  periodEnd: string;

  budgetAmount: number;

  committedAmount: number;

  actualAmount: number;

  forecastAmount: number;

  remainingAmount: number;

  varianceAmount: number;

  variancePercent:
    number | null;

  currency: string;

  warningThresholdPercent:
    number | null;

  criticalThresholdPercent:
    number | null;

  active: boolean;

  notes: string;
};

export type CostForecast = {
  id: string;

  forecastCode: string;

  displayName: string;

  entityReference:
    CostEntityReference | null;

  category:
    CostCategory | null;

  forecastStart: string;

  forecastEnd: string;

  forecastAmount: number;

  confidenceScore: number;

  sourceType:
    | "manual"
    | "historical"
    | "trend"
    | "predictive-engine"
    | "mie"
    | "other";

  predictionIds: string[];

  assumptions: string[];

  currency: string;

  createdAt: string;

  notes: string;
};

export type CostDowntimeProfile = {
  enabled: boolean;

  costPerMinute:
    number;

  costPerHour:
    number;

  currency: string;

  includeLostProduction:
    boolean;

  includeLabor:
    boolean;

  includeEnergy:
    boolean;

  includeScrap:
    boolean;

  includeRestartLoss:
    boolean;

  lostProductionRatePerHour:
    number | null;

  averageProductValuePerUnit:
    number | null;

  estimatedDowntimeMinutes:
    number | null;

  calculatedDowntimeCost:
    number;

  notes: string;
};

export type CostLaborProfile = {
  regularLaborHours: number;

  overtimeLaborHours: number;

  contractorLaborHours: number;

  regularHourlyRate: number;

  overtimeHourlyRate: number;

  contractorHourlyRate:
    number;

  regularLaborCost: number;

  overtimeLaborCost: number;

  contractorLaborCost: number;

  totalLaborCost: number;

  currency: string;

  notes: string;
};

export type CostSparePartProfile = {
  sparePartCost: number;

  consumableCost: number;

  repairedPartCost: number;

  emergencyPurchaseCost:
    number;

  freightCost: number;

  totalSparePartCost: number;

  currency: string;

  sparePartIds: string[];

  inventoryTransactionIds:
    string[];

  notes: string;
};

export type CostContractorProfile = {
  serviceCost: number;

  calloutCost: number;

  travelCost: number;

  overtimeCost: number;

  materialCost: number;

  otherCost: number;

  totalContractorCost:
    number;

  currency: string;

  contractorIds: string[];

  notes: string;
};

export type CostEnergyProfile = {
  electricityCost: number;

  gasCost: number;

  steamCost: number;

  waterCost: number;

  compressedAirCost:
    number;

  otherEnergyCost: number;

  totalEnergyCost: number;

  currency: string;

  energyConsumptionKwh:
    number | null;

  notes: string;
};

export type CostSummary = {
  laborCost: number;

  sparePartCost: number;

  contractorCost: number;

  materialCost: number;

  downtimeCost: number;

  energyCost: number;

  toolingCost: number;

  transportCost: number;

  rentalCost: number;

  serviceCost: number;

  inspectionCost: number;

  calibrationCost: number;

  trainingCost: number;

  projectCost: number;

  overheadCost: number;

  otherCost: number;

  directCost: number;

  indirectCost: number;

  totalCost: number;

  currency: string;
};

export type CostPeriodSummary = {
  id: string;

  periodType:
    CostPeriodType;

  periodStart: string;

  periodEnd: string;

  entityReference:
    CostEntityReference | null;

  totalCost: number;

  previousPeriodCost:
    number | null;

  budgetAmount:
    number | null;

  forecastAmount:
    number | null;

  varianceFromPrevious:
    number | null;

  varianceFromPreviousPercent:
    number | null;

  varianceFromBudget:
    number | null;

  varianceFromBudgetPercent:
    number | null;

  trend: CostTrend;

  currency: string;

  notes: string;
};

export type CostDriver = {
  id: string;

  driverType:
    | "asset"
    | "failure-mode"
    | "failure-event"
    | "work-order"
    | "spare-part"
    | "contractor"
    | "labor"
    | "downtime"
    | "energy"
    | "other";

  entityReference:
    CostEntityReference | null;

  displayName: string;

  costAmount: number;

  contributionPercent:
    number;

  rank: number;

  trend: CostTrend;

  notes: string;
};

export type CostVariance = {
  id: string;

  varianceType:
    | "budget"
    | "forecast"
    | "previous-period"
    | "standard"
    | "estimate";

  expectedAmount: number;

  actualAmount: number;

  varianceAmount: number;

  variancePercent:
    number | null;

  favorable:
    boolean | null;

  reason: string;

  notes: string;
};

export type CostInsight = {
  id: string;

  insightType:
    | "saving"
    | "overrun"
    | "trend"
    | "anomaly"
    | "opportunity"
    | "risk"
    | "forecast"
    | "other";

  title: string;

  description: string;

  impactAmount:
    number | null;

  currency: string;

  impactScore: number;

  confidenceScore: number;

  relatedEntityIds:
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

export type CostRecord = {
  id: string;

  /*
   * Identification
   */
  costNumber: string;

  costCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  status: CostStatus;

  costType: CostType;

  category:
    CostCategory;

  sourceType:
    CostSourceType;

  /*
   * Context
   */
  primaryEntity:
    CostEntityReference | null;

  relatedEntities:
    CostEntityReference[];

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

  projectId: string | null;

  /*
   * Cost lines
   */
  lines:
    CostLine[];

  /*
   * Allocation
   */
  allocations:
    CostAllocation[];

  /*
   * Profiles
   */
  laborProfile:
    CostLaborProfile;

  sparePartProfile:
    CostSparePartProfile;

  contractorProfile:
    CostContractorProfile;

  downtimeProfile:
    CostDowntimeProfile;

  energyProfile:
    CostEnergyProfile;

  /*
   * Summary
   */
  summary:
    CostSummary;

  /*
   * Budget and forecast
   */
  budgetId: string | null;

  forecastId: string | null;

  /*
   * Variance
   */
  variances:
    CostVariance[];

  /*
   * Intelligence
   */
  insights:
    CostInsight[];

  riskIds: string[];

  recommendationIds:
    string[];

  predictionIds: string[];

  /*
   * Time
   */
  periodStart:
    string | null;

  periodEnd:
    string | null;

  incurredAt:
    string | null;

  closedAt:
    string | null;

  /*
   * General
   */
  currency: string;

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

export type CostEngineMetrics = {
  totalCost: number;

  totalActualCost: number;

  totalEstimatedCost: number;

  totalPlannedCost: number;

  totalForecastCost: number;

  totalBudget: number;

  totalVarianceFromBudget:
    number;

  laborCost: number;

  sparePartCost: number;

  contractorCost: number;

  downtimeCost: number;

  energyCost: number;

  otherCost: number;

  maintenanceCostPerAsset:
    number;

  maintenanceCostPerWorkOrder:
    number;

  maintenanceCostPerFailure:
    number;

  maintenanceCostAsPercentOfAssetValue:
    number;

  budgetUtilizationPercent:
    number;

  forecastAccuracyPercent:
    number;

  costReductionPercent:
    number;

  highCostAssetCount: number;

  highCostFailureModeCount:
    number;

  highCostWorkOrderCount:
    number;

  budgetOverrunCount: number;

  activeCostAlertCount:
    number;

  lastCostUpdateAt:
    string | null;
};

export type CostEngineProfile = {
  engineHealthScore: number;

  costDataCoverageScore:
    number;

  budgetControlScore: number;

  forecastAccuracyScore:
    number;

  costEfficiencyScore: number;

  downtimeCostScore: number;

  sparePartCostScore: number;

  contractorCostScore: number;

  laborCostScore: number;

  overallCostPerformanceScore:
    number;

  highestCostAssetIds:
    string[];

  highestCostFailureModeIds:
    string[];

  highestCostWorkOrderIds:
    string[];

  budgetOverrunEntityIds:
    string[];

  unusualCostEntityIds:
    string[];

  recommendedCostReductionEntityIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type CostEngine = {
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

  defaultCurrency: string;

  automaticCostCalculationEnabled:
    boolean;

  automaticDowntimeCostEnabled:
    boolean;

  automaticBudgetMonitoringEnabled:
    boolean;

  automaticForecastEnabled:
    boolean;

  automaticAlertEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  /*
   * Records
   */
  costRecords:
    CostRecord[];

  /*
   * Budgets
   */
  budgets:
    CostBudget[];

  /*
   * Forecasts
   */
  forecasts:
    CostForecast[];

  /*
   * Period summaries
   */
  periodSummaries:
    CostPeriodSummary[];

  /*
   * Cost drivers
   */
  costDrivers:
    CostDriver[];

  /*
   * Metrics
   */
  metrics:
    CostEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    CostEngineProfile;

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

export type CreateCostRecordInput =
  Omit<
    CostRecord,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateCostRecordInput =
  Partial<CreateCostRecordInput>;

export type CreateCostEngineInput =
  Omit<
    CostEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateCostEngineInput =
  Partial<CreateCostEngineInput>;

export type CostRepositoryResult = {
  success: boolean;

  costRecord:
    CostRecord | null;

  message: string;
};

export type CostEngineRepositoryResult = {
  success: boolean;

  costEngine:
    CostEngine | null;

  message: string;
};

export const defaultCostLaborProfile:
  CostLaborProfile = {
  regularLaborHours: 0,

  overtimeLaborHours: 0,

  contractorLaborHours: 0,

  regularHourlyRate: 0,

  overtimeHourlyRate: 0,

  contractorHourlyRate: 0,

  regularLaborCost: 0,

  overtimeLaborCost: 0,

  contractorLaborCost: 0,

  totalLaborCost: 0,

  currency: "ILS",

  notes: "",
};

export const defaultCostSparePartProfile:
  CostSparePartProfile = {
  sparePartCost: 0,

  consumableCost: 0,

  repairedPartCost: 0,

  emergencyPurchaseCost: 0,

  freightCost: 0,

  totalSparePartCost: 0,

  currency: "ILS",

  sparePartIds: [],

  inventoryTransactionIds: [],

  notes: "",
};

export const defaultCostContractorProfile:
  CostContractorProfile = {
  serviceCost: 0,

  calloutCost: 0,

  travelCost: 0,

  overtimeCost: 0,

  materialCost: 0,

  otherCost: 0,

  totalContractorCost: 0,

  currency: "ILS",

  contractorIds: [],

  notes: "",
};

export const defaultCostDowntimeProfile:
  CostDowntimeProfile = {
  enabled: false,

  costPerMinute: 0,

  costPerHour: 0,

  currency: "ILS",

  includeLostProduction: true,

  includeLabor: false,

  includeEnergy: false,

  includeScrap: false,

  includeRestartLoss: false,

  lostProductionRatePerHour:
    null,

  averageProductValuePerUnit:
    null,

  estimatedDowntimeMinutes:
    null,

  calculatedDowntimeCost: 0,

  notes: "",
};

export const defaultCostEnergyProfile:
  CostEnergyProfile = {
  electricityCost: 0,

  gasCost: 0,

  steamCost: 0,

  waterCost: 0,

  compressedAirCost: 0,

  otherEnergyCost: 0,

  totalEnergyCost: 0,

  currency: "ILS",

  energyConsumptionKwh: null,

  notes: "",
};

export const defaultCostSummary:
  CostSummary = {
  laborCost: 0,

  sparePartCost: 0,

  contractorCost: 0,

  materialCost: 0,

  downtimeCost: 0,

  energyCost: 0,

  toolingCost: 0,

  transportCost: 0,

  rentalCost: 0,

  serviceCost: 0,

  inspectionCost: 0,

  calibrationCost: 0,

  trainingCost: 0,

  projectCost: 0,

  overheadCost: 0,

  otherCost: 0,

  directCost: 0,

  indirectCost: 0,

  totalCost: 0,

  currency: "ILS",
};

export const defaultCostEngineMetrics:
  CostEngineMetrics = {
  totalCost: 0,

  totalActualCost: 0,

  totalEstimatedCost: 0,

  totalPlannedCost: 0,

  totalForecastCost: 0,

  totalBudget: 0,

  totalVarianceFromBudget: 0,

  laborCost: 0,

  sparePartCost: 0,

  contractorCost: 0,

  downtimeCost: 0,

  energyCost: 0,

  otherCost: 0,

  maintenanceCostPerAsset: 0,

  maintenanceCostPerWorkOrder: 0,

  maintenanceCostPerFailure: 0,

  maintenanceCostAsPercentOfAssetValue:
    0,

  budgetUtilizationPercent: 0,

  forecastAccuracyPercent: 0,

  costReductionPercent: 0,

  highCostAssetCount: 0,

  highCostFailureModeCount: 0,

  highCostWorkOrderCount: 0,

  budgetOverrunCount: 0,

  activeCostAlertCount: 0,

  lastCostUpdateAt: null,
};

export const defaultCostEngineProfile:
  CostEngineProfile = {
  engineHealthScore: 0,

  costDataCoverageScore: 0,

  budgetControlScore: 0,

  forecastAccuracyScore: 0,

  costEfficiencyScore: 0,

  downtimeCostScore: 0,

  sparePartCostScore: 0,

  contractorCostScore: 0,

  laborCostScore: 0,

  overallCostPerformanceScore: 0,

  highestCostAssetIds: [],

  highestCostFailureModeIds: [],

  highestCostWorkOrderIds: [],

  budgetOverrunEntityIds: [],

  unusualCostEntityIds: [],

  recommendedCostReductionEntityIds:
    [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultCostRecord:
  CreateCostRecordInput = {
  costNumber: "",

  costCode: "",

  displayName: "",

  description: "",

  status: "draft",

  costType: "actual",

  category: "labor",

  sourceType: "manual",

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

  projectId: null,

  lines: [],

  allocations: [],

  laborProfile:
    defaultCostLaborProfile,

  sparePartProfile:
    defaultCostSparePartProfile,

  contractorProfile:
    defaultCostContractorProfile,

  downtimeProfile:
    defaultCostDowntimeProfile,

  energyProfile:
    defaultCostEnergyProfile,

  summary:
    defaultCostSummary,

  budgetId: null,

  forecastId: null,

  variances: [],

  insights: [],

  riskIds: [],

  recommendationIds: [],

  predictionIds: [],

  periodStart: null,

  periodEnd: null,

  incurredAt: null,

  closedAt: null,

  currency: "ILS",

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",
};

export const defaultCostEngine:
  CreateCostEngineInput = {
  engineCode: "COST",

  displayName:
    "Maintenance Cost Engine",

  description: "",

  version: "1.0.0",

  active: true,

  defaultCurrency: "ILS",

  automaticCostCalculationEnabled:
    true,

  automaticDowntimeCostEnabled:
    false,

  automaticBudgetMonitoringEnabled:
    true,

  automaticForecastEnabled:
    true,

  automaticAlertEnabled:
    true,

  automaticRecommendationEnabled:
    true,

  costRecords: [],

  budgets: [],

  forecasts: [],

  periodSummaries: [],

  costDrivers: [],

  tags: [],

  notes: "",
};