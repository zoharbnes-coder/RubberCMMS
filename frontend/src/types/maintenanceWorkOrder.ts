export type MaintenanceWorkOrderStatus =
  | "draft"
  | "pending-approval"
  | "approved"
  | "planned"
  | "scheduled"
  | "released"
  | "in-progress"
  | "on-hold"
  | "waiting-for-parts"
  | "waiting-for-contractor"
  | "waiting-for-production"
  | "technically-completed"
  | "completed"
  | "closed"
  | "cancelled";

export type MaintenanceWorkOrderType =
  | "corrective"
  | "emergency"
  | "preventive"
  | "predictive"
  | "inspection"
  | "lubrication"
  | "calibration"
  | "improvement"
  | "project"
  | "safety"
  | "facility"
  | "utility"
  | "other";

export type MaintenanceWorkOrderPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "emergency";

export type MaintenanceWorkOrderSource =
  | "maintenance-request"
  | "preventive-plan"
  | "inspection"
  | "failure-event"
  | "sensor"
  | "mie"
  | "project"
  | "manual"
  | "external"
  | "other";

export type MaintenanceWorkOrderExecutionType =
  | "internal"
  | "external"
  | "combined";

export type MaintenanceWorkOrderShutdownType =
  | "none"
  | "asset-only"
  | "production-line"
  | "department"
  | "plant";

export type MaintenanceWorkOrderHoldReason =
  | "none"
  | "parts"
  | "tools"
  | "manpower"
  | "production"
  | "contractor"
  | "engineering"
  | "safety"
  | "permit"
  | "budget"
  | "weather"
  | "other";

export type MaintenanceWorkOrderTaskStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "skipped"
  | "blocked"
  | "cancelled";

export type MaintenanceWorkOrderTaskType =
  | "inspection"
  | "diagnosis"
  | "isolation"
  | "disassembly"
  | "cleaning"
  | "adjustment"
  | "lubrication"
  | "repair"
  | "replacement"
  | "alignment"
  | "calibration"
  | "programming"
  | "assembly"
  | "testing"
  | "commissioning"
  | "verification"
  | "documentation"
  | "other";

export type MaintenanceWorkOrderTimelineEntryType =
  | "created"
  | "updated"
  | "submitted-for-approval"
  | "approved"
  | "rejected"
  | "planned"
  | "scheduled"
  | "released"
  | "started"
  | "paused"
  | "resumed"
  | "hold"
  | "task-completed"
  | "measurement-added"
  | "part-issued"
  | "part-returned"
  | "labor-added"
  | "contractor-added"
  | "failure-confirmed"
  | "technically-completed"
  | "completed"
  | "verified"
  | "closed"
  | "cancelled"
  | "comment";

export type MaintenanceWorkOrderAttachmentType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "drawing"
  | "measurement"
  | "certificate"
  | "report"
  | "other";

export type MaintenanceWorkOrderAttachment = {
  id: string;

  fileName: string;
  fileUrl: string;

  attachmentType:
    MaintenanceWorkOrderAttachmentType;

  description: string;

  uploadedAt: string;

  uploadedByPersonId:
    string | null;

  uploadedByName: string;
};

export type MaintenanceWorkOrderTask = {
  id: string;

  taskNumber: number;

  taskCode: string;

  title: string;
  description: string;

  taskType:
    MaintenanceWorkOrderTaskType;

  status:
    MaintenanceWorkOrderTaskStatus;

  sequence: number;

  mandatory: boolean;

  safetyCritical: boolean;

  qualityCritical: boolean;

  requiresShutdown: boolean;

  estimatedDurationHours: number;

  actualDurationHours: number;

  requiredSkill: string;

  assignedPersonIds: string[];

  startedAt: string | null;

  completedAt: string | null;

  completedByPersonId:
    string | null;

  completedByName: string;

  verificationRequired: boolean;

  verificationMethod: string;

  verificationResult: string;

  verified: boolean;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  notes: string;
};

export type MaintenanceWorkOrderLaborEntry = {
  id: string;

  personId: string | null;

  personName: string;

  trade: string;

  workDate: string;

  startTime: string | null;

  endTime: string | null;

  regularHours: number;

  overtimeHours: number;

  hourlyRate: number;

  totalCost: number;

  description: string;

  approved: boolean;

  approvedByPersonId:
    string | null;

  approvedAt: string | null;

  notes: string;
};

export type MaintenanceWorkOrderPartUsage = {
  id: string;

  inventoryItemId: string | null;

  partNumber: string;

  displayName: string;

  warehouseId: string | null;

  warehouseName: string;

  plannedQuantity: number;

  issuedQuantity: number;

  returnedQuantity: number;

  consumedQuantity: number;

  unitOfMeasure: string;

  unitCost: number;

  totalCost: number;

  criticalPart: boolean;

  issuedAt: string | null;

  issuedByPersonId:
    string | null;

  returnedAt: string | null;

  returnedByPersonId:
    string | null;

  notes: string;
};

export type MaintenanceWorkOrderToolRequirement = {
  id: string;

  toolId: string | null;

  toolCode: string;

  displayName: string;

  plannedQuantity: number;

  issuedQuantity: number;

  returnedQuantity: number;

  mandatory: boolean;

  inspectionRequired: boolean;

  inspectionCompleted: boolean;

  notes: string;
};

export type MaintenanceWorkOrderExternalService = {
  id: string;

  supplierId: string | null;

  supplierName: string;

  purchaseOrderNumber: string;

  serviceDescription: string;

  contactName: string;

  contactPhone: string;

  plannedStartAt: string | null;

  plannedEndAt: string | null;

  actualStartAt: string | null;

  actualEndAt: string | null;

  estimatedCost: number;

  actualCost: number;

  completed: boolean;

  accepted: boolean;

  acceptedByPersonId:
    string | null;

  acceptedAt: string | null;

  notes: string;
};

export type MaintenanceWorkOrderMeasurement = {
  id: string;

  taskId: string | null;

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
    | "torque"
    | "clearance"
    | "dimension"
    | "runtime"
    | "cycles"
    | "other";

  displayName: string;

  valueBefore: number | null;

  valueAfter: number | null;

  unit: string;

  acceptableMinimum:
    number | null;

  acceptableMaximum:
    number | null;

  result:
    | "pass"
    | "fail"
    | "warning"
    | "not-evaluated";

  measuredAt: string;

  measuredByPersonId:
    string | null;

  measuredByName: string;

  notes: string;
};

export type MaintenanceWorkOrderSafety = {
  safetyReviewRequired: boolean;

  safetyReviewCompleted: boolean;

  reviewedByPersonId:
    string | null;

  reviewedAt: string | null;

  lotoRequired: boolean;

  lotoApplied: boolean;

  lotoRemoved: boolean;

  lotoReferenceNumber: string;

  permitRequired: boolean;

  permitType:
    | "none"
    | "hot-work"
    | "confined-space"
    | "working-at-height"
    | "electrical"
    | "lifting"
    | "excavation"
    | "chemical"
    | "other";

  permitNumber: string;

  ppeRequirements: string[];

  hazards: string[];

  controlMeasures: string[];

  residualRisk:
    | "low"
    | "medium"
    | "high"
    | "critical";

  toolboxTalkRequired: boolean;

  toolboxTalkCompleted: boolean;

  notes: string;
};

export type MaintenanceWorkOrderPlanning = {
  plannedStartAt: string | null;

  plannedEndAt: string | null;

  scheduledStartAt: string | null;

  scheduledEndAt: string | null;

  estimatedDurationHours: number;

  estimatedLaborHours: number;

  estimatedTeamSize: number;

  requiredSkills: string[];

  executionType:
    MaintenanceWorkOrderExecutionType;

  shutdownRequired: boolean;

  shutdownType:
    MaintenanceWorkOrderShutdownType;

  productionCoordinationRequired:
    boolean;

  productionApproved: boolean;

  productionApprovedByPersonId:
    string | null;

  productionApprovedAt:
    string | null;

  engineeringReviewRequired:
    boolean;

  engineeringReviewCompleted:
    boolean;

  partsAvailable: boolean;

  toolsAvailable: boolean;

  manpowerAvailable: boolean;

  contractorRequired: boolean;

  readyForScheduling: boolean;

  planningNotes: string;
};

export type MaintenanceWorkOrderExecution = {
  releasedAt: string | null;

  releasedByPersonId:
    string | null;

  actualStartAt: string | null;

  actualEndAt: string | null;

  startedByPersonId:
    string | null;

  completedByPersonId:
    string | null;

  holdReason:
    MaintenanceWorkOrderHoldReason;

  holdDescription: string;

  totalHoldHours: number;

  completionPercent: number;

  assetOperationalDuringWork:
    boolean;

  temporaryRepair: boolean;

  temporaryRepairExpirationDate:
    string | null;

  workPerformedSummary: string;

  findings: string;

  additionalWorkRequired: boolean;

  followUpWorkOrderId:
    string | null;

  executionNotes: string;
};

export type MaintenanceWorkOrderDowntime = {
  causedDowntime: boolean;

  downtimeStart: string | null;

  downtimeEnd: string | null;

  downtimeMinutes: number;

  plannedDowntime: boolean;

  partialProductionLoss: boolean;

  affectedProductionPercent: number;

  productionLineId: string | null;

  downtimeReason: string;

  notes: string;
};

export type MaintenanceWorkOrderCost = {
  estimatedLaborCost: number;

  actualLaborCost: number;

  estimatedPartsCost: number;

  actualPartsCost: number;

  estimatedExternalServiceCost:
    number;

  actualExternalServiceCost:
    number;

  estimatedProductionLossCost:
    number;

  actualProductionLossCost:
    number;

  estimatedOtherCost: number;

  actualOtherCost: number;

  estimatedTotalCost: number;

  actualTotalCost: number;

  budgetCode: string;

  costCenter: string;

  currency: string;
};

export type MaintenanceWorkOrderCompletion = {
  technicallyCompleted: boolean;

  technicallyCompletedAt:
    string | null;

  technicallyCompletedByPersonId:
    string | null;

  assetReturnedToService: boolean;

  assetReturnedToServiceAt:
    string | null;

  operationalTestCompleted:
    boolean;

  operationalTestResult:
    | "pass"
    | "fail"
    | "conditional"
    | "not-required";

  repairSuccessful:
    boolean | null;

  failureResolved:
    boolean | null;

  rootCauseConfirmed: boolean;

  rootCauseSummary: string;

  recurrenceRisk:
    | "low"
    | "medium"
    | "high"
    | "unknown";

  recommendations: string[];

  lessonsLearned: string;

  documentationUpdated: boolean;

  preventivePlanUpdateRequired:
    boolean;

  equipmentClassUpdateRequired:
    boolean;

  failureModeLibraryUpdateRequired:
    boolean;

  closureCriteriaMet: boolean;

  completionNotes: string;
};

export type MaintenanceWorkOrderApproval = {
  approvalRequired: boolean;

  submittedAt: string | null;

  submittedByPersonId:
    string | null;

  approved: boolean | null;

  approvedAt: string | null;

  approvedByPersonId:
    string | null;

  rejectedAt: string | null;

  rejectedByPersonId:
    string | null;

  rejectionReason: string;

  approvalNotes: string;
};

export type MaintenanceWorkOrderVerification = {
  verificationRequired: boolean;

  verified: boolean;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  verificationResult:
    | "accepted"
    | "rejected"
    | "accepted-with-follow-up"
    | "not-required";

  verificationNotes: string;
};

export type MaintenanceWorkOrderMieAnalysis = {
  analyzed: boolean;

  analyzedAt: string | null;

  riskScore: number;

  confidencePercent: number;

  recommendedPriority:
    MaintenanceWorkOrderPriority;

  estimatedDurationHours: number;

  estimatedDowntimeMinutes: number;

  estimatedCost: number;

  suggestedFailureModeIds:
    string[];

  relatedFailureEventIds:
    string[];

  relatedWorkOrderIds:
    string[];

  suggestedTasks: string[];

  suggestedParts: string[];

  suggestedTools: string[];

  suggestedSkills: string[];

  safetyWarnings: string[];

  executionRecommendation: string;

  completionAnalysis: string;

  repairSuccessPredictionPercent:
    number;
};

export type MaintenanceWorkOrderTimelineEntry = {
  id: string;

  entryType:
    MaintenanceWorkOrderTimelineEntryType;

  title: string;

  description: string;

  performedAt: string;

  performedByPersonId:
    string | null;

  performedByName: string;
};

export type MaintenanceWorkOrder = {
  id: string;

  /*
   * Identification
   */
  workOrderNumber: string;

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

  affectedAssetIds: string[];

  /*
   * Source records
   */
  maintenanceRequestId:
    string | null;

  failureEventId:
    string | null;

  preventivePlanId:
    string | null;

  inspectionId:
    string | null;

  projectId:
    string | null;

  parentWorkOrderId:
    string | null;

  relatedWorkOrderIds: string[];

  /*
   * Classification
   */
  workOrderType:
    MaintenanceWorkOrderType;

  source:
    MaintenanceWorkOrderSource;

  priority:
    MaintenanceWorkOrderPriority;

  status:
    MaintenanceWorkOrderStatus;

  active: boolean;

  /*
   * Responsibility
   */
  requestedByPersonId:
    string | null;

  requestedByName: string;

  ownerPersonId:
    string | null;

  ownerName: string;

  supervisorPersonId:
    string | null;

  supervisorName: string;

  assignedPersonIds: string[];

  assignedTeamId:
    string | null;

  /*
   * Dates
   */
  requestedAt: string;

  requiredCompletionDate:
    string | null;

  /*
   * Work preparation
   */
  approval:
    MaintenanceWorkOrderApproval;

  planning:
    MaintenanceWorkOrderPlanning;

  safety:
    MaintenanceWorkOrderSafety;

  /*
   * Work content
   */
  tasks:
    MaintenanceWorkOrderTask[];

  plannedParts:
    MaintenanceWorkOrderPartUsage[];

  requiredTools:
    MaintenanceWorkOrderToolRequirement[];

  externalServices:
    MaintenanceWorkOrderExternalService[];

  /*
   * Execution
   */
  execution:
    MaintenanceWorkOrderExecution;

  laborEntries:
    MaintenanceWorkOrderLaborEntry[];

  partsUsed:
    MaintenanceWorkOrderPartUsage[];

  measurements:
    MaintenanceWorkOrderMeasurement[];

  downtime:
    MaintenanceWorkOrderDowntime;

  cost:
    MaintenanceWorkOrderCost;

  /*
   * Failure and diagnosis
   */
  suspectedFailureModeIds:
    string[];

  confirmedFailureModeId:
    string | null;

  confirmedCauseIds: string[];

  /*
   * Completion and verification
   */
  completion:
    MaintenanceWorkOrderCompletion;

  verification:
    MaintenanceWorkOrderVerification;

  /*
   * Supporting information
   */
  attachments:
    MaintenanceWorkOrderAttachment[];

  tags: string[];

  notes: string;

  /*
   * Intelligence
   */
  mieAnalysis:
    MaintenanceWorkOrderMieAnalysis;

  /*
   * History
   */
  timeline:
    MaintenanceWorkOrderTimelineEntry[];

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateMaintenanceWorkOrderInput =
  Omit<
    MaintenanceWorkOrder,
    | "id"
    | "workOrderNumber"
    | "timeline"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateMaintenanceWorkOrderInput =
  Partial<CreateMaintenanceWorkOrderInput>;

export type MaintenanceWorkOrderRepositoryResult = {
  success: boolean;

  workOrder:
    | MaintenanceWorkOrder
    | null;

  message: string;
};

export const defaultMaintenanceWorkOrderApproval:
  MaintenanceWorkOrderApproval = {
  approvalRequired: true,

  submittedAt: null,

  submittedByPersonId: null,

  approved: null,

  approvedAt: null,

  approvedByPersonId: null,

  rejectedAt: null,

  rejectedByPersonId: null,

  rejectionReason: "",

  approvalNotes: "",
};

export const defaultMaintenanceWorkOrderPlanning:
  MaintenanceWorkOrderPlanning = {
  plannedStartAt: null,

  plannedEndAt: null,

  scheduledStartAt: null,

  scheduledEndAt: null,

  estimatedDurationHours: 0,

  estimatedLaborHours: 0,

  estimatedTeamSize: 1,

  requiredSkills: [],

  executionType: "internal",

  shutdownRequired: false,

  shutdownType: "none",

  productionCoordinationRequired:
    false,

  productionApproved: false,

  productionApprovedByPersonId:
    null,

  productionApprovedAt: null,

  engineeringReviewRequired:
    false,

  engineeringReviewCompleted:
    false,

  partsAvailable: false,

  toolsAvailable: false,

  manpowerAvailable: false,

  contractorRequired: false,

  readyForScheduling: false,

  planningNotes: "",
};

export const defaultMaintenanceWorkOrderSafety:
  MaintenanceWorkOrderSafety = {
  safetyReviewRequired: false,

  safetyReviewCompleted: false,

  reviewedByPersonId: null,

  reviewedAt: null,

  lotoRequired: false,

  lotoApplied: false,

  lotoRemoved: false,

  lotoReferenceNumber: "",

  permitRequired: false,

  permitType: "none",

  permitNumber: "",

  ppeRequirements: [],

  hazards: [],

  controlMeasures: [],

  residualRisk: "low",

  toolboxTalkRequired: false,

  toolboxTalkCompleted: false,

  notes: "",
};

export const defaultMaintenanceWorkOrderExecution:
  MaintenanceWorkOrderExecution = {
  releasedAt: null,

  releasedByPersonId: null,

  actualStartAt: null,

  actualEndAt: null,

  startedByPersonId: null,

  completedByPersonId: null,

  holdReason: "none",

  holdDescription: "",

  totalHoldHours: 0,

  completionPercent: 0,

  assetOperationalDuringWork:
    false,

  temporaryRepair: false,

  temporaryRepairExpirationDate:
    null,

  workPerformedSummary: "",

  findings: "",

  additionalWorkRequired: false,

  followUpWorkOrderId: null,

  executionNotes: "",
};

export const defaultMaintenanceWorkOrderDowntime:
  MaintenanceWorkOrderDowntime = {
  causedDowntime: false,

  downtimeStart: null,

  downtimeEnd: null,

  downtimeMinutes: 0,

  plannedDowntime: false,

  partialProductionLoss: false,

  affectedProductionPercent: 0,

  productionLineId: null,

  downtimeReason: "",

  notes: "",
};

export const defaultMaintenanceWorkOrderCost:
  MaintenanceWorkOrderCost = {
  estimatedLaborCost: 0,

  actualLaborCost: 0,

  estimatedPartsCost: 0,

  actualPartsCost: 0,

  estimatedExternalServiceCost: 0,

  actualExternalServiceCost: 0,

  estimatedProductionLossCost: 0,

  actualProductionLossCost: 0,

  estimatedOtherCost: 0,

  actualOtherCost: 0,

  estimatedTotalCost: 0,

  actualTotalCost: 0,

  budgetCode: "",

  costCenter: "",

  currency: "ILS",
};

export const defaultMaintenanceWorkOrderCompletion:
  MaintenanceWorkOrderCompletion = {
  technicallyCompleted: false,

  technicallyCompletedAt: null,

  technicallyCompletedByPersonId:
    null,

  assetReturnedToService: false,

  assetReturnedToServiceAt: null,

  operationalTestCompleted: false,

  operationalTestResult:
    "not-required",

  repairSuccessful: null,

  failureResolved: null,

  rootCauseConfirmed: false,

  rootCauseSummary: "",

  recurrenceRisk: "unknown",

  recommendations: [],

  lessonsLearned: "",

  documentationUpdated: false,

  preventivePlanUpdateRequired:
    false,

  equipmentClassUpdateRequired:
    false,

  failureModeLibraryUpdateRequired:
    false,

  closureCriteriaMet: false,

  completionNotes: "",
};

export const defaultMaintenanceWorkOrderVerification:
  MaintenanceWorkOrderVerification = {
  verificationRequired: true,

  verified: false,

  verifiedAt: null,

  verifiedByPersonId: null,

  verifiedByName: "",

  verificationResult:
    "not-required",

  verificationNotes: "",
};

export const defaultMaintenanceWorkOrderMieAnalysis:
  MaintenanceWorkOrderMieAnalysis = {
  analyzed: false,

  analyzedAt: null,

  riskScore: 0,

  confidencePercent: 0,

  recommendedPriority: "medium",

  estimatedDurationHours: 0,

  estimatedDowntimeMinutes: 0,

  estimatedCost: 0,

  suggestedFailureModeIds: [],

  relatedFailureEventIds: [],

  relatedWorkOrderIds: [],

  suggestedTasks: [],

  suggestedParts: [],

  suggestedTools: [],

  suggestedSkills: [],

  safetyWarnings: [],

  executionRecommendation: "",

  completionAnalysis: "",

  repairSuccessPredictionPercent: 0,
};