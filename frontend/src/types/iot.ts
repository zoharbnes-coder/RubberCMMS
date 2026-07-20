export type IotDeviceStatus =
  | "active"
  | "inactive"
  | "offline"
  | "fault"
  | "maintenance"
  | "decommissioned"
  | "unknown";

export type IotDeviceType =
  | "sensor"
  | "gateway"
  | "plc"
  | "meter"
  | "controller"
  | "edge-device"
  | "data-logger"
  | "camera"
  | "rfid-reader"
  | "barcode-reader"
  | "other";

export type IotProtocol =
  | "mqtt"
  | "modbus-tcp"
  | "modbus-rtu"
  | "opc-ua"
  | "opc-da"
  | "profinet"
  | "ethernet-ip"
  | "bacnet"
  | "canbus"
  | "http"
  | "https"
  | "websocket"
  | "snmp"
  | "bluetooth"
  | "zigbee"
  | "lorawan"
  | "wifi"
  | "cellular"
  | "custom"
  | "other";

export type IotSignalType =
  | "temperature"
  | "pressure"
  | "vibration"
  | "current"
  | "voltage"
  | "power"
  | "energy"
  | "speed"
  | "rpm"
  | "flow"
  | "level"
  | "position"
  | "distance"
  | "humidity"
  | "sound"
  | "runtime"
  | "cycle-count"
  | "state"
  | "alarm"
  | "quality"
  | "weight"
  | "force"
  | "torque"
  | "frequency"
  | "digital-input"
  | "digital-output"
  | "analog-input"
  | "analog-output"
  | "other";

export type IotSignalQuality =
  | "good"
  | "uncertain"
  | "bad"
  | "stale"
  | "unknown";

export type IotConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error"
  | "unknown";

export type IotAlarmSeverity =
  | "info"
  | "warning"
  | "high"
  | "critical";

export type IotAlarmStatus =
  | "active"
  | "acknowledged"
  | "resolved"
  | "suppressed"
  | "expired";

export type IotEntityType =
  | "plant"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "utility-system"
  | "energy-meter"
  | "work-order"
  | "failure-event"
  | "other";

export type IotDataSourceType =
  | "device"
  | "plc"
  | "scada"
  | "bms"
  | "historian"
  | "manual"
  | "external-system"
  | "calculated"
  | "other";

export type IotAggregationType =
  | "none"
  | "average"
  | "minimum"
  | "maximum"
  | "sum"
  | "count"
  | "median"
  | "last"
  | "first";

export type IotEntityReference = {
  entityType:
    IotEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type IotDeviceConnection = {
  id: string;

  protocol:
    IotProtocol;

  connectionStatus:
    IotConnectionStatus;

  host: string;

  port: number | null;

  deviceAddress: string;

  topic: string;

  endpoint: string;

  username: string;

  encrypted: boolean;

  certificateEnabled:
    boolean;

  reconnectEnabled:
    boolean;

  reconnectIntervalSeconds:
    number;

  timeoutSeconds: number;

  lastConnectedAt:
    string | null;

  lastDisconnectedAt:
    string | null;

  lastError: string;

  notes: string;
};

export type IotSignal = {
  id: string;

  signalCode: string;

  displayName: string;

  description: string;

  signalType:
    IotSignalType;

  sourceType:
    IotDataSourceType;

  deviceId: string;

  entityReference:
    IotEntityReference | null;

  address: string;

  tagName: string;

  unit: string;

  dataType:
    | "boolean"
    | "integer"
    | "float"
    | "double"
    | "string"
    | "enum";

  active: boolean;

  readable: boolean;

  writable: boolean;

  scalingEnabled:
    boolean;

  rawMinimum:
    number | null;

  rawMaximum:
    number | null;

  engineeringMinimum:
    number | null;

  engineeringMaximum:
    number | null;

  sampleIntervalSeconds:
    number;

  deadband:
    number | null;

  retainHistory:
    boolean;

  historyRetentionDays:
    number | null;

  aggregationType:
    IotAggregationType;

  notes: string;
};

export type IotReading = {
  id: string;

  signalId: string;

  deviceId: string;

  entityReference:
    IotEntityReference | null;

  timestamp: string;

  value:
    | number
    | string
    | boolean
    | null;

  unit: string;

  quality:
    IotSignalQuality;

  rawValue:
    number | string | boolean | null;

  sourceTimestamp:
    string | null;

  receivedAt: string;

  processedAt:
    string | null;

  anomalyDetected:
    boolean;

  validated:
    boolean;

  notes: string;
};

export type IotThreshold = {
  id: string;

  signalId: string;

  thresholdCode: string;

  displayName: string;

  description: string;

  condition:
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "equals"
    | "not-equals"
    | "between"
    | "outside";

  thresholdValue:
    number | null;

  secondaryThresholdValue:
    number | null;

  severity:
    IotAlarmSeverity;

  active: boolean;

  delaySeconds: number;

  hysteresis:
    number | null;

  createAlarm: boolean;

  createFailureEvent:
    boolean;

  createRisk:
    boolean;

  createRecommendation:
    boolean;

  notes: string;
};

export type IotAlarm = {
  id: string;

  alarmCode: string;

  displayName: string;

  description: string;

  severity:
    IotAlarmSeverity;

  status:
    IotAlarmStatus;

  deviceId: string;

  signalId:
    string | null;

  thresholdId:
    string | null;

  entityReference:
    IotEntityReference | null;

  triggeredAt: string;

  acknowledgedAt:
    string | null;

  acknowledgedByPersonId:
    string | null;

  acknowledgedByName: string;

  resolvedAt:
    string | null;

  actualValue:
    number | null;

  thresholdValue:
    number | null;

  unit: string;

  failureEventId:
    string | null;

  workOrderId:
    string | null;

  riskId:
    string | null;

  recommendationIds:
    string[];

  notes: string;
};

export type IotDeviceHealth = {
  online: boolean;

  connectionStatus:
    IotConnectionStatus;

  lastHeartbeatAt:
    string | null;

  uptimeSeconds:
    number;

  cpuUsagePercent:
    number | null;

  memoryUsagePercent:
    number | null;

  storageUsagePercent:
    number | null;

  signalQualityScore:
    number;

  communicationQualityScore:
    number;

  batteryPercent:
    number | null;

  internalTemperatureC:
    number | null;

  errorCount: number;

  warningCount: number;

  activeAlarmCount: number;

  lastError: string;

  healthScore: number;

  lastHealthCheckAt:
    string | null;
};

export type IotDevice = {
  id: string;

  /*
   * Identification
   */
  deviceCode: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  deviceType:
    IotDeviceType;

  status:
    IotDeviceStatus;

  active: boolean;

  /*
   * Assignment
   */
  entityReference:
    IotEntityReference | null;

  plantId:
    string | null;

  functionalLocationId:
    string | null;

  assetId:
    string | null;

  /*
   * Hardware
   */
  manufacturer: string;

  model: string;

  serialNumber: string;

  firmwareVersion: string;

  hardwareVersion: string;

  installationDate:
    string | null;

  /*
   * Connection
   */
  connections:
    IotDeviceConnection[];

  /*
   * Signals
   */
  signals:
    IotSignal[];

  /*
   * Health
   */
  health:
    IotDeviceHealth;

  /*
   * Security
   */
  authenticated: boolean;

  encrypted: boolean;

  certificateId:
    string | null;

  trusted: boolean;

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

export type IotAggregationRecord = {
  id: string;

  signalId: string;

  entityReference:
    IotEntityReference | null;

  aggregationType:
    IotAggregationType;

  periodStart: string;

  periodEnd: string;

  minimumValue:
    number | null;

  maximumValue:
    number | null;

  averageValue:
    number | null;

  sumValue:
    number | null;

  count: number;

  lastValue:
    number | null;

  unit: string;

  calculatedAt: string;

  notes: string;
};

export type IotAnomaly = {
  id: string;

  anomalyCode: string;

  displayName: string;

  description: string;

  deviceId: string;

  signalId:
    string | null;

  entityReference:
    IotEntityReference | null;

  detectedAt: string;

  actualValue:
    number | null;

  expectedValue:
    number | null;

  deviation:
    number | null;

  deviationPercent:
    number | null;

  severity:
    IotAlarmSeverity;

  confidenceScore: number;

  possibleFailureModeIds:
    string[];

  possibleCauses:
    string[];

  failureEventId:
    string | null;

  riskId:
    string | null;

  recommendationIds:
    string[];

  predictionIds:
    string[];

  resolved: boolean;

  resolvedAt:
    string | null;

  resolutionDescription:
    string;

  notes: string;
};

export type IotRuleCondition = {
  id: string;

  signalId:
    string | null;

  field: string;

  operator:
    | "equals"
    | "not-equals"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "between"
    | "outside"
    | "exists"
    | "not-exists";

  value:
    number | string | boolean | null;

  secondaryValue:
    number | null;

  durationSeconds:
    number;

  notes: string;
};

export type IotAutomationRule = {
  id: string;

  ruleCode: string;

  displayName: string;

  description: string;

  active: boolean;

  priority: number;

  deviceIds: string[];

  signalIds: string[];

  conditions:
    IotRuleCondition[];

  actionType:
    | "create-alarm"
    | "create-failure-event"
    | "create-maintenance-request"
    | "create-work-order"
    | "create-risk"
    | "create-recommendation"
    | "trigger-prediction"
    | "notify"
    | "write-signal"
    | "other";

  actionTargetId:
    string | null;

  automaticExecution:
    boolean;

  approvalRequired:
    boolean;

  cooldownSeconds:
    number;

  lastTriggeredAt:
    string | null;

  triggerCount: number;

  notes: string;
};

export type IotIntegration = {
  id: string;

  integrationCode: string;

  displayName: string;

  description: string;

  systemType:
    | "plc"
    | "scada"
    | "bms"
    | "historian"
    | "erp"
    | "mes"
    | "cloud"
    | "gateway"
    | "other";

  protocol:
    IotProtocol;

  active: boolean;

  endpoint: string;

  connectionStatus:
    IotConnectionStatus;

  lastConnectedAt:
    string | null;

  lastDataReceivedAt:
    string | null;

  importedSignalCount:
    number;

  importedReadingCount:
    number;

  errorCount: number;

  lastError: string;

  notes: string;
};

export type IotPerformanceMetrics = {
  totalDeviceCount: number;

  activeDeviceCount: number;

  onlineDeviceCount: number;

  offlineDeviceCount: number;

  faultDeviceCount: number;

  totalSignalCount: number;

  activeSignalCount: number;

  totalReadingCount: number;

  readingsLast24Hours:
    number;

  badQualityReadingCount:
    number;

  staleSignalCount: number;

  activeAlarmCount: number;

  criticalAlarmCount: number;

  anomalyCount: number;

  unresolvedAnomalyCount:
    number;

  automationRuleTriggerCount:
    number;

  createdFailureEventCount:
    number;

  createdWorkOrderCount:
    number;

  createdRiskCount: number;

  createdRecommendationCount:
    number;

  averageDeviceHealthScore:
    number;

  averageSignalQualityScore:
    number;

  dataAvailabilityPercent:
    number;

  lastReadingAt:
    string | null;

  lastAnalysisAt:
    string | null;
};

export type IotEngineProfile = {
  engineHealthScore: number;

  deviceCoverageScore: number;

  deviceHealthScore: number;

  signalCoverageScore: number;

  signalQualityScore: number;

  dataFreshnessScore: number;

  anomalyDetectionScore:
    number;

  automationEffectivenessScore:
    number;

  integrationHealthScore:
    number;

  overallIotPerformanceScore:
    number;

  offlineDeviceIds: string[];

  unhealthyDeviceIds: string[];

  staleSignalIds: string[];

  lowQualitySignalIds: string[];

  highAnomalyAssetIds:
    string[];

  missingSensorAssetIds:
    string[];

  recommendedSignalIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type IotEngine = {
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

  automaticDataCollectionEnabled:
    boolean;

  automaticAggregationEnabled:
    boolean;

  automaticAlarmEnabled:
    boolean;

  automaticAnomalyDetectionEnabled:
    boolean;

  automaticFailureCreationEnabled:
    boolean;

  automaticRiskCreationEnabled:
    boolean;

  automaticRecommendationEnabled:
    boolean;

  automaticPredictionEnabled:
    boolean;

  /*
   * Settings
   */
  defaultSampleIntervalSeconds:
    number;

  staleSignalThresholdMinutes:
    number;

  dataRetentionDays:
    number;

  anomalyDetectionMinimumConfidence:
    number;

  /*
   * Devices
   */
  devices:
    IotDevice[];

  /*
   * Readings
   */
  readings:
    IotReading[];

  /*
   * Aggregation
   */
  aggregations:
    IotAggregationRecord[];

  /*
   * Thresholds
   */
  thresholds:
    IotThreshold[];

  /*
   * Alarms
   */
  alarms:
    IotAlarm[];

  /*
   * Anomalies
   */
  anomalies:
    IotAnomaly[];

  /*
   * Automation
   */
  automationRules:
    IotAutomationRule[];

  /*
   * Integrations
   */
  integrations:
    IotIntegration[];

  /*
   * Metrics
   */
  metrics:
    IotPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    IotEngineProfile;

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

export type CreateIotDeviceInput =
  Omit<
    IotDevice,
    | "id"
    | "health"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateIotDeviceInput =
  Partial<CreateIotDeviceInput>;

export type CreateIotEngineInput =
  Omit<
    IotEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateIotEngineInput =
  Partial<CreateIotEngineInput>;

export type IotDeviceRepositoryResult = {
  success: boolean;

  device:
    IotDevice | null;

  message: string;
};

export type IotEngineRepositoryResult = {
  success: boolean;

  iotEngine:
    IotEngine | null;

  message: string;
};

export const defaultIotDeviceHealth:
  IotDeviceHealth = {
  online: false,

  connectionStatus:
    "unknown",

  lastHeartbeatAt: null,

  uptimeSeconds: 0,

  cpuUsagePercent: null,

  memoryUsagePercent: null,

  storageUsagePercent: null,

  signalQualityScore: 0,

  communicationQualityScore: 0,

  batteryPercent: null,

  internalTemperatureC: null,

  errorCount: 0,

  warningCount: 0,

  activeAlarmCount: 0,

  lastError: "",

  healthScore: 0,

  lastHealthCheckAt: null,
};

export const defaultIotPerformanceMetrics:
  IotPerformanceMetrics = {
  totalDeviceCount: 0,

  activeDeviceCount: 0,

  onlineDeviceCount: 0,

  offlineDeviceCount: 0,

  faultDeviceCount: 0,

  totalSignalCount: 0,

  activeSignalCount: 0,

  totalReadingCount: 0,

  readingsLast24Hours: 0,

  badQualityReadingCount: 0,

  staleSignalCount: 0,

  activeAlarmCount: 0,

  criticalAlarmCount: 0,

  anomalyCount: 0,

  unresolvedAnomalyCount: 0,

  automationRuleTriggerCount: 0,

  createdFailureEventCount: 0,

  createdWorkOrderCount: 0,

  createdRiskCount: 0,

  createdRecommendationCount: 0,

  averageDeviceHealthScore: 0,

  averageSignalQualityScore: 0,

  dataAvailabilityPercent: 0,

  lastReadingAt: null,

  lastAnalysisAt: null,
};

export const defaultIotEngineProfile:
  IotEngineProfile = {
  engineHealthScore: 0,

  deviceCoverageScore: 0,

  deviceHealthScore: 0,

  signalCoverageScore: 0,

  signalQualityScore: 0,

  dataFreshnessScore: 0,

  anomalyDetectionScore: 0,

  automationEffectivenessScore: 0,

  integrationHealthScore: 0,

  overallIotPerformanceScore: 0,

  offlineDeviceIds: [],

  unhealthyDeviceIds: [],

  staleSignalIds: [],

  lowQualitySignalIds: [],

  highAnomalyAssetIds: [],

  missingSensorAssetIds: [],

  recommendedSignalIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultIotEngine:
  CreateIotEngineInput = {
  engineCode: "IOT",

  displayName:
    "Maintenance IoT Engine",

  description: "",

  version: "1.0.0",

  active: true,

  automaticDataCollectionEnabled:
    true,

  automaticAggregationEnabled:
    true,

  automaticAlarmEnabled:
    true,

  automaticAnomalyDetectionEnabled:
    true,

  automaticFailureCreationEnabled:
    false,

  automaticRiskCreationEnabled:
    false,

  automaticRecommendationEnabled:
    true,

  automaticPredictionEnabled:
    true,

  defaultSampleIntervalSeconds:
    60,

  staleSignalThresholdMinutes:
    15,

  dataRetentionDays: 365,

  anomalyDetectionMinimumConfidence:
    0.8,

  devices: [],

  readings: [],

  aggregations: [],

  thresholds: [],

  alarms: [],

  anomalies: [],

  automationRules: [],

  integrations: [],

  tags: [],

  notes: "",
};