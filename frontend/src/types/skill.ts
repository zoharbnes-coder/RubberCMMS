export type SkillStatus =
  | "active"
  | "inactive"
  | "draft"
  | "obsolete";

export type SkillCategory =
  | "mechanical"
  | "electrical"
  | "hydraulic"
  | "pneumatic"
  | "automation"
  | "instrumentation"
  | "process"
  | "welding"
  | "machining"
  | "lubrication"
  | "reliability"
  | "inspection"
  | "calibration"
  | "safety"
  | "quality"
  | "engineering"
  | "planning"
  | "supervision"
  | "facility"
  | "utility"
  | "software"
  | "other";

export type SkillType =
  | "technical"
  | "equipment-specific"
  | "manufacturer-specific"
  | "software"
  | "safety"
  | "license"
  | "management"
  | "process"
  | "inspection"
  | "certification"
  | "other";

export type SkillLevel =
  | "awareness"
  | "basic"
  | "intermediate"
  | "advanced"
  | "expert";

export type SkillVerificationMethod =
  | "self-declaration"
  | "manager-assessment"
  | "practical-test"
  | "written-test"
  | "training-completion"
  | "certificate"
  | "work-history"
  | "external-assessment"
  | "other";

export type SkillRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SkillRequirementType =
  | "mandatory"
  | "recommended"
  | "preferred";

export type SkillAssessmentCriterion = {
  id: string;

  title: string;

  description: string;

  sequence: number;

  requiredLevel:
    SkillLevel;

  mandatory: boolean;

  verificationMethod:
    SkillVerificationMethod;

  passingScore: number | null;

  notes: string;
};

export type SkillTrainingRequirement = {
  id: string;

  trainingCode: string;

  title: string;

  description: string;

  provider: string;

  durationHours: number;

  mandatory: boolean;

  requiredForLevel:
    SkillLevel;

  validityMonths: number | null;

  renewalRequired: boolean;

  notes: string;
};

export type SkillCertificationRequirement = {
  id: string;

  certificationCode: string;

  title: string;

  issuingAuthority: string;

  requirementType:
    SkillRequirementType;

  requiredForLevel:
    SkillLevel;

  validityMonths: number | null;

  renewalRequired: boolean;

  documentRequired: boolean;

  notes: string;
};

export type SkillSafetyRequirement = {
  id: string;

  title: string;

  description: string;

  requirementType:
    SkillRequirementType;

  riskLevel:
    SkillRiskLevel;

  requiredPpe: string[];

  lotoRequired: boolean;

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

  notes: string;
};

export type SkillEquipmentApplicability = {
  assetTypeIds: string[];

  equipmentClassIds: string[];

  manufacturerNames: string[];

  modelNames: string[];

  functionalLocationIds: string[];
};

export type SkillKnowledgeReference = {
  id: string;

  title: string;

  referenceType:
    | "procedure"
    | "manual"
    | "drawing"
    | "standard"
    | "training"
    | "video"
    | "certificate"
    | "work-order"
    | "failure-event"
    | "external-link"
    | "other";

  referenceId: string;

  referenceUrl: string;

  description: string;
};

export type SkillPrerequisite = {
  id: string;

  prerequisiteSkillId: string;

  prerequisiteSkillCode: string;

  prerequisiteSkillName: string;

  minimumLevel:
    SkillLevel;

  mandatory: boolean;

  notes: string;
};

export type SkillLevelDefinition = {
  level:
    SkillLevel;

  title: string;

  description: string;

  minimumExperienceHours: number;

  minimumCompletedWorkOrders: number;

  minimumSuccessfulAssessments: number;

  supervisionRequired: boolean;

  canWorkIndependently: boolean;

  canTrainOthers: boolean;

  approvalAuthority: boolean;

  assessmentCriteria:
    SkillAssessmentCriterion[];

  notes: string;
};

export type SkillPerformanceMetrics = {
  assignedPeopleCount: number;

  qualifiedPeopleCount: number;

  expertPeopleCount: number;

  expiredQualificationCount: number;

  expiringQualificationCount: number;

  completedWorkOrderCount: number;

  successfulWorkOrderCount: number;

  averageWorkOrderDurationHours: number;

  averageRepairSuccessPercent: number;

  lastUsedAt: string | null;
};

export type Skill = {
  id: string;

  /*
   * Identification
   */
  skillNumber: string;

  skillCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  category:
    SkillCategory;

  skillType:
    SkillType;

  status:
    SkillStatus;

  active: boolean;

  /*
   * Organizational ownership
   */
  plantId: string | null;

  department: string;

  discipline: string;

  ownerPersonId: string | null;

  ownerName: string;

  /*
   * Skill structure
   */
  parentSkillId: string | null;

  childSkillIds: string[];

  prerequisiteSkills:
    SkillPrerequisite[];

  relatedSkillIds: string[];

  /*
   * Competency levels
   */
  minimumOperationalLevel:
    SkillLevel;

  maximumAvailableLevel:
    SkillLevel;

  levelDefinitions:
    SkillLevelDefinition[];

  /*
   * Applicability
   */
  equipmentApplicability:
    SkillEquipmentApplicability;

  applicableFailureModeIds:
    string[];

  applicableWorkOrderTypeIds:
    string[];

  applicableTaskTypeIds:
    string[];

  /*
   * Training and certification
   */
  trainingRequirements:
    SkillTrainingRequirement[];

  certificationRequirements:
    SkillCertificationRequirement[];

  safetyRequirements:
    SkillSafetyRequirement[];

  /*
   * Experience requirements
   */
  minimumExperienceMonths: number;

  minimumPracticalHours: number;

  minimumCompletedWorkOrders: number;

  supervisedWorkRequired: boolean;

  requiredSupervisedWorkOrders: number;

  /*
   * Assessment
   */
  assessmentRequired: boolean;

  assessmentFrequencyMonths:
    number | null;

  acceptedVerificationMethods:
    SkillVerificationMethod[];

  defaultPassingScore:
    number | null;

  reassessmentRequired: boolean;

  /*
   * Validity
   */
  qualificationValidityMonths:
    number | null;

  renewalRequired: boolean;

  gracePeriodDays: number;

  reminderDaysBeforeExpiration:
    number;

  /*
   * Operational permissions
   */
  allowsIndependentWork: boolean;

  allowsSupervision: boolean;

  allowsApproval: boolean;

  allowsTrainingOthers: boolean;

  safetyCritical: boolean;

  authorizationRequired: boolean;

  /*
   * Risk
   */
  riskLevel:
    SkillRiskLevel;

  consequencesOfInsufficientSkill:
    string;

  /*
   * Knowledge
   */
  knowledgeReferences:
    SkillKnowledgeReference[];

  tags: string[];

  notes: string;

  /*
   * Analytics
   */
  performanceMetrics:
    SkillPerformanceMetrics;

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

export type CreateSkillInput =
  Omit<
    Skill,
    | "id"
    | "performanceMetrics"
    | "version"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateSkillInput =
  Partial<CreateSkillInput>;

export type SkillRepositoryResult = {
  success: boolean;

  skill: Skill | null;

  message: string;
};

export const defaultSkillEquipmentApplicability:
  SkillEquipmentApplicability = {
  assetTypeIds: [],

  equipmentClassIds: [],

  manufacturerNames: [],

  modelNames: [],

  functionalLocationIds: [],
};

export const defaultSkillPerformanceMetrics:
  SkillPerformanceMetrics = {
  assignedPeopleCount: 0,

  qualifiedPeopleCount: 0,

  expertPeopleCount: 0,

  expiredQualificationCount: 0,

  expiringQualificationCount: 0,

  completedWorkOrderCount: 0,

  successfulWorkOrderCount: 0,

  averageWorkOrderDurationHours: 0,

  averageRepairSuccessPercent: 0,

  lastUsedAt: null,
};

export const defaultSkill:
  CreateSkillInput = {
  skillNumber: "",

  skillCode: "",

  displayName: "",

  shortName: "",

  description: "",

  category: "mechanical",

  skillType: "technical",

  status: "draft",

  active: true,

  plantId: null,

  department: "",

  discipline: "",

  ownerPersonId: null,

  ownerName: "",

  parentSkillId: null,

  childSkillIds: [],

  prerequisiteSkills: [],

  relatedSkillIds: [],

  minimumOperationalLevel:
    "basic",

  maximumAvailableLevel:
    "expert",

  levelDefinitions: [],

  equipmentApplicability:
    defaultSkillEquipmentApplicability,

  applicableFailureModeIds: [],

  applicableWorkOrderTypeIds: [],

  applicableTaskTypeIds: [],

  trainingRequirements: [],

  certificationRequirements: [],

  safetyRequirements: [],

  minimumExperienceMonths: 0,

  minimumPracticalHours: 0,

  minimumCompletedWorkOrders: 0,

  supervisedWorkRequired: false,

  requiredSupervisedWorkOrders: 0,

  assessmentRequired: false,

  assessmentFrequencyMonths: null,

  acceptedVerificationMethods: [],

  defaultPassingScore: null,

  reassessmentRequired: false,

  qualificationValidityMonths: null,

  renewalRequired: false,

  gracePeriodDays: 0,

  reminderDaysBeforeExpiration: 30,

  allowsIndependentWork: false,

  allowsSupervision: false,

  allowsApproval: false,

  allowsTrainingOthers: false,

  safetyCritical: false,

  authorizationRequired: false,

  riskLevel: "medium",

  consequencesOfInsufficientSkill: "",

  knowledgeReferences: [],

  tags: [],

  notes: "",
};