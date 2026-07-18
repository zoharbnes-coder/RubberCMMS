import type {
  FailureDetectability,
  FailureModeCategory,
  FailureOccurrence,
  FailureSeverity,
} from "./failureMode";

export type FailureEventStatus =
  | "reported"
  | "under-investigation"
  | "diagnosed"
  | "repair-in-progress"
  | "resolved"
  | "closed"
  | "cancelled";

export type FailureEventSource =
  | "operator"
  | "maintenance"
  | "sensor"
  | "inspection"
  | "preventive-maintenance"
  | "quality"
  | "production"
  | "safety"
  | "mie"
  | "external"
  | "other";

export type FailureEventImpactLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FailureEventTimelineEntryType =
  | "reported"
  | "status-change"
  | "diagnosis"
  | "measurement"
  | "action"
  | "part-used"
  | "note"
  | "downtime-start"
  | "downtime-end"
  | "resolved"
  | "closed";

export type FailureEventTimelineEntry = {
  id: string;

  entryType:
    FailureEventTimelineEntryType;

  title: string;
  description: string;

  performedByPersonId: string | null;

  performedByName: string;

  timestamp: string;
};

export type FailureEventMeasurement = {
  id: string;

  measurementType:
    | "temperature"
    | "pressure"
    | "vibration"
    | "current"
    | "voltage"
    | "speed"
    | "flow"
    | "level"
    | "position"
    | "runtime"
    | "cycles"
    | "other";

  displayName: string;

  value: number;

  unit: string;

  normalMinimum: number | null;
  normalMaximum: number | null;

  measuredAt: string;

  measuredByPersonId: string | null;

  notes: string;
};

export type FailureEventSymptom = {
  id: string;

  symptomId: string | null;

  title: string;
  description: string;

  confirmed: boolean;

  observedAt: string;

  observedByPersonId: string | null;

  notes: string;
};

export type FailureEventCause = {
  id: string;

  causeId: string | null;

  title: string;
  description: string;

  confirmed: boolean;

  rootCause: boolean;

  confidencePercent: number;

  confirmedAt: string | null;

  confirmedByPersonId: string | null;

  notes: string;
};

export type FailureEventAction = {
  id: string;

  correctiveActionId: string | null;

  title: string;
  description: string;

  actionType:
    | "inspect"
    | "adjust"
    | "clean"
    | "lubricate"
    | "repair"
    | "replace"
    | "align"
    | "calibrate"
    | "reset"
    | "program"
    | "test"
    | "monitor"
    | "shutdown"
    | "other";

  status:
    | "planned"
    | "in-progress"
    | "completed"
    | "cancelled";

  sequence: number;

  startedAt: string | null;
  completedAt: string | null;

  performedByPersonIds: string[];

  actualDurationHours: number;

  successful: boolean | null;

  verificationResult: string;

  notes: string;
};

export type FailureEventPartUsage = {
  id: string;

  inventoryItemId: string | null;

  partNumber: string;
  displayName: string;

  quantity: number;

  unitCost: number;

  totalCost: number;

  warehouseId: string | null;

  issuedAt: string;

  issuedByPersonId: string | null;

  notes: string;
};

export type FailureEventImpact = {
  productionImpact:
    FailureEventImpactLevel;

  safetyImpact:
    FailureEventImpactLevel;

  environmentalImpact:
    FailureEventImpactLevel;

  qualityImpact:
    FailureEventImpactLevel;

  maintenanceImpact:
    FailureEventImpactLevel;

  productionLossQuantity: number;

  productionLossUnit: string;

  scrapQuantity: number;

  scrapUnit: string;

  estimatedProductionLossCost: number;

  estimatedQualityLossCost: number;

  environmentalIncident: boolean;

  safetyIncident: boolean;

  description: string;
};

export type FailureEventDowntime = {
  causedDowntime: boolean;

  downtimeStart: string | null;

  downtimeEnd: string | null;

  downtimeMinutes: number;

  plannedDowntime: boolean;

  partialProductionLoss: boolean;

  affectedProductionPercent: number;

  notes: string;
};

export type FailureEventDiagnosis = {
  failureModeId: string | null;

  failureModeCode: string;

  failureModeName: string;

  category:
    FailureModeCategory;

  severity:
    FailureSeverity;

  occurrence:
    FailureOccurrence;

  detectability:
    FailureDetectability;

  diagnosisConfirmed: boolean;

  diagnosisConfidencePercent: number;

  diagnosedAt: string | null;

  diagnosedByPersonId: string | null;

  diagnosticSummary: string;

  alternativeFailureModeIds: string[];
};

export type FailureEventResolution = {
  resolved: boolean;

  resolvedAt: string | null;

  resolvedByPersonId: string | null;

  resolutionSummary: string;

  assetReturnedToServiceAt:
    string | null;

  repairSuccessful: boolean | null;

  temporaryRepair: boolean;

  followUpRequired: boolean;

  followUpDate: string | null;

  recurrenceRisk:
    | "low"
    | "medium"
    | "high"
    | "unknown";

  recurrencePrevented: boolean;

  preventionActions: string[];

  lessonsLearned: string;

  closureCriteriaMet: boolean;

  verifiedByPersonId: string | null;

  verifiedAt: string | null;
};

export type FailureEventCost = {
  laborCost: number;

  partsCost: number;

  externalServiceCost: number;

  productionLossCost: number;

  qualityLossCost: number;

  otherCost: number;

  totalCost: number;

  currency: string;
};

export type FailureEvent = {
  id: string;

  /*
   * Identification
   */
  eventNumber: string;

  title: string;

  description: string;

  /*
   * Asset context
   */
  plantId: string;

  functionalLocationId:
    string | null;

  assetId: string;

  equipmentClassId:
    string | null;

  /*
   * Work context
   */
  workOrderId: string | null;

  maintenanceRequestId:
    string | null;

  /*
   * Event status
   */
  status:
    FailureEventStatus;

  source:
    FailureEventSource;

  active: boolean;

  /*
   * Reporting
   */
  reportedAt: string;

  reportedByPersonId:
    string | null;

  reportedByName: string;

  detectedAt: string;

  detectionDescription: string;

  /*
   * Diagnosis
   */
  diagnosis:
    FailureEventDiagnosis;

  symptoms:
    FailureEventSymptom[];

  causes:
    FailureEventCause[];

  measurements:
    FailureEventMeasurement[];

  /*
   * Repair execution
   */
  actions:
    FailureEventAction[];

  partsUsed:
    FailureEventPartUsage[];

  /*
   * Impact
   */
  impact:
    FailureEventImpact;

  downtime:
    FailureEventDowntime;

  cost:
    FailureEventCost;

  /*
   * Resolution
   */
  resolution:
    FailureEventResolution;

  /*
   * Knowledge and history
   */
  timeline:
    FailureEventTimelineEntry[];

  attachments: string[];

  tags: string[];

  notes: string;

  /*
   * MIE
   */
  mieRiskScore: number;

  mieConfidencePercent: number;

  mieRecommendation: string;

  mieRelatedEventIds: string[];

  miePossibleFailureModeIds: string[];

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateFailureEventInput =
  Omit<
    FailureEvent,
    | "id"
    | "eventNumber"
    | "timeline"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateFailureEventInput =
  Partial<CreateFailureEventInput>;

export type FailureEventRepositoryResult = {
  success: boolean;

  failureEvent:
    | FailureEvent
    | null;

  message: string;
};

export const defaultFailureEventImpact:
  FailureEventImpact = {
  productionImpact: "none",

  safetyImpact: "none",

  environmentalImpact: "none",

  qualityImpact: "none",

  maintenanceImpact: "medium",

  productionLossQuantity: 0,

  productionLossUnit: "",

  scrapQuantity: 0,

  scrapUnit: "",

  estimatedProductionLossCost: 0,

  estimatedQualityLossCost: 0,

  environmentalIncident: false,

  safetyIncident: false,

  description: "",
};

export const defaultFailureEventDowntime:
  FailureEventDowntime = {
  causedDowntime: false,

  downtimeStart: null,

  downtimeEnd: null,

  downtimeMinutes: 0,

  plannedDowntime: false,

  partialProductionLoss: false,

  affectedProductionPercent: 0,

  notes: "",
};

export const defaultFailureEventCost:
  FailureEventCost = {
  laborCost: 0,

  partsCost: 0,

  externalServiceCost: 0,

  productionLossCost: 0,

  qualityLossCost: 0,

  otherCost: 0,

  totalCost: 0,

  currency: "ILS",
};

export const defaultFailureEventResolution:
  FailureEventResolution = {
  resolved: false,

  resolvedAt: null,

  resolvedByPersonId: null,

  resolutionSummary: "",

  assetReturnedToServiceAt: null,

  repairSuccessful: null,

  temporaryRepair: false,

  followUpRequired: false,

  followUpDate: null,

  recurrenceRisk: "unknown",

  recurrencePrevented: false,

  preventionActions: [],

  lessonsLearned: "",

  closureCriteriaMet: false,

  verifiedByPersonId: null,

  verifiedAt: null,
};