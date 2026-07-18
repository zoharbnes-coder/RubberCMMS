import type {
  AssetCriticality,
  AssetType,
} from "./asset";

export type FailureModeStatus =
  | "active"
  | "inactive"
  | "draft"
  | "obsolete";

export type FailureModeCategory =
  | "mechanical"
  | "electrical"
  | "hydraulic"
  | "pneumatic"
  | "control"
  | "instrumentation"
  | "process"
  | "lubrication"
  | "cooling"
  | "heating"
  | "safety"
  | "structural"
  | "utility"
  | "other";

export type FailureSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FailureOccurrence =
  | "rare"
  | "unlikely"
  | "possible"
  | "likely"
  | "frequent";

export type FailureDetectability =
  | "easy"
  | "moderate"
  | "difficult"
  | "very-difficult";

export type FailureModeSymptom = {
  id: string;

  title: string;
  description: string;

  symptomType:
    | "noise"
    | "vibration"
    | "temperature"
    | "pressure"
    | "flow"
    | "speed"
    | "position"
    | "current"
    | "voltage"
    | "leakage"
    | "quality"
    | "alarm"
    | "visual"
    | "odor"
    | "performance"
    | "other";

  measurable: boolean;

  measurementUnit: string;

  warningThreshold: number | null;
  alarmThreshold: number | null;

  notes: string;
};

export type FailureModeCause = {
  id: string;

  title: string;
  description: string;

  causeType:
    | "wear"
    | "fatigue"
    | "contamination"
    | "misalignment"
    | "overload"
    | "overheating"
    | "poor-lubrication"
    | "incorrect-adjustment"
    | "incorrect-operation"
    | "installation-error"
    | "design"
    | "material"
    | "electrical-fault"
    | "software"
    | "environment"
    | "maintenance-error"
    | "unknown"
    | "other";

  probability:
    FailureOccurrence;

  rootCause: boolean;

  notes: string;
};

export type FailureModeCorrectiveAction = {
  id: string;

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

  sequence: number;

  estimatedDurationHours: number;

  requiresShutdown: boolean;
  requiresProductionStop: boolean;

  requiredSkill: string;

  verificationMethod: string;

  notes: string;
};

export type FailureModeRequiredPart = {
  id: string;

  partNumber: string;
  displayName: string;

  manufacturer: string;
  manufacturerPartNumber: string;

  quantity: number;

  mandatory: boolean;

  notes: string;
};

export type FailureModeRequiredTool = {
  id: string;

  toolCode: string;
  displayName: string;

  quantity: number;

  mandatory: boolean;

  notes: string;
};

export type FailureModeSafetyRequirement = {
  id: string;

  title: string;
  description: string;

  requirementType:
    | "ppe"
    | "loto"
    | "permit"
    | "hot-work"
    | "confined-space"
    | "lifting"
    | "working-at-height"
    | "electrical-isolation"
    | "pressure-release"
    | "chemical"
    | "guarding"
    | "other";

  mandatory: boolean;
};

export type FailureModeDetectionMethod = {
  id: string;

  title: string;
  description: string;

  detectionType:
    | "operator-inspection"
    | "maintenance-inspection"
    | "sensor"
    | "condition-monitoring"
    | "vibration-analysis"
    | "thermography"
    | "oil-analysis"
    | "electrical-measurement"
    | "alarm"
    | "quality-control"
    | "functional-test"
    | "other";

  recommendedFrequency: string;

  earlyDetectionPossible: boolean;

  notes: string;
};

export type FailureModeKnowledgeReference = {
  id: string;

  title: string;

  referenceType:
    | "manual"
    | "drawing"
    | "procedure"
    | "work-order"
    | "incident"
    | "supplier"
    | "standard"
    | "training"
    | "external-link"
    | "other";

  referenceId: string;
  referenceUrl: string;

  description: string;
};

export type FailureModeApplicability = {
  assetTypes: AssetType[];

  equipmentClassIds: string[];

  manufacturerNames: string[];

  modelNames: string[];
};

export type FailureMode = {
  id: string;

  /*
   * Identification
   */
  failureModeNumber: string;
  failureModeCode: string;

  displayName: string;
  shortName: string;

  /*
   * Classification
   */
  category: FailureModeCategory;

  status: FailureModeStatus;

  active: boolean;

  /*
   * Applicability
   */
  applicability:
    FailureModeApplicability;

  /*
   * Risk evaluation
   */
  severity: FailureSeverity;

  occurrence: FailureOccurrence;

  detectability:
    FailureDetectability;

  defaultAssetCriticality:
    AssetCriticality;

  safetyImpact: boolean;
  environmentalImpact: boolean;
  productionImpact: boolean;
  qualityImpact: boolean;

  /*
   * Failure knowledge
   */
  failureDescription: string;

  functionalFailure: string;

  physicalFailure: string;

  symptoms: FailureModeSymptom[];

  causes: FailureModeCause[];

  detectionMethods:
    FailureModeDetectionMethod[];

  correctiveActions:
    FailureModeCorrectiveAction[];

  requiredParts:
    FailureModeRequiredPart[];

  requiredTools:
    FailureModeRequiredTool[];

  safetyRequirements:
    FailureModeSafetyRequirement[];

  knowledgeReferences:
    FailureModeKnowledgeReference[];

  /*
   * Planning data
   */
  estimatedMttrHours: number;

  recommendedTeamSize: number;

  recommendedSkill: string;

  recommendedPriority:
    | "low"
    | "medium"
    | "high"
    | "urgent";

  requiresShutdown: boolean;

  requiresProductionStop: boolean;

  /*
   * Intelligence
   */
  aiRecommendation: string;

  diagnosticQuestions: string[];

  confirmationCriteria: string[];

  closureCriteria: string[];

  /*
   * Statistics
   */
  occurrenceCount: number;

  successfulResolutionCount: number;

  averageActualMttrHours: number;

  lastOccurrenceAt: string | null;

  /*
   * General information
   */
  description: string;
  notes: string;

  /*
   * Version control
   */
  version: number;

  /*
   * Audit
   */
  createdAt: string;
  updatedAt: string;
};

export type CreateFailureModeInput =
  Omit<
    FailureMode,
    | "id"
    | "occurrenceCount"
    | "successfulResolutionCount"
    | "averageActualMttrHours"
    | "lastOccurrenceAt"
    | "version"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateFailureModeInput =
  Partial<CreateFailureModeInput>;

export type FailureModeRepositoryResult = {
  success: boolean;

  failureMode:
    | FailureMode
    | null;

  message: string;
};

export const defaultFailureMode:
  CreateFailureModeInput = {
  failureModeNumber: "",
  failureModeCode: "",

  displayName: "",
  shortName: "",

  category: "mechanical",

  status: "draft",

  active: true,

  applicability: {
    assetTypes: [],
    equipmentClassIds: [],
    manufacturerNames: [],
    modelNames: [],
  },

  severity: "medium",

  occurrence: "possible",

  detectability: "moderate",

  defaultAssetCriticality:
    "medium",

  safetyImpact: false,
  environmentalImpact: false,
  productionImpact: true,
  qualityImpact: false,

  failureDescription: "",

  functionalFailure: "",

  physicalFailure: "",

  symptoms: [],

  causes: [],

  detectionMethods: [],

  correctiveActions: [],

  requiredParts: [],

  requiredTools: [],

  safetyRequirements: [],

  knowledgeReferences: [],

  estimatedMttrHours: 0,

  recommendedTeamSize: 1,

  recommendedSkill: "",

  recommendedPriority: "medium",

  requiresShutdown: false,

  requiresProductionStop: false,

  aiRecommendation: "",

  diagnosticQuestions: [],

  confirmationCriteria: [],

  closureCriteria: [],

  description: "",
  notes: "",
};