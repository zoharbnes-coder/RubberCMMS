export type MaintenanceRequestStatus =
  | "new"
  | "under-review"
  | "approved"
  | "rejected"
  | "converted-to-work-order"
  | "duplicate"
  | "cancelled"
  | "closed";

export type MaintenanceRequestType =
  | "breakdown"
  | "abnormal-condition"
  | "inspection-finding"
  | "safety"
  | "quality"
  | "production"
  | "preventive-follow-up"
  | "improvement"
  | "facility"
  | "utility"
  | "calibration"
  | "other";

export type MaintenanceRequestSource =
  | "operator"
  | "production"
  | "maintenance"
  | "quality"
  | "safety"
  | "engineering"
  | "warehouse"
  | "inspection"
  | "sensor"
  | "mie"
  | "external"
  | "other";

export type MaintenanceRequestPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "emergency";

export type MaintenanceRequestImpactLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MaintenanceRequestAssetCondition =
  | "operating"
  | "operating-with-limitation"
  | "stopped"
  | "unsafe"
  | "unknown";

export type MaintenanceRequestDetectionType =
  | "visual"
  | "noise"
  | "vibration"
  | "temperature"
  | "pressure"
  | "leakage"
  | "alarm"
  | "quality-defect"
  | "performance-loss"
  | "sensor"
  | "inspection"
  | "operator-observation"
  | "other";

export type MaintenanceRequestAttachmentType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "drawing"
  | "measurement"
  | "other";

export type MaintenanceRequestAttachment = {
  id: string;

  fileName: string;

  fileUrl: string;

  attachmentType:
    MaintenanceRequestAttachmentType;

  description: string;

  uploadedAt: string;

  uploadedByPersonId:
    string | null;

  uploadedByName: string;
};

export type MaintenanceRequestObservation = {
  id: string;

  detectionType:
    MaintenanceRequestDetectionType;

  title: string;

  description: string;

  observedValue:
    number | null;

  unit: string;

  normalMinimum:
    number | null;

  normalMaximum:
    number | null;

  observedAt: string;

  observedByPersonId:
    string | null;

  observedByName: string;

  notes: string;
};

export type MaintenanceRequestImpact = {
  assetCondition:
    MaintenanceRequestAssetCondition;

  productionImpact:
    MaintenanceRequestImpactLevel;

  safetyImpact:
    MaintenanceRequestImpactLevel;

  environmentalImpact:
    MaintenanceRequestImpactLevel;

  qualityImpact:
    MaintenanceRequestImpactLevel;

  maintenanceImpact:
    MaintenanceRequestImpactLevel;

  productionStopped: boolean;

  partialProductionLoss: boolean;

  affectedProductionPercent: number;

  estimatedDowntimeMinutes: number;

  immediateSafetyRisk: boolean;

  environmentalIncident: boolean;

  qualityHoldRequired: boolean;

  description: string;
};

export type MaintenanceRequestTriage = {
  reviewed: boolean;

  reviewedAt: string | null;

  reviewedByPersonId:
    string | null;

  reviewedByName: string;

  confirmedPriority:
    MaintenanceRequestPriority;

  confirmedRequestType:
    MaintenanceRequestType;

  validRequest: boolean | null;

  duplicateRequestId:
    string | null;

  recommendedAction:
    | "create-work-order"
    | "inspect-first"
    | "monitor"
    | "operator-action"
    | "planned-shutdown"
    | "reject"
    | "merge-with-existing"
    | "other";

  recommendedWorkType:
    | "corrective"
    | "emergency"
    | "inspection"
    | "preventive"
    | "predictive"
    | "improvement"
    | "calibration"
    | "project"
    | "other";

  requiresImmediateResponse: boolean;

  requiresShutdown: boolean;

  requiresProductionStop: boolean;

  requiresSafetyReview: boolean;

  requiresEngineeringReview: boolean;

  requiresExternalSupplier: boolean;

  estimatedLaborHours: number;

  estimatedTeamSize: number;

  requiredSkill: string;

  triageNotes: string;
};

export type MaintenanceRequestConversion = {
  convertedToWorkOrder: boolean;

  workOrderId: string | null;

  workOrderNumber: string;

  convertedAt: string | null;

  convertedByPersonId:
    string | null;

  convertedByName: string;

  conversionNotes: string;
};

export type MaintenanceRequestTimelineEntryType =
  | "created"
  | "updated"
  | "status-change"
  | "comment"
  | "observation-added"
  | "attachment-added"
  | "review-started"
  | "approved"
  | "rejected"
  | "duplicate-found"
  | "converted-to-work-order"
  | "cancelled"
  | "closed";

export type MaintenanceRequestTimelineEntry = {
  id: string;

  entryType:
    MaintenanceRequestTimelineEntryType;

  title: string;

  description: string;

  performedAt: string;

  performedByPersonId:
    string | null;

  performedByName: string;
};

export type MaintenanceRequestMieAnalysis = {
  analyzed: boolean;

  analyzedAt: string | null;

  riskScore: number;

  confidencePercent: number;

  recommendedPriority:
    MaintenanceRequestPriority;

  recommendation: string;

  possibleFailureModeIds:
    string[];

  relatedFailureEventIds:
    string[];

  relatedMaintenanceRequestIds:
    string[];

  relatedWorkOrderIds:
    string[];

  detectedDuplicateRequestIds:
    string[];

  suggestedDiagnosticQuestions:
    string[];

  suggestedImmediateActions:
    string[];

  safetyWarnings: string[];
};

export type MaintenanceRequest = {
  id: string;

  /*
   * Identification
   */
  requestNumber: string;

  title: string;

  description: string;

  /*
   * Organizational context
   */
  plantId: string;

  functionalLocationId:
    string | null;

  department: string;

  area: string;

  /*
   * Asset context
   */
  assetId: string | null;

  equipmentClassId:
    string | null;

  /*
   * Classification
   */
  requestType:
    MaintenanceRequestType;

  source:
    MaintenanceRequestSource;

  priority:
    MaintenanceRequestPriority;

  status:
    MaintenanceRequestStatus;

  active: boolean;

  /*
   * Reporting
   */
  reportedAt: string;

  reportedByPersonId:
    string | null;

  reportedByName: string;

  reporterDepartment: string;

  reporterPhone: string;

  reporterEmail: string;

  /*
   * Event timing
   */
  detectedAt: string;

  requestedCompletionDate:
    string | null;

  /*
   * Condition and impact
   */
  impact:
    MaintenanceRequestImpact;

  observations:
    MaintenanceRequestObservation[];

  /*
   * Supporting information
   */
  attachments:
    MaintenanceRequestAttachment[];

  tags: string[];

  /*
   * Review and conversion
   */
  triage:
    MaintenanceRequestTriage;

  conversion:
    MaintenanceRequestConversion;

  /*
   * Failure knowledge
   */
  failureEventId:
    string | null;

  suspectedFailureModeIds:
    string[];

  /*
   * MIE
   */
  mieAnalysis:
    MaintenanceRequestMieAnalysis;

  /*
   * History
   */
  timeline:
    MaintenanceRequestTimelineEntry[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateMaintenanceRequestInput =
  Omit<
    MaintenanceRequest,
    | "id"
    | "requestNumber"
    | "timeline"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateMaintenanceRequestInput =
  Partial<CreateMaintenanceRequestInput>;

export type MaintenanceRequestRepositoryResult = {
  success: boolean;

  maintenanceRequest:
    | MaintenanceRequest
    | null;

  message: string;
};

export const defaultMaintenanceRequestImpact:
  MaintenanceRequestImpact = {
  assetCondition: "operating",

  productionImpact: "none",

  safetyImpact: "none",

  environmentalImpact: "none",

  qualityImpact: "none",

  maintenanceImpact: "medium",

  productionStopped: false,

  partialProductionLoss: false,

  affectedProductionPercent: 0,

  estimatedDowntimeMinutes: 0,

  immediateSafetyRisk: false,

  environmentalIncident: false,

  qualityHoldRequired: false,

  description: "",
};

export const defaultMaintenanceRequestTriage:
  MaintenanceRequestTriage = {
  reviewed: false,

  reviewedAt: null,

  reviewedByPersonId: null,

  reviewedByName: "",

  confirmedPriority: "medium",

  confirmedRequestType:
    "abnormal-condition",

  validRequest: null,

  duplicateRequestId: null,

  recommendedAction:
    "inspect-first",

  recommendedWorkType:
    "inspection",

  requiresImmediateResponse: false,

  requiresShutdown: false,

  requiresProductionStop: false,

  requiresSafetyReview: false,

  requiresEngineeringReview: false,

  requiresExternalSupplier: false,

  estimatedLaborHours: 0,

  estimatedTeamSize: 1,

  requiredSkill: "",

  triageNotes: "",
};

export const defaultMaintenanceRequestConversion:
  MaintenanceRequestConversion = {
  convertedToWorkOrder: false,

  workOrderId: null,

  workOrderNumber: "",

  convertedAt: null,

  convertedByPersonId: null,

  convertedByName: "",

  conversionNotes: "",
};

export const defaultMaintenanceRequestMieAnalysis:
  MaintenanceRequestMieAnalysis = {
  analyzed: false,

  analyzedAt: null,

  riskScore: 0,

  confidencePercent: 0,

  recommendedPriority: "medium",

  recommendation: "",

  possibleFailureModeIds: [],

  relatedFailureEventIds: [],

  relatedMaintenanceRequestIds: [],

  relatedWorkOrderIds: [],

  detectedDuplicateRequestIds: [],

  suggestedDiagnosticQuestions: [],

  suggestedImmediateActions: [],

  safetyWarnings: [],
};
