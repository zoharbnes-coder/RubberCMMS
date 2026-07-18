import type {
  SkillLevel,
  SkillVerificationMethod,
} from "./skill";

export type PersonStatus =
  | "active"
  | "inactive"
  | "on-leave"
  | "suspended"
  | "terminated"
  | "contractor"
  | "retired";

export type PersonType =
  | "employee"
  | "contractor"
  | "temporary"
  | "consultant"
  | "supplier-technician"
  | "external-specialist"
  | "other";

export type PersonEmploymentType =
  | "full-time"
  | "part-time"
  | "shift"
  | "temporary"
  | "contract"
  | "external"
  | "other";

export type PersonDiscipline =
  | "mechanical"
  | "electrical"
  | "automation"
  | "instrumentation"
  | "hydraulic"
  | "pneumatic"
  | "welding"
  | "machining"
  | "lubrication"
  | "reliability"
  | "planning"
  | "engineering"
  | "production"
  | "quality"
  | "safety"
  | "warehouse"
  | "management"
  | "facility"
  | "utility"
  | "other";

export type PersonRole =
  | "technician"
  | "electrician"
  | "mechanic"
  | "automation-technician"
  | "instrumentation-technician"
  | "welder"
  | "machinist"
  | "planner"
  | "supervisor"
  | "maintenance-manager"
  | "engineer"
  | "reliability-engineer"
  | "energy-manager"
  | "operator"
  | "warehouse-person"
  | "safety-officer"
  | "quality-person"
  | "contractor"
  | "administrator"
  | "other";

export type PersonAvailabilityStatus =
  | "available"
  | "assigned"
  | "busy"
  | "on-call"
  | "on-break"
  | "off-shift"
  | "on-leave"
  | "unavailable"
  | "unknown";

export type PersonShiftType =
  | "day"
  | "evening"
  | "night"
  | "rotating"
  | "on-call"
  | "flexible"
  | "office"
  | "other";

export type PersonContactPreference =
  | "phone"
  | "sms"
  | "email"
  | "whatsapp"
  | "push"
  | "none";

export type PersonSkillStatus =
  | "planned"
  | "in-training"
  | "qualified"
  | "expired"
  | "suspended"
  | "revoked";

export type PersonCertificationStatus =
  | "pending"
  | "valid"
  | "expiring"
  | "expired"
  | "suspended"
  | "revoked"
  | "rejected";

export type PersonAuthorizationStatus =
  | "pending"
  | "approved"
  | "suspended"
  | "revoked"
  | "expired";

export type PersonWorkPreference =
  | "individual"
  | "team"
  | "supervised"
  | "independent"
  | "field"
  | "workshop"
  | "mixed";

export type PersonEmergencyRole =
  | "none"
  | "first-aid"
  | "fire-team"
  | "evacuation"
  | "electrical-isolation"
  | "loto-authorized"
  | "incident-response"
  | "other";

export type PersonSkill = {
  id: string;

  skillId: string;

  skillCode: string;

  skillName: string;

  currentLevel:
    SkillLevel;

  targetLevel:
    SkillLevel | null;

  status:
    PersonSkillStatus;

  verified: boolean;

  verificationMethod:
    SkillVerificationMethod | null;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  qualificationDate:
    string | null;

  expirationDate:
    string | null;

  lastAssessmentDate:
    string | null;

  nextAssessmentDate:
    string | null;

  assessmentScore:
    number | null;

  practicalHours: number;

  completedWorkOrders: number;

  successfulWorkOrders: number;

  successRatePercent: number;

  averageWorkOrderDurationHours:
    number;

  supervisionRequired: boolean;

  canWorkIndependently: boolean;

  canSupervise: boolean;

  canApprove: boolean;

  canTrainOthers: boolean;

  restrictions: string[];

  notes: string;
};

export type PersonCertification = {
  id: string;

  certificationId: string;

  certificationCode: string;

  certificationName: string;

  status:
    PersonCertificationStatus;

  certificateNumber: string;

  issuingAuthority: string;

  issueDate: string | null;

  validFrom: string | null;

  expirationDate: string | null;

  renewalDueDate: string | null;

  verified: boolean;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  documentIds: string[];

  restrictionIds: string[];

  suspensionReason: string;

  revokedReason: string;

  notes: string;
};

export type PersonAuthorization = {
  id: string;

  authorizationCode: string;

  title: string;

  description: string;

  authorizationType:
    | "work"
    | "approval"
    | "supervision"
    | "permit-issuance"
    | "loto"
    | "electrical"
    | "hot-work"
    | "confined-space"
    | "working-at-height"
    | "lifting"
    | "equipment-operation"
    | "system-access"
    | "other";

  status:
    PersonAuthorizationStatus;

  scopeType:
    | "organization"
    | "plant"
    | "department"
    | "functional-location"
    | "equipment-class"
    | "asset"
    | "work-order-type"
    | "task-type"
    | "other";

  scopeIds: string[];

  grantedAt: string | null;

  grantedByPersonId:
    string | null;

  grantedByName: string;

  validUntil: string | null;

  restrictions: string[];

  notes: string;
};

export type PersonWorkHistoryEntry = {
  id: string;

  organizationName: string;

  plantName: string;

  departmentName: string;

  roleTitle: string;

  discipline:
    PersonDiscipline;

  startDate: string;

  endDate: string | null;

  description: string;

  equipmentClassIds: string[];

  manufacturerNames: string[];

  majorResponsibilities: string[];

  notes: string;
};

export type PersonTrainingRecord = {
  id: string;

  trainingCode: string;

  trainingName: string;

  provider: string;

  trainingType:
    | "internal"
    | "external"
    | "manufacturer"
    | "online"
    | "practical"
    | "safety"
    | "other";

  startDate: string | null;

  completionDate: string | null;

  durationHours: number;

  completed: boolean;

  score: number | null;

  passed: boolean | null;

  certificateIssued: boolean;

  certificateDocumentId:
    string | null;

  relatedSkillIds: string[];

  relatedCertificationIds:
    string[];

  trainerPersonId:
    string | null;

  trainerName: string;

  notes: string;
};

export type PersonAvailability = {
  status:
    PersonAvailabilityStatus;

  shiftType:
    PersonShiftType;

  shiftStartTime: string;

  shiftEndTime: string;

  workingDays: number[];

  availableFrom: string | null;

  availableUntil: string | null;

  onCall: boolean;

  onCallFrom: string | null;

  onCallUntil: string | null;

  leaveStartDate: string | null;

  leaveEndDate: string | null;

  leaveReason: string;

  maximumDailyHours: number;

  maximumWeeklyHours: number;

  overtimeAllowed: boolean;

  nightShiftAllowed: boolean;

  weekendWorkAllowed: boolean;

  emergencyCalloutAllowed:
    boolean;

  notes: string;
};

export type PersonOrganizationalAssignment = {
  plantId: string | null;

  plantName: string;

  departmentId: string | null;

  departmentName: string;

  teamId: string | null;

  teamName: string;

  functionalLocationIds: string[];

  primaryFunctionalLocationId:
    string | null;

  costCenter: string;

  managerPersonId: string | null;

  managerName: string;

  supervisorPersonId:
    string | null;

  supervisorName: string;
};

export type PersonContactInformation = {
  workEmail: string;

  personalEmail: string;

  workPhone: string;

  mobilePhone: string;

  emergencyPhone: string;

  preferredContactMethod:
    PersonContactPreference;

  preferredLanguage: string;

  address: string;

  city: string;

  country: string;

  notes: string;
};

export type PersonEmergencyContact = {
  id: string;

  fullName: string;

  relationship: string;

  phone: string;

  alternatePhone: string;

  email: string;

  priority: number;

  notes: string;
};

export type PersonWorkPreferenceProfile = {
  preferredWorkStyle:
    PersonWorkPreference[];

  preferredShiftTypes:
    PersonShiftType[];

  preferredEquipmentClassIds:
    string[];

  preferredManufacturerNames:
    string[];

  preferredWorkOrderTypes:
    string[];

  preferredTaskTypes:
    string[];

  canTravel: boolean;

  travelRadiusKm: number | null;

  remoteSupportAvailable:
    boolean;

  workshopWorkAvailable:
    boolean;

  fieldWorkAvailable:
    boolean;

  notes: string;
};

export type PersonSafetyProfile = {
  emergencyRoles:
    PersonEmergencyRole[];

  lotoAuthorized: boolean;

  electricalAuthorized: boolean;

  hotWorkAuthorized: boolean;

  confinedSpaceAuthorized:
    boolean;

  workingAtHeightAuthorized:
    boolean;

  liftingAuthorized: boolean;

  firstAidQualified: boolean;

  medicalClearanceRequired:
    boolean;

  medicalClearanceValid:
    boolean;

  medicalClearanceExpirationDate:
    string | null;

  ppeIssued: string[];

  safetyRestrictions: string[];

  safetyNotes: string;
};

export type PersonSystemAccess = {
  userId: string | null;

  username: string;

  systemRoleIds: string[];

  mobileAccessEnabled:
    boolean;

  webAccessEnabled: boolean;

  adminAccess: boolean;

  canCreateRequests: boolean;

  canCreateWorkOrders: boolean;

  canApproveWorkOrders: boolean;

  canCloseWorkOrders: boolean;

  canManageInventory: boolean;

  canManageAssets: boolean;

  canManagePeople: boolean;

  canManageSkills: boolean;

  canManageCertifications:
    boolean;

  canViewCosts: boolean;

  canViewSafetyInformation:
    boolean;

  lastLoginAt: string | null;

  accessSuspended: boolean;

  suspensionReason: string;
};

export type PersonPerformanceMetrics = {
  assignedWorkOrderCount: number;

  completedWorkOrderCount: number;

  openWorkOrderCount: number;

  overdueWorkOrderCount: number;

  emergencyWorkOrderCount: number;

  successfulRepairCount: number;

  repeatFailureCount: number;

  firstTimeFixRatePercent:
    number;

  repairSuccessRatePercent:
    number;

  averageResponseTimeMinutes:
    number;

  averageRepairTimeHours:
    number;

  averageWorkOrderCompletionHours:
    number;

  totalLaborHours: number;

  overtimeHours: number;

  safetyIncidentCount: number;

  qualityIssueCount: number;

  trainingHours: number;

  qualificationCoveragePercent:
    number;

  workOrderApprovalCount: number;

  workOrderRejectionCount: number;

  lastWorkOrderAt: string | null;
};

export type PersonMieProfile = {
  expertiseScore: number;

  reliabilityScore: number;

  availabilityScore: number;

  safetyScore: number;

  overallMatchScore: number;

  preferredFailureModeIds:
    string[];

  experiencedFailureModeIds:
    string[];

  successfulFailureModeIds:
    string[];

  preferredAssetIds: string[];

  experiencedAssetIds: string[];

  preferredEquipmentClassIds:
    string[];

  experiencedEquipmentClassIds:
    string[];

  recommendedAssignmentTypes:
    string[];

  assignmentRestrictions:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type PersonDocumentReference = {
  id: string;

  documentId: string;

  documentType:
    | "identity"
    | "employment"
    | "certificate"
    | "license"
    | "training"
    | "medical-clearance"
    | "authorization"
    | "assessment"
    | "contract"
    | "other";

  title: string;

  description: string;

  validFrom: string | null;

  validUntil: string | null;

  confidential: boolean;

  notes: string;
};

export type Person = {
  id: string;

  /*
   * Identification
   */
  personNumber: string;

  employeeNumber: string;

  firstName: string;

  lastName: string;

  displayName: string;

  jobTitle: string;

  /*
   * Classification
   */
  personType:
    PersonType;

  employmentType:
    PersonEmploymentType;

  status:
    PersonStatus;

  active: boolean;

  primaryRole:
    PersonRole;

  secondaryRoles:
    PersonRole[];

  primaryDiscipline:
    PersonDiscipline;

  secondaryDisciplines:
    PersonDiscipline[];

  /*
   * Employment
   */
  hireDate: string | null;

  terminationDate: string | null;

  seniorityDate: string | null;

  employmentStartDate:
    string | null;

  employmentEndDate:
    string | null;

  positionCode: string;

  organizationName: string;

  /*
   * Organizational assignment
   */
  organizationalAssignment:
    PersonOrganizationalAssignment;

  /*
   * Contact
   */
  contactInformation:
    PersonContactInformation;

  emergencyContacts:
    PersonEmergencyContact[];

  /*
   * Availability
   */
  availability:
    PersonAvailability;

  /*
   * Competency
   */
  skills:
    PersonSkill[];

  certifications:
    PersonCertification[];

  authorizations:
    PersonAuthorization[];

  trainingRecords:
    PersonTrainingRecord[];

  workHistory:
    PersonWorkHistoryEntry[];

  /*
   * Work preferences
   */
  workPreferenceProfile:
    PersonWorkPreferenceProfile;

  /*
   * Safety
   */
  safetyProfile:
    PersonSafetyProfile;

  /*
   * System access
   */
  systemAccess:
    PersonSystemAccess;

  /*
   * Documents
   */
  documents:
    PersonDocumentReference[];

  /*
   * Work relationships
   */
  currentWorkOrderIds: string[];

  historicalWorkOrderIds:
    string[];

  failureEventIds: string[];

  assignedAssetIds: string[];

  responsibleEquipmentClassIds:
    string[];

  contractorId: string | null;

  supplierId: string | null;

  /*
   * Performance
   */
  performanceMetrics:
    PersonPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    PersonMieProfile;

  /*
   * General
   */
  profileImageUrl: string;

  tags: string[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreatePersonInput =
  Omit<
    Person,
    | "id"
    | "performanceMetrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdatePersonInput =
  Partial<CreatePersonInput>;

export type PersonRepositoryResult = {
  success: boolean;

  person: Person | null;

  message: string;
};

export const defaultPersonOrganizationalAssignment:
  PersonOrganizationalAssignment = {
  plantId: null,

  plantName: "",

  departmentId: null,

  departmentName: "",

  teamId: null,

  teamName: "",

  functionalLocationIds: [],

  primaryFunctionalLocationId:
    null,

  costCenter: "",

  managerPersonId: null,

  managerName: "",

  supervisorPersonId: null,

  supervisorName: "",
};

export const defaultPersonContactInformation:
  PersonContactInformation = {
  workEmail: "",

  personalEmail: "",

  workPhone: "",

  mobilePhone: "",

  emergencyPhone: "",

  preferredContactMethod:
    "phone",

  preferredLanguage: "he",

  address: "",

  city: "",

  country: "Israel",

  notes: "",
};

export const defaultPersonAvailability:
  PersonAvailability = {
  status: "available",

  shiftType: "day",

  shiftStartTime: "",

  shiftEndTime: "",

  workingDays: [],

  availableFrom: null,

  availableUntil: null,

  onCall: false,

  onCallFrom: null,

  onCallUntil: null,

  leaveStartDate: null,

  leaveEndDate: null,

  leaveReason: "",

  maximumDailyHours: 9,

  maximumWeeklyHours: 45,

  overtimeAllowed: true,

  nightShiftAllowed: false,

  weekendWorkAllowed: false,

  emergencyCalloutAllowed:
    false,

  notes: "",
};

export const defaultPersonWorkPreferenceProfile:
  PersonWorkPreferenceProfile = {
  preferredWorkStyle: [],

  preferredShiftTypes: [],

  preferredEquipmentClassIds: [],

  preferredManufacturerNames: [],

  preferredWorkOrderTypes: [],

  preferredTaskTypes: [],

  canTravel: false,

  travelRadiusKm: null,

  remoteSupportAvailable:
    false,

  workshopWorkAvailable:
    true,

  fieldWorkAvailable:
    true,

  notes: "",
};

export const defaultPersonSafetyProfile:
  PersonSafetyProfile = {
  emergencyRoles: [],

  lotoAuthorized: false,

  electricalAuthorized: false,

  hotWorkAuthorized: false,

  confinedSpaceAuthorized:
    false,

  workingAtHeightAuthorized:
    false,

  liftingAuthorized: false,

  firstAidQualified: false,

  medicalClearanceRequired:
    false,

  medicalClearanceValid:
    false,

  medicalClearanceExpirationDate:
    null,

  ppeIssued: [],

  safetyRestrictions: [],

  safetyNotes: "",
};

export const defaultPersonSystemAccess:
  PersonSystemAccess = {
  userId: null,

  username: "",

  systemRoleIds: [],

  mobileAccessEnabled:
    false,

  webAccessEnabled: true,

  adminAccess: false,

  canCreateRequests: true,

  canCreateWorkOrders: false,

  canApproveWorkOrders: false,

  canCloseWorkOrders: false,

  canManageInventory: false,

  canManageAssets: false,

  canManagePeople: false,

  canManageSkills: false,

  canManageCertifications:
    false,

  canViewCosts: false,

  canViewSafetyInformation:
    false,

  lastLoginAt: null,

  accessSuspended: false,

  suspensionReason: "",
};

export const defaultPersonPerformanceMetrics:
  PersonPerformanceMetrics = {
  assignedWorkOrderCount: 0,

  completedWorkOrderCount: 0,

  openWorkOrderCount: 0,

  overdueWorkOrderCount: 0,

  emergencyWorkOrderCount: 0,

  successfulRepairCount: 0,

  repeatFailureCount: 0,

  firstTimeFixRatePercent: 0,

  repairSuccessRatePercent: 0,

  averageResponseTimeMinutes: 0,

  averageRepairTimeHours: 0,

  averageWorkOrderCompletionHours:
    0,

  totalLaborHours: 0,

  overtimeHours: 0,

  safetyIncidentCount: 0,

  qualityIssueCount: 0,

  trainingHours: 0,

  qualificationCoveragePercent: 0,

  workOrderApprovalCount: 0,

  workOrderRejectionCount: 0,

  lastWorkOrderAt: null,
};

export const defaultPersonMieProfile:
  PersonMieProfile = {
  expertiseScore: 0,

  reliabilityScore: 0,

  availabilityScore: 0,

  safetyScore: 0,

  overallMatchScore: 0,

  preferredFailureModeIds: [],

  experiencedFailureModeIds: [],

  successfulFailureModeIds: [],

  preferredAssetIds: [],

  experiencedAssetIds: [],

  preferredEquipmentClassIds: [],

  experiencedEquipmentClassIds: [],

  recommendedAssignmentTypes: [],

  assignmentRestrictions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultPerson:
  CreatePersonInput = {
  personNumber: "",

  employeeNumber: "",

  firstName: "",

  lastName: "",

  displayName: "",

  jobTitle: "",

  personType: "employee",

  employmentType: "full-time",

  status: "active",

  active: true,

  primaryRole: "technician",

  secondaryRoles: [],

  primaryDiscipline:
    "mechanical",

  secondaryDisciplines: [],

  hireDate: null,

  terminationDate: null,

  seniorityDate: null,

  employmentStartDate: null,

  employmentEndDate: null,

  positionCode: "",

  organizationName: "",

  organizationalAssignment:
    defaultPersonOrganizationalAssignment,

  contactInformation:
    defaultPersonContactInformation,

  emergencyContacts: [],

  availability:
    defaultPersonAvailability,

  skills: [],

  certifications: [],

  authorizations: [],

  trainingRecords: [],

  workHistory: [],

  workPreferenceProfile:
    defaultPersonWorkPreferenceProfile,

  safetyProfile:
    defaultPersonSafetyProfile,

  systemAccess:
    defaultPersonSystemAccess,

  documents: [],

  currentWorkOrderIds: [],

  historicalWorkOrderIds: [],

  failureEventIds: [],

  assignedAssetIds: [],

  responsibleEquipmentClassIds:
    [],

  contractorId: null,

  supplierId: null,

  profileImageUrl: "",

  tags: [],

  notes: "",
};