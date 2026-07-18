export type ContractorStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "blocked"
  | "expired"
  | "archived";

export type ContractorType =
  | "maintenance"
  | "mechanical"
  | "electrical"
  | "automation"
  | "instrumentation"
  | "civil"
  | "hvac"
  | "utilities"
  | "safety"
  | "inspection"
  | "calibration"
  | "lifting"
  | "cleaning"
  | "construction"
  | "engineering"
  | "consulting"
  | "manufacturer-service"
  | "supplier-service"
  | "temporary-labor"
  | "other";

export type ContractorPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ContractorRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ContractorApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "expired";

export type ContractorVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "expired";

export type ContractorAvailabilityStatus =
  | "available"
  | "limited"
  | "busy"
  | "unavailable"
  | "on-call"
  | "unknown";

export type ContractorServiceType =
  | "preventive"
  | "corrective"
  | "emergency"
  | "inspection"
  | "calibration"
  | "installation"
  | "commissioning"
  | "overhaul"
  | "repair"
  | "engineering"
  | "training"
  | "consulting"
  | "project"
  | "other";

export type ContractorDocumentType =
  | "contract"
  | "insurance"
  | "license"
  | "certificate"
  | "safety-approval"
  | "tax-document"
  | "bank-details"
  | "nda"
  | "service-agreement"
  | "authorization"
  | "personnel-list"
  | "equipment-list"
  | "risk-assessment"
  | "method-statement"
  | "permit"
  | "other";

export type ContractorBillingType =
  | "hourly"
  | "daily"
  | "fixed-price"
  | "per-work-order"
  | "retainer"
  | "subscription"
  | "unit-price"
  | "mixed"
  | "other";

export type ContractorScopeType =
  | "organization"
  | "plant"
  | "department"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "work-order-type"
  | "failure-mode"
  | "project"
  | "other";

export type ContractorContact = {
  id: string;

  fullName: string;

  jobTitle: string;

  role:
    | "account-manager"
    | "service-manager"
    | "technical-contact"
    | "technician"
    | "dispatcher"
    | "billing"
    | "safety"
    | "emergency"
    | "management"
    | "other";

  email: string;

  phone: string;

  mobilePhone: string;

  whatsappPhone: string;

  emergencyContact: boolean;

  primary: boolean;

  active: boolean;

  notes: string;
};

export type ContractorPerson = {
  id: string;

  personId: string | null;

  externalPersonCode: string;

  firstName: string;

  lastName: string;

  displayName: string;

  jobTitle: string;

  primaryDiscipline: string;

  skillIds: string[];

  certificationIds: string[];

  authorizationIds: string[];

  active: boolean;

  approvedForSite: boolean;

  approvalStatus:
    ContractorApprovalStatus;

  validFrom: string | null;

  validUntil: string | null;

  notes: string;
};

export type ContractorService = {
  id: string;

  serviceCode: string;

  serviceName: string;

  description: string;

  serviceType:
    ContractorServiceType;

  active: boolean;

  emergencyAvailable: boolean;

  onCallAvailable: boolean;

  responseTimeHours:
    number | null;

  targetArrivalTimeHours:
    number | null;

  minimumCalloutHours:
    number | null;

  billingType:
    ContractorBillingType;

  hourlyRate: number | null;

  fixedPrice: number | null;

  currency: string;

  workOrderTypeIds: string[];

  equipmentClassIds: string[];

  assetIds: string[];

  failureModeIds: string[];

  notes: string;
};

export type ContractorScope = {
  id: string;

  scopeType:
    ContractorScopeType;

  scopeId: string;

  scopeCode: string;

  scopeName: string;

  primary: boolean;

  priority:
    ContractorPriority;

  validFrom: string | null;

  validUntil: string | null;

  notes: string;
};

export type ContractorDocument = {
  id: string;

  documentId: string | null;

  documentType:
    ContractorDocumentType;

  documentNumber: string;

  title: string;

  description: string;

  issueDate: string | null;

  validFrom: string | null;

  validUntil: string | null;

  mandatory: boolean;

  verified: boolean;

  verificationStatus:
    ContractorVerificationStatus;

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  confidential: boolean;

  notes: string;
};

export type ContractorInsurance = {
  id: string;

  insuranceType:
    | "general-liability"
    | "professional-liability"
    | "employers-liability"
    | "vehicle"
    | "equipment"
    | "product-liability"
    | "other";

  providerName: string;

  policyNumber: string;

  coverageAmount:
    number | null;

  currency: string;

  validFrom: string | null;

  validUntil: string | null;

  verified: boolean;

  documentId: string | null;

  notes: string;
};

export type ContractorCertificationRequirement = {
  id: string;

  certificationId: string;

  certificationCode: string;

  certificationName: string;

  minimumQualifiedPeople:
    number;

  mandatory: boolean;

  safetyCritical: boolean;

  blockAssignmentWhenMissing:
    boolean;

  notes: string;
};

export type ContractorSkillRequirement = {
  id: string;

  skillId: string;

  skillCode: string;

  skillName: string;

  minimumQualifiedPeople:
    number;

  mandatory: boolean;

  critical: boolean;

  notes: string;
};

export type ContractorSafetyProfile = {
  siteInductionRequired:
    boolean;

  siteInductionValid:
    boolean;

  riskAssessmentRequired:
    boolean;

  methodStatementRequired:
    boolean;

  permitToWorkRequired:
    boolean;

  lotoAuthorizationRequired:
    boolean;

  hotWorkAuthorizationRequired:
    boolean;

  confinedSpaceAuthorizationRequired:
    boolean;

  workingAtHeightAuthorizationRequired:
    boolean;

  electricalAuthorizationRequired:
    boolean;

  liftingAuthorizationRequired:
    boolean;

  ppeRequirements: string[];

  safetyRestrictions: string[];

  safetyNotes: string;
};

export type ContractorAvailability = {
  status:
    ContractorAvailabilityStatus;

  regularWorkingDays: number[];

  workingHoursStart: string;

  workingHoursEnd: string;

  onCallAvailable: boolean;

  emergencyAvailable: boolean;

  weekendAvailable: boolean;

  nightAvailable: boolean;

  maximumParallelJobs:
    number;

  currentActiveJobs: number;

  estimatedNextAvailability:
    string | null;

  notes: string;
};

export type ContractorCommercialTerms = {
  supplierNumber: string;

  purchaseOrderRequired:
    boolean;

  blanketPurchaseOrderNumber:
    string;

  paymentTermsDays: number;

  defaultBillingType:
    ContractorBillingType;

  defaultHourlyRate:
    number | null;

  defaultDailyRate:
    number | null;

  calloutFee: number | null;

  travelRatePerKm:
    number | null;

  overtimeMultiplier:
    number;

  nightMultiplier:
    number;

  weekendMultiplier:
    number;

  currency: string;

  minimumCharge:
    number | null;

  contractStartDate:
    string | null;

  contractEndDate:
    string | null;

  automaticRenewal: boolean;

  notes: string;
};

export type ContractorSla = {
  enabled: boolean;

  emergencyResponseMinutes:
    number | null;

  highPriorityResponseMinutes:
    number | null;

  mediumPriorityResponseMinutes:
    number | null;

  lowPriorityResponseMinutes:
    number | null;

  emergencyArrivalHours:
    number | null;

  standardArrivalHours:
    number | null;

  targetResolutionHours:
    number | null;

  availabilityPercent:
    number | null;

  penaltyEnabled: boolean;

  penaltyDescription: string;

  notes: string;
};

export type ContractorPerformanceMetrics = {
  assignedWorkOrderCount: number;

  completedWorkOrderCount: number;

  openWorkOrderCount: number;

  overdueWorkOrderCount: number;

  emergencyWorkOrderCount: number;

  successfulRepairCount: number;

  repeatFailureCount: number;

  rejectedWorkOrderCount: number;

  firstTimeFixRatePercent:
    number;

  repairSuccessRatePercent:
    number;

  averageResponseTimeMinutes:
    number;

  averageArrivalTimeHours:
    number;

  averageRepairTimeHours:
    number;

  averageWorkOrderCompletionHours:
    number;

  slaCompliancePercent: number;

  totalLaborHours: number;

  totalCost: number;

  averageCostPerWorkOrder:
    number;

  safetyIncidentCount: number;

  qualityIssueCount: number;

  complaintCount: number;

  rating: number;

  lastWorkOrderAt: string | null;
};

export type ContractorMieProfile = {
  expertiseScore: number;

  reliabilityScore: number;

  responseScore: number;

  costScore: number;

  safetyScore: number;

  qualityScore: number;

  overallMatchScore: number;

  experiencedAssetIds: string[];

  experiencedEquipmentClassIds:
    string[];

  experiencedFailureModeIds:
    string[];

  successfulFailureModeIds:
    string[];

  recommendedAssetIds: string[];

  recommendedEquipmentClassIds:
    string[];

  recommendedFailureModeIds:
    string[];

  assignmentRestrictions:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type Contractor = {
  id: string;

  /*
   * Identification
   */
  contractorNumber: string;

  contractorCode: string;

  displayName: string;

  legalName: string;

  registrationNumber: string;

  taxNumber: string;

  description: string;

  /*
   * Classification
   */
  contractorType:
    ContractorType;

  status:
    ContractorStatus;

  active: boolean;

  priority:
    ContractorPriority;

  riskLevel:
    ContractorRiskLevel;

  preferredSupplier: boolean;

  approvedSupplier: boolean;

  approvalStatus:
    ContractorApprovalStatus;

  /*
   * Organization
   */
  country: string;

  city: string;

  address: string;

  websiteUrl: string;

  parentCompanyName: string;

  /*
   * Contacts
   */
  contacts:
    ContractorContact[];

  /*
   * Personnel
   */
  people:
    ContractorPerson[];

  /*
   * Services
   */
  services:
    ContractorService[];

  scopes:
    ContractorScope[];

  /*
   * Requirements
   */
  skillRequirements:
    ContractorSkillRequirement[];

  certificationRequirements:
    ContractorCertificationRequirement[];

  /*
   * Safety
   */
  safetyProfile:
    ContractorSafetyProfile;

  /*
   * Documents
   */
  documents:
    ContractorDocument[];

  insurances:
    ContractorInsurance[];

  /*
   * Availability
   */
  availability:
    ContractorAvailability;

  /*
   * Commercial
   */
  commercialTerms:
    ContractorCommercialTerms;

  /*
   * SLA
   */
  sla:
    ContractorSla;

  /*
   * Relationships
   */
  supportedPlantIds: string[];

  supportedDepartmentIds:
    string[];

  supportedFunctionalLocationIds:
    string[];

  supportedEquipmentClassIds:
    string[];

  supportedAssetIds: string[];

  supportedFailureModeIds:
    string[];

  assignedTeamIds: string[];

  workOrderIds: string[];

  projectIds: string[];

  /*
   * Performance
   */
  performanceMetrics:
    ContractorPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    ContractorMieProfile;

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

export type CreateContractorInput =
  Omit<
    Contractor,
    | "id"
    | "performanceMetrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateContractorInput =
  Partial<CreateContractorInput>;

export type ContractorRepositoryResult = {
  success: boolean;

  contractor: Contractor | null;

  message: string;
};

export const defaultContractorSafetyProfile:
  ContractorSafetyProfile = {
  siteInductionRequired:
    true,

  siteInductionValid: false,

  riskAssessmentRequired:
    true,

  methodStatementRequired:
    false,

  permitToWorkRequired:
    true,

  lotoAuthorizationRequired:
    false,

  hotWorkAuthorizationRequired:
    false,

  confinedSpaceAuthorizationRequired:
    false,

  workingAtHeightAuthorizationRequired:
    false,

  electricalAuthorizationRequired:
    false,

  liftingAuthorizationRequired:
    false,

  ppeRequirements: [],

  safetyRestrictions: [],

  safetyNotes: "",
};

export const defaultContractorAvailability:
  ContractorAvailability = {
  status: "available",

  regularWorkingDays: [],

  workingHoursStart: "",

  workingHoursEnd: "",

  onCallAvailable: false,

  emergencyAvailable: false,

  weekendAvailable: false,

  nightAvailable: false,

  maximumParallelJobs: 1,

  currentActiveJobs: 0,

  estimatedNextAvailability:
    null,

  notes: "",
};

export const defaultContractorCommercialTerms:
  ContractorCommercialTerms = {
  supplierNumber: "",

  purchaseOrderRequired:
    true,

  blanketPurchaseOrderNumber:
    "",

  paymentTermsDays: 30,

  defaultBillingType:
    "hourly",

  defaultHourlyRate: null,

  defaultDailyRate: null,

  calloutFee: null,

  travelRatePerKm: null,

  overtimeMultiplier: 1.5,

  nightMultiplier: 1.5,

  weekendMultiplier: 2,

  currency: "ILS",

  minimumCharge: null,

  contractStartDate: null,

  contractEndDate: null,

  automaticRenewal: false,

  notes: "",
};

export const defaultContractorSla:
  ContractorSla = {
  enabled: false,

  emergencyResponseMinutes:
    null,

  highPriorityResponseMinutes:
    null,

  mediumPriorityResponseMinutes:
    null,

  lowPriorityResponseMinutes:
    null,

  emergencyArrivalHours: null,

  standardArrivalHours: null,

  targetResolutionHours: null,

  availabilityPercent: null,

  penaltyEnabled: false,

  penaltyDescription: "",

  notes: "",
};

export const defaultContractorPerformanceMetrics:
  ContractorPerformanceMetrics = {
  assignedWorkOrderCount: 0,

  completedWorkOrderCount: 0,

  openWorkOrderCount: 0,

  overdueWorkOrderCount: 0,

  emergencyWorkOrderCount: 0,

  successfulRepairCount: 0,

  repeatFailureCount: 0,

  rejectedWorkOrderCount: 0,

  firstTimeFixRatePercent: 0,

  repairSuccessRatePercent: 0,

  averageResponseTimeMinutes:
    0,

  averageArrivalTimeHours: 0,

  averageRepairTimeHours: 0,

  averageWorkOrderCompletionHours:
    0,

  slaCompliancePercent: 0,

  totalLaborHours: 0,

  totalCost: 0,

  averageCostPerWorkOrder: 0,

  safetyIncidentCount: 0,

  qualityIssueCount: 0,

  complaintCount: 0,

  rating: 0,

  lastWorkOrderAt: null,
};

export const defaultContractorMieProfile:
  ContractorMieProfile = {
  expertiseScore: 0,

  reliabilityScore: 0,

  responseScore: 0,

  costScore: 0,

  safetyScore: 0,

  qualityScore: 0,

  overallMatchScore: 0,

  experiencedAssetIds: [],

  experiencedEquipmentClassIds:
    [],

  experiencedFailureModeIds:
    [],

  successfulFailureModeIds:
    [],

  recommendedAssetIds: [],

  recommendedEquipmentClassIds:
    [],

  recommendedFailureModeIds:
    [],

  assignmentRestrictions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultContractor:
  CreateContractorInput = {
  contractorNumber: "",

  contractorCode: "",

  displayName: "",

  legalName: "",

  registrationNumber: "",

  taxNumber: "",

  description: "",

  contractorType:
    "maintenance",

  status: "active",

  active: true,

  priority: "medium",

  riskLevel: "medium",

  preferredSupplier: false,

  approvedSupplier: false,

  approvalStatus: "pending",

  country: "Israel",

  city: "",

  address: "",

  websiteUrl: "",

  parentCompanyName: "",

  contacts: [],

  people: [],

  services: [],

  scopes: [],

  skillRequirements: [],

  certificationRequirements: [],

  safetyProfile:
    defaultContractorSafetyProfile,

  documents: [],

  insurances: [],

  availability:
    defaultContractorAvailability,

  commercialTerms:
    defaultContractorCommercialTerms,

  sla:
    defaultContractorSla,

  supportedPlantIds: [],

  supportedDepartmentIds: [],

  supportedFunctionalLocationIds:
    [],

  supportedEquipmentClassIds:
    [],

  supportedAssetIds: [],

  supportedFailureModeIds: [],

  assignedTeamIds: [],

  workOrderIds: [],

  projectIds: [],

  tags: [],

  notes: "",
};