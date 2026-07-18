import type {
  SkillLevel,
  SkillRequirementType,
  SkillRiskLevel,
} from "./skill";

export type CertificationStatus =
  | "active"
  | "inactive"
  | "draft"
  | "obsolete";

export type CertificationCategory =
  | "electrical"
  | "mechanical"
  | "safety"
  | "welding"
  | "lifting"
  | "forklift"
  | "crane"
  | "pressure-systems"
  | "confined-space"
  | "working-at-height"
  | "hot-work"
  | "loto"
  | "first-aid"
  | "fire-safety"
  | "chemical-safety"
  | "quality"
  | "inspection"
  | "calibration"
  | "automation"
  | "instrumentation"
  | "manufacturer"
  | "software"
  | "management"
  | "regulatory"
  | "other";

export type CertificationType =
  | "license"
  | "certificate"
  | "authorization"
  | "permit"
  | "training"
  | "manufacturer-qualification"
  | "internal-qualification"
  | "regulatory-qualification"
  | "professional-membership"
  | "other";

export type CertificationAuthorityType =
  | "government"
  | "regulator"
  | "manufacturer"
  | "training-provider"
  | "professional-body"
  | "employer"
  | "internal"
  | "other";

export type CertificationValidityType =
  | "permanent"
  | "fixed-period"
  | "conditional"
  | "single-use";

export type CertificationRenewalMethod =
  | "automatic"
  | "training"
  | "assessment"
  | "medical-check"
  | "practical-test"
  | "written-test"
  | "document-review"
  | "authority-renewal"
  | "manager-approval"
  | "other";

export type CertificationVerificationMethod =
  | "document"
  | "digital-registry"
  | "authority-confirmation"
  | "qr-code"
  | "manager-verification"
  | "hr-verification"
  | "manual"
  | "other";

export type CertificationDocumentType =
  | "certificate"
  | "license"
  | "permit"
  | "training-record"
  | "assessment-report"
  | "medical-clearance"
  | "authority-approval"
  | "identity-document"
  | "other";

export type CertificationRequirementScope =
  | "organization"
  | "plant"
  | "department"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "work-order-type"
  | "task-type"
  | "failure-mode"
  | "skill"
  | "role"
  | "other";

export type CertificationAuthority = {
  id: string;

  authorityCode: string;

  displayName: string;

  authorityType:
    CertificationAuthorityType;

  country: string;

  websiteUrl: string;

  contactName: string;

  contactEmail: string;

  contactPhone: string;

  verificationUrl: string;

  notes: string;
};

export type CertificationRenewalRequirement = {
  id: string;

  title: string;

  description: string;

  renewalMethod:
    CertificationRenewalMethod;

  sequence: number;

  mandatory: boolean;

  requiredTrainingHours: number;

  requiredPracticalHours: number;

  requiredCompletedWorkOrders: number;

  passingScore: number | null;

  medicalCheckRequired: boolean;

  documentRequired: boolean;

  notes: string;
};

export type CertificationDocumentRequirement = {
  id: string;

  documentType:
    CertificationDocumentType;

  title: string;

  description: string;

  mandatory: boolean;

  expirationRequired: boolean;

  verificationRequired: boolean;

  acceptedFileTypes: string[];

  maximumFileSizeMb: number | null;

  notes: string;
};

export type CertificationApplicability = {
  plantIds: string[];

  departmentNames: string[];

  functionalLocationIds: string[];

  equipmentClassIds: string[];

  assetIds: string[];

  manufacturerNames: string[];

  modelNames: string[];

  workOrderTypes: string[];

  taskTypes: string[];

  failureModeIds: string[];

  skillIds: string[];

  roleIds: string[];
};

export type CertificationSkillRequirement = {
  id: string;

  skillId: string;

  skillCode: string;

  skillName: string;

  minimumSkillLevel:
    SkillLevel;

  requirementType:
    SkillRequirementType;

  notes: string;
};

export type CertificationPrerequisite = {
  id: string;

  prerequisiteCertificationId: string;

  prerequisiteCertificationCode: string;

  prerequisiteCertificationName: string;

  requirementType:
    SkillRequirementType;

  minimumRemainingValidityDays: number;

  notes: string;
};

export type CertificationRestriction = {
  id: string;

  title: string;

  description: string;

  restrictionType:
    | "voltage"
    | "weight"
    | "height"
    | "pressure"
    | "temperature"
    | "equipment"
    | "manufacturer"
    | "location"
    | "time"
    | "supervision"
    | "medical"
    | "other";

  minimumValue: number | null;

  maximumValue: number | null;

  unit: string;

  appliesUntil: string | null;

  notes: string;
};

export type CertificationKnowledgeReference = {
  id: string;

  title: string;

  referenceType:
    | "law"
    | "regulation"
    | "standard"
    | "procedure"
    | "training"
    | "manual"
    | "authority-guideline"
    | "manufacturer-guideline"
    | "external-link"
    | "other";

  referenceCode: string;

  referenceUrl: string;

  description: string;
};

export type CertificationReminderPolicy = {
  enabled: boolean;

  reminderDaysBeforeExpiration:
    number[];

  notifyPerson: boolean;

  notifyManager: boolean;

  notifyHr: boolean;

  notifySafety: boolean;

  notifyMaintenanceManager:
    boolean;

  blockAssignmentAfterExpiration:
    boolean;

  allowGracePeriod: boolean;

  gracePeriodDays: number;
};

export type CertificationPerformanceMetrics = {
  assignedPeopleCount: number;

  validPeopleCount: number;

  expiredPeopleCount: number;

  expiringPeopleCount: number;

  suspendedPeopleCount: number;

  pendingVerificationCount: number;

  renewalSuccessRatePercent: number;

  averageRenewalLeadTimeDays:
    number;

  lastIssuedAt: string | null;

  lastRenewedAt: string | null;
};

export type Certification = {
  id: string;

  /*
   * Identification
   */
  certificationNumber: string;

  certificationCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  category:
    CertificationCategory;

  certificationType:
    CertificationType;

  status:
    CertificationStatus;

  active: boolean;

  /*
   * Authority
   */
  issuingAuthority:
    CertificationAuthority;

  internalCertification: boolean;

  regulatoryRequirement: boolean;

  legalReference: string;

  /*
   * Validity
   */
  validityType:
    CertificationValidityType;

  validityMonths: number | null;

  validityDays: number | null;

  renewalRequired: boolean;

  renewalWindowDays: number;

  renewalRequirements:
    CertificationRenewalRequirement[];

  /*
   * Verification
   */
  verificationRequired: boolean;

  acceptedVerificationMethods:
    CertificationVerificationMethod[];

  verificationFrequencyMonths:
    number | null;

  originalDocumentRequired:
    boolean;

  documentRequirements:
    CertificationDocumentRequirement[];

  /*
   * Requirements
   */
  minimumAge: number | null;

  minimumExperienceMonths:
    number;

  minimumPracticalHours:
    number;

  medicalClearanceRequired:
    boolean;

  managerApprovalRequired:
    boolean;

  safetyApprovalRequired:
    boolean;

  hrApprovalRequired:
    boolean;

  trainingRequired: boolean;

  assessmentRequired: boolean;

  practicalTestRequired:
    boolean;

  writtenTestRequired:
    boolean;

  passingScore: number | null;

  /*
   * Relationships
   */
  prerequisiteCertifications:
    CertificationPrerequisite[];

  requiredSkills:
    CertificationSkillRequirement[];

  relatedCertificationIds:
    string[];

  supersededByCertificationId:
    string | null;

  /*
   * Applicability
   */
  applicability:
    CertificationApplicability;

  requirementScope:
    CertificationRequirementScope[];

  /*
   * Authorization
   */
  allowsIndependentWork: boolean;

  allowsSupervision: boolean;

  allowsApproval: boolean;

  allowsTrainingOthers: boolean;

  allowsPermitIssuance: boolean;

  allowsLotoAuthorization:
    boolean;

  safetyCritical: boolean;

  authorizationRequired: boolean;

  /*
   * Risk
   */
  riskLevel:
    SkillRiskLevel;

  consequencesOfExpiration:
    string;

  consequencesOfInvalidUse:
    string;

  blockWorkAssignmentWhenInvalid:
    boolean;

  /*
   * Restrictions
   */
  restrictions:
    CertificationRestriction[];

  /*
   * Notifications
   */
  reminderPolicy:
    CertificationReminderPolicy;

  /*
   * Knowledge
   */
  knowledgeReferences:
    CertificationKnowledgeReference[];

  tags: string[];

  notes: string;

  /*
   * Analytics
   */
  performanceMetrics:
    CertificationPerformanceMetrics;

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

export type CreateCertificationInput =
  Omit<
    Certification,
    | "id"
    | "performanceMetrics"
    | "version"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateCertificationInput =
  Partial<CreateCertificationInput>;

export type CertificationRepositoryResult = {
  success: boolean;

  certification:
    Certification | null;

  message: string;
};

export const defaultCertificationAuthority:
  CertificationAuthority = {
  id: "",

  authorityCode: "",

  displayName: "",

  authorityType: "internal",

  country: "",

  websiteUrl: "",

  contactName: "",

  contactEmail: "",

  contactPhone: "",

  verificationUrl: "",

  notes: "",
};

export const defaultCertificationApplicability:
  CertificationApplicability = {
  plantIds: [],

  departmentNames: [],

  functionalLocationIds: [],

  equipmentClassIds: [],

  assetIds: [],

  manufacturerNames: [],

  modelNames: [],

  workOrderTypes: [],

  taskTypes: [],

  failureModeIds: [],

  skillIds: [],

  roleIds: [],
};

export const defaultCertificationReminderPolicy:
  CertificationReminderPolicy = {
  enabled: true,

  reminderDaysBeforeExpiration: [
    90,
    60,
    30,
    14,
    7,
  ],

  notifyPerson: true,

  notifyManager: true,

  notifyHr: false,

  notifySafety: false,

  notifyMaintenanceManager:
    true,

  blockAssignmentAfterExpiration:
    true,

  allowGracePeriod: false,

  gracePeriodDays: 0,
};

export const defaultCertificationPerformanceMetrics:
  CertificationPerformanceMetrics = {
  assignedPeopleCount: 0,

  validPeopleCount: 0,

  expiredPeopleCount: 0,

  expiringPeopleCount: 0,

  suspendedPeopleCount: 0,

  pendingVerificationCount: 0,

  renewalSuccessRatePercent: 0,

  averageRenewalLeadTimeDays: 0,

  lastIssuedAt: null,

  lastRenewedAt: null,
};

export const defaultCertification:
  CreateCertificationInput = {
  certificationNumber: "",

  certificationCode: "",

  displayName: "",

  shortName: "",

  description: "",

  category: "safety",

  certificationType:
    "certificate",

  status: "draft",

  active: true,

  issuingAuthority:
    defaultCertificationAuthority,

  internalCertification: false,

  regulatoryRequirement: false,

  legalReference: "",

  validityType: "fixed-period",

  validityMonths: 12,

  validityDays: null,

  renewalRequired: true,

  renewalWindowDays: 60,

  renewalRequirements: [],

  verificationRequired: true,

  acceptedVerificationMethods: [
    "document",
  ],

  verificationFrequencyMonths:
    null,

  originalDocumentRequired:
    false,

  documentRequirements: [],

  minimumAge: null,

  minimumExperienceMonths: 0,

  minimumPracticalHours: 0,

  medicalClearanceRequired:
    false,

  managerApprovalRequired:
    false,

  safetyApprovalRequired:
    false,

  hrApprovalRequired: false,

  trainingRequired: false,

  assessmentRequired: false,

  practicalTestRequired: false,

  writtenTestRequired: false,

  passingScore: null,

  prerequisiteCertifications: [],

  requiredSkills: [],

  relatedCertificationIds: [],

  supersededByCertificationId:
    null,

  applicability:
    defaultCertificationApplicability,

  requirementScope: [],

  allowsIndependentWork: false,

  allowsSupervision: false,

  allowsApproval: false,

  allowsTrainingOthers: false,

  allowsPermitIssuance: false,

  allowsLotoAuthorization:
    false,

  safetyCritical: false,

  authorizationRequired: false,

  riskLevel: "medium",

  consequencesOfExpiration: "",

  consequencesOfInvalidUse: "",

  blockWorkAssignmentWhenInvalid:
    true,

  restrictions: [],

  reminderPolicy:
    defaultCertificationReminderPolicy,

  knowledgeReferences: [],

  tags: [],

  notes: "",
};