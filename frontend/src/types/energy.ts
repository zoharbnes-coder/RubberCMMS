export type EnergyStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export type EnergyType =
  | "electricity"
  | "natural-gas"
  | "diesel"
  | "fuel-oil"
  | "steam"
  | "water"
  | "compressed-air"
  | "chilled-water"
  | "hot-water"
  | "solar"
  | "renewable"
  | "other";

export type EnergyMeterType =
  | "main"
  | "sub-meter"
  | "virtual"
  | "calculated"
  | "portable"
  | "other";

export type EnergySourceType =
  | "meter"
  | "manual"
  | "erp"
  | "scada"
  | "bms"
  | "plc"
  | "iot"
  | "utility-bill"
  | "calculated"
  | "external-system"
  | "other";

export type EnergyPeriodType =
  | "real-time"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type EnergyTrend =
  | "improving"
  | "stable"
  | "worsening"
  | "unknown";

export type EnergySeverity =
  | "normal"
  | "warning"
  | "high"
  | "critical"
  | "unknown";

export type EnergyEntityType =
  | "organization"
  | "plant"
  | "department"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "production-line"
  | "process"
  | "utility-system"
  | "project"
  | "other";

export type EnergyTariffType =
  | "flat"
  | "time-of-use"
  | "peak-demand"
  | "tiered"
  | "contract"
  | "other";

export type EnergyBenchmarkType =
  | "historical"
  | "target"
  | "internal"
  | "industry"
  | "manufacturer"
  | "regulatory"
  | "other";

export type EnergyEntityReference = {
  entityType:
    EnergyEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type EnergyMeter = {
  id: string;

  meterCode: string;

  displayName: string;

  description: string;

  energyType:
    EnergyType;

  meterType:
    EnergyMeterType;

  sourceType:
    EnergySourceType;

  entityReference:
    EnergyEntityReference | null;

  plantId: string | null;

  functionalLocationId:
    string | null;

  assetId: string | null;

  unit: string;

  multiplier: number;

  active: boolean;

  cumulative: boolean;

  resettable: boolean;

  communicationProtocol: string;

  deviceAddress: string;

  serialNumber: string;

  manufacturer: string;

  model: string;

  installationDate:
    string | null;

  calibrationRequired:
    boolean;

  lastCalibrationDate:
    string | null;

  nextCalibrationDate:
    string | null;

  notes: string;
};

export type EnergyReading = {
  id: string;

  meterId: string;

  energyType:
    EnergyType;

  timestamp: string;

  value: number;

  unit: string;

  normalizedValue:
    number | null;

  normalizedUnit: string;

  sourceType:
    EnergySourceType;

  qualityScore: number;

  estimated: boolean;

  validated: boolean;

  notes: string;
};

export type EnergyTariffPeriod = {
  id: string;

  periodCode: string;

  displayName: string;

  startTime: string;

  endTime: string;

  daysOfWeek: number[];

  unitRate: number;

  demandRate:
    number | null;

  currency: string;

  active: boolean;

  notes: string;
};

export type EnergyTariff = {
  id: string;

  tariffCode: string;

  displayName: string;

  description: string;

  energyType:
    EnergyType;

  tariffType:
    EnergyTariffType;

  supplierName: string;

  validFrom:
    string | null;

  validUntil:
    string | null;

  baseUnitRate:
    number;

  demandCharge:
    number | null;

  fixedMonthlyCharge:
    number | null;

  currency: string;

  periods:
    EnergyTariffPeriod[];

  taxesPercent:
    number;

  additionalFees:
    number;

  active: boolean;

  notes: string;
};

export type EnergyConsumptionRecord = {
  id: string;

  entityReference:
    EnergyEntityReference | null;

  meterId:
    string | null;

  energyType:
    EnergyType;

  periodType:
    EnergyPeriodType;

  periodStart: string;

  periodEnd: string;

  openingReading:
    number | null;

  closingReading:
    number | null;

  consumption: number;

  unit: string;

  normalizedConsumption:
    number | null;

  normalizedUnit: string;

  productionQuantity:
    number | null;

  productionUnit: string;

  consumptionPerProductionUnit:
    number | null;

  operatingHours:
    number | null;

  consumptionPerOperatingHour:
    number | null;

  calculatedCost: number;

  currency: string;

  tariffId:
    string | null;

  peakDemand:
    number | null;

  peakDemandUnit: string;

  notes: string;
};

export type EnergyTarget = {
  id: string;

  targetCode: string;

  displayName: string;

  energyType:
    EnergyType;

  entityReference:
    EnergyEntityReference | null;

  periodType:
    EnergyPeriodType;

  targetConsumption:
    number | null;

  targetCost:
    number | null;

  targetConsumptionPerProductionUnit:
    number | null;

  targetDemand:
    number | null;

  unit: string;

  currency: string;

  warningThresholdPercent:
    number | null;

  criticalThresholdPercent:
    number | null;

  validFrom:
    string | null;

  validUntil:
    string | null;

  notes: string;
};

export type EnergyBenchmark = {
  id: string;

  benchmarkType:
    EnergyBenchmarkType;

  displayName: string;

  description: string;

  energyType:
    EnergyType;

  entityReference:
    EnergyEntityReference | null;

  value: number;

  unit: string;

  source: string;

  referenceDate:
    string | null;

  notes: string;
};

export type EnergyCostSummary = {
  electricityCost: number;

  gasCost: number;

  steamCost: number;

  waterCost: number;

  compressedAirCost: number;

  chilledWaterCost: number;

  fuelCost: number;

  renewableEnergyCost:
    number;

  demandCharges: number;

  fixedCharges: number;

  taxes: number;

  otherCharges: number;

  totalEnergyCost: number;

  currency: string;
};

export type EnergyPerformanceSummary = {
  totalConsumption:
    number;

  totalCost: number;

  currency: string;

  previousPeriodConsumption:
    number | null;

  previousPeriodCost:
    number | null;

  targetConsumption:
    number | null;

  targetCost:
    number | null;

  varianceFromPrevious:
    number | null;

  varianceFromPreviousPercent:
    number | null;

  varianceFromTarget:
    number | null;

  varianceFromTargetPercent:
    number | null;

  consumptionPerProductionUnit:
    number | null;

  costPerProductionUnit:
    number | null;

  peakDemand:
    number | null;

  trend:
    EnergyTrend;

  severity:
    EnergySeverity;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  lastCalculatedAt:
    string | null;
};

export type EnergyPeakEvent = {
  id: string;

  meterId:
    string | null;

  entityReference:
    EnergyEntityReference | null;

  energyType:
    EnergyType;

  occurredAt: string;

  peakValue: number;

  unit: string;

  thresholdValue:
    number | null;

  estimatedAdditionalCost:
    number | null;

  currency: string;

  durationMinutes:
    number | null;

  causeDescription: string;

  relatedAssetIds:
    string[];

  relatedWorkOrderIds:
    string[];

  notes: string;
};

export type EnergyAnomaly = {
  id: string;

  anomalyCode: string;

  displayName: string;

  description: string;

  energyType:
    EnergyType;

  entityReference:
    EnergyEntityReference | null;

  meterId:
    string | null;

  detectedAt: string;

  actualValue: number;

  expectedValue:
    number | null;

  deviation:
    number | null;

  deviationPercent:
    number | null;

  severity:
    EnergySeverity;

  confidenceScore: number;

  possibleCauses:
    string[];

  relatedAssetIds:
    string[];

  relatedFailureModeIds:
    string[];

  relatedRiskIds:
    string[];

  relatedRecommendationIds:
    string[];

  resolved: boolean;

  resolvedAt:
    string | null;

  resolutionDescription:
    string;

  notes: string;
};

export type EnergySavingOpportunity = {
  id: string;

  opportunityCode: string;

  title: string;

  description: string;

  energyType:
    EnergyType;

  entityReference:
    EnergyEntityReference | null;

  opportunityType:
    | "operational"
    | "maintenance"
    | "equipment-upgrade"
    | "control-optimization"
    | "schedule"
    | "tariff"
    | "demand-management"
    | "leak-reduction"
    | "heat-recovery"
    | "renewable"
    | "other";

  estimatedAnnualEnergySaving:
    number | null;

  energyUnit: string;

  estimatedAnnualCostSaving:
    number | null;

  implementationCost:
    number | null;

  paybackMonths:
    number | null;

  currency: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  confidenceScore: number;

  approved: boolean | null;

  implemented: boolean;

  implementedAt:
    string | null;

  projectId:
    string | null;

  workOrderId:
    string | null;

  recommendationId:
    string | null;

  notes: string;
};

export type EnergyUtilitySystemPerformance = {
  id: string;

  systemType:
    | "compressed-air"
    | "steam"
    | "chilled-water"
    | "cooling-water"
    | "hvac"
    | "pumping"
    | "lighting"
    | "electrical-distribution"
    | "other";

  entityReference:
    EnergyEntityReference | null;

  energyConsumption:
    number;

  energyUnit: string;

  outputValue:
    number | null;

  outputUnit: string;

  efficiencyPercent:
    number | null;

  targetEfficiencyPercent:
    number | null;

  losses:
    number | null;

  lossUnit: string;

  estimatedLossCost:
    number | null;

  currency: string;

  trend:
    EnergyTrend;

  notes: string;
};

export type EnergyInsight = {
  id: string;

  insightType:
    | "high-consumption"
    | "peak-demand"
    | "anomaly"
    | "inefficiency"
    | "saving-opportunity"
    | "cost-increase"
    | "trend"
    | "maintenance-impact"
    | "risk"
    | "prediction"
    | "other";

  title: string;

  description: string;

  impactScore: number;

  confidenceScore: number;

  estimatedAnnualCostImpact:
    number | null;

  currency: string;

  relatedEntityIds:
    string[];

  relatedAssetIds:
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

export type EnergyRecord = {
  id: string;

  /*
   * Identification
   */
  energyNumber: string;

  energyCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  status:
    EnergyStatus;

  active: boolean;

  primaryEnergyType:
    EnergyType;

  /*
   * Scope
   */
  primaryEntity:
    EnergyEntityReference | null;

  relatedEntities:
    EnergyEntityReference[];

  plantId:
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
  periodType:
    EnergyPeriodType;

  periodStart:
    string | null;

  periodEnd:
    string | null;

  /*
   * Meters
   */
  meterIds: string[];

  /*
   * Consumption
   */
  consumptionRecords:
    EnergyConsumptionRecord[];

  /*
   * Targets
   */
  targets:
    EnergyTarget[];

  /*
   * Benchmarks
   */
  benchmarks:
    EnergyBenchmark[];

  /*
   * Performance
   */
  performanceSummary:
    EnergyPerformanceSummary;

  /*
   * Cost
   */
  costSummary:
    EnergyCostSummary;

  /*
   * Demand
   */
  peakEvents:
    EnergyPeakEvent[];

  /*
   * Anomalies
   */
  anomalies:
    EnergyAnomaly[];

  /*
   * Utility systems
   */
  utilitySystemPerformance:
    EnergyUtilitySystemPerformance[];

  /*
   * Savings
   */
  savingOpportunities:
    EnergySavingOpportunity[];

  /*
   * Intelligence
   */
  insights:
    EnergyInsight[];

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

export type EnergyEngineMetrics = {
  totalElectricityConsumption:
    number;

  totalGasConsumption:
    number;

  totalSteamConsumption:
    number;

  totalWaterConsumption:
    number;

  totalCompressedAirConsumption:
    number;

  totalEnergyCost:
    number;

  electricityCost:
    number;

  gasCost: number;

  steamCost: number;

  waterCost: number;

  compressedAirCost: number;

  totalPeakDemand:
    number;

  activeMeterCount:
    number;

  unvalidatedReadingCount:
    number;

  anomalyCount:
    number;

  unresolvedAnomalyCount:
    number;

  peakEventCount:
    number;

  savingOpportunityCount:
    number;

  implementedSavingOpportunityCount:
    number;

  estimatedAnnualSavings:
    number;

  realizedAnnualSavings:
    number;

  energyReductionPercent:
    number;

  costReductionPercent:
    number;

  lastReadingAt:
    string | null;

  lastAnalysisAt:
    string | null;
};

export type EnergyEngineProfile = {
  engineHealthScore: number;

  dataCoverageScore: number;

  meterCoverageScore: number;

  dataQualityScore: number;

  consumptionEfficiencyScore:
    number;

  demandManagementScore:
    number;

  costEfficiencyScore:
    number;

  anomalyDetectionScore:
    number;

  savingRealizationScore:
    number;

  overallEnergyPerformanceScore:
    number;

  highConsumptionEntityIds:
    string[];

  highCostEntityIds:
    string[];

  inefficientAssetIds:
    string[];

  peakDemandEntityIds:
    string[];

  unresolvedAnomalyIds:
    string[];

  highValueSavingOpportunityIds:
    string[];

  recommendedMeterLocations:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type EnergyEngine = {
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

  automaticReadingCollectionEnabled:
    boolean;

  automaticConsumptionCalculationEnabled:
    boolean;

  automaticCostCalculationEnabled:
    boolean;

  automaticAnomalyDetectionEnabled:
    boolean;

  automaticPeakDetectionEnabled:
    boolean;

  automaticSavingOpportunityDetectionEnabled:
    boolean;

  automaticRiskCreationEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  /*
   * Meters
   */
  meters:
    EnergyMeter[];

  /*
   * Readings
   */
  readings:
    EnergyReading[];

  /*
   * Tariffs
   */
  tariffs:
    EnergyTariff[];

  /*
   * Records
   */
  records:
    EnergyRecord[];

  /*
   * Metrics
   */
  metrics:
    EnergyEngineMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    EnergyEngineProfile;

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

export type CreateEnergyMeterInput =
  Omit<
    EnergyMeter,
    "id"
  >;

export type UpdateEnergyMeterInput =
  Partial<CreateEnergyMeterInput>;

export type CreateEnergyRecordInput =
  Omit<
    EnergyRecord,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateEnergyRecordInput =
  Partial<CreateEnergyRecordInput>;

export type CreateEnergyEngineInput =
  Omit<
    EnergyEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateEnergyEngineInput =
  Partial<CreateEnergyEngineInput>;

export type EnergyRepositoryResult = {
  success: boolean;

  energyRecord:
    EnergyRecord | null;

  message: string;
};

export type EnergyEngineRepositoryResult = {
  success: boolean;

  energyEngine:
    EnergyEngine | null;

  message: string;
};

export const defaultEnergyPerformanceSummary:
  EnergyPerformanceSummary = {
  totalConsumption: 0,

  totalCost: 0,

  currency: "ILS",

  previousPeriodConsumption:
    null,

  previousPeriodCost: null,

  targetConsumption: null,

  targetCost: null,

  varianceFromPrevious: null,

  varianceFromPreviousPercent:
    null,

  varianceFromTarget: null,

  varianceFromTargetPercent:
    null,

  consumptionPerProductionUnit:
    null,

  costPerProductionUnit: null,

  peakDemand: null,

  trend: "unknown",

  severity: "unknown",

  periodStart: null,

  periodEnd: null,

  lastCalculatedAt: null,
};

export const defaultEnergyCostSummary:
  EnergyCostSummary = {
  electricityCost: 0,

  gasCost: 0,

  steamCost: 0,

  waterCost: 0,

  compressedAirCost: 0,

  chilledWaterCost: 0,

  fuelCost: 0,

  renewableEnergyCost: 0,

  demandCharges: 0,

  fixedCharges: 0,

  taxes: 0,

  otherCharges: 0,

  totalEnergyCost: 0,

  currency: "ILS",
};

export const defaultEnergyEngineMetrics:
  EnergyEngineMetrics = {
  totalElectricityConsumption: 0,

  totalGasConsumption: 0,

  totalSteamConsumption: 0,

  totalWaterConsumption: 0,

  totalCompressedAirConsumption:
    0,

  totalEnergyCost: 0,

  electricityCost: 0,

  gasCost: 0,

  steamCost: 0,

  waterCost: 0,

  compressedAirCost: 0,

  totalPeakDemand: 0,

  activeMeterCount: 0,

  unvalidatedReadingCount: 0,

  anomalyCount: 0,

  unresolvedAnomalyCount: 0,

  peakEventCount: 0,

  savingOpportunityCount: 0,

  implementedSavingOpportunityCount:
    0,

  estimatedAnnualSavings: 0,

  realizedAnnualSavings: 0,

  energyReductionPercent: 0,

  costReductionPercent: 0,

  lastReadingAt: null,

  lastAnalysisAt: null,
};

export const defaultEnergyEngineProfile:
  EnergyEngineProfile = {
  engineHealthScore: 0,

  dataCoverageScore: 0,

  meterCoverageScore: 0,

  dataQualityScore: 0,

  consumptionEfficiencyScore: 0,

  demandManagementScore: 0,

  costEfficiencyScore: 0,

  anomalyDetectionScore: 0,

  savingRealizationScore: 0,

  overallEnergyPerformanceScore:
    0,

  highConsumptionEntityIds: [],

  highCostEntityIds: [],

  inefficientAssetIds: [],

  peakDemandEntityIds: [],

  unresolvedAnomalyIds: [],

  highValueSavingOpportunityIds:
    [],

  recommendedMeterLocations: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultEnergyRecord:
  CreateEnergyRecordInput = {
  energyNumber: "",

  energyCode: "",

  displayName: "",

  description: "",

  status: "active",

  active: true,

  primaryEnergyType:
    "electricity",

  primaryEntity: null,

  relatedEntities: [],

  plantId: null,

  functionalLocationId: null,

  equipmentClassId: null,

  assetId: null,

  periodType: "monthly",

  periodStart: null,

  periodEnd: null,

  meterIds: [],

  consumptionRecords: [],

  targets: [],

  benchmarks: [],

  performanceSummary:
    defaultEnergyPerformanceSummary,

  costSummary:
    defaultEnergyCostSummary,

  peakEvents: [],

  anomalies: [],

  utilitySystemPerformance: [],

  savingOpportunities: [],

  insights: [],

  riskIds: [],

  recommendationIds: [],

  predictionIds: [],

  tags: [],

  notes: "",
};

export const defaultEnergyEngine:
  CreateEnergyEngineInput = {
  engineCode: "ENERGY",

  displayName:
    "Maintenance Energy Engine",

  description: "",

  version: "1.0.0",

  active: true,

  defaultCurrency: "ILS",

  automaticReadingCollectionEnabled:
    true,

  automaticConsumptionCalculationEnabled:
    true,

  automaticCostCalculationEnabled:
    true,

  automaticAnomalyDetectionEnabled:
    true,

  automaticPeakDetectionEnabled:
    true,

  automaticSavingOpportunityDetectionEnabled:
    true,

  automaticRiskCreationEnabled:
    false,

  automaticRecommendationEnabled:
    true,

  meters: [],

  readings: [],

  tariffs: [],

  records: [],

  tags: [],

  notes: "",
};