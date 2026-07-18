export type TeamStatus =
  | "active"
  | "inactive"
  | "temporary"
  | "archived";

export type TeamType =
  | "maintenance"
  | "mechanical"
  | "electrical"
  | "automation"
  | "instrumentation"
  | "reliability"
  | "planning"
  | "engineering"
  | "utilities"
  | "facility"
  | "production-support"
  | "safety"
  | "quality"
  | "project"
  | "emergency"
  | "contractor"
  | "mixed"
  | "other";

export type TeamMemberRole =
  | "member"
  | "lead"
  | "supervisor"
  | "manager"
  | "planner"
  | "coordinator"
  | "specialist"
  | "on-call"
  | "backup"
  | "temporary"
  | "other";

export type TeamAvailabilityStatus =
  | "available"
  | "partially-available"
  | "busy"
  | "on-call"
  | "off-shift"
  | "unavailable"
  | "unknown";

export type TeamShiftType =
  | "day"
  | "evening"
  | "night"
  | "rotating"
  | "on-call"
  | "office"
  | "flexible"
  | "mixed"
  | "other";

export type TeamPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TeamAssignmentScope =
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

export type TeamMember = {
  id: string;

  personId: string;

  personNumber: string;

  displayName: string;

  role:
    TeamMemberRole;

  primary: boolean;

  active: boolean;

  joinedAt: string | null;

  leftAt: string | null;

  allocationPercent: number;

  onCall: boolean;

  backupMember: boolean;

  notes: string;
};

export type TeamLeadership = {
  managerPersonId: string | null;

  managerName: string;

  supervisorPersonId: string | null;

  supervisorName: string;

  leadPersonId: string | null;

  leadName: string;

  plannerPersonId: string | null;

  plannerName: string;

  coordinatorPersonId: string | null;

  coordinatorName: string;
};

export type TeamOrganizationalAssignment = {
  plantId: string | null;

  plantName: string;

  departmentId: string | null;

  departmentName: string;

  primaryFunctionalLocationId:
    string | null;

  functionalLocationIds:
    string[];

  costCenter: string;

  businessUnit: string;
};

export type TeamResponsibility = {
  id: string;

  scope:
    TeamAssignmentScope;

  scopeId: string;

  scopeCode: string;

  scopeName: string;

  primary: boolean;

  priority:
    TeamPriority;

  validFrom: string | null;

  validUntil: string | null;

  notes: string;
};

export type TeamSkillRequirement = {
  id: string;

  skillId: string;

  skillCode: string;

  skillName: string;

  minimumQualifiedPeople:
    number;

  preferredQualifiedPeople:
    number;

  mandatory: boolean;

  critical: boolean;

  notes: string;
};

export type TeamCertificationRequirement = {
  id: string;

  certificationId: string;

  certificationCode: string;

  certificationName: string;

  minimumValidPeople:
    number;

  mandatory: boolean;

  safetyCritical: boolean;

  blockAssignmentWhenMissing:
    boolean;

  notes: string;
};

export type TeamAvailability = {
  status:
    TeamAvailabilityStatus;

  shiftType:
    TeamShiftType;

  shiftStartTime: string;

  shiftEndTime: string;

  workingDays: number[];

  availableFrom: string | null;

  availableUntil: string | null;

  onCallEnabled: boolean;

  onCallStartTime: string;

  onCallEndTime: string;

  emergencyResponseEnabled:
    boolean;

  maximumParallelWorkOrders:
    number;

  currentAssignedWorkOrders:
    number;

  currentAvailablePeople:
    number;

  notes: string;
};

export type TeamCapacity = {
  totalMembers: number;

  activeMembers: number;

  availableMembers: number;

  qualifiedMembers: number;

  onCallMembers: number;

  plannedLaborHoursPerDay:
    number;

  plannedLaborHoursPerWeek:
    number;

  availableLaborHoursToday:
    number;

  assignedLaborHoursToday:
    number;

  availableLaborHoursWeek:
    number;

  assignedLaborHoursWeek:
    number;

  utilizationPercent: number;

  overtimeCapacityHours:
    number;
};

export type TeamWorkOrderRules = {
  allowedWorkOrderTypes:
    string[];

  preferredWorkOrderTypes:
    string[];

  restrictedWorkOrderTypes:
    string[];

  allowedPriorityLevels:
    string[];

  maximumConcurrentWorkOrders:
    number;

  autoAssignmentEnabled:
    boolean;

  emergencyAutoAssignment:
    boolean;

  requireSupervisorApproval:
    boolean;

  requireQualifiedMember:
    boolean;

  requireValidCertification:
    boolean;

  allowExternalSupport:
    boolean;

  allowCrossTeamAssignment:
    boolean;

  notes: string;
};

export type TeamEscalationRule = {
  id: string;

  triggerType:
    | "priority"
    | "response-delay"
    | "repair-delay"
    | "skill-gap"
    | "certification-gap"
    | "capacity"
    | "safety"
    | "repeat-failure"
    | "other";

  thresholdValue:
    number | null;

  thresholdUnit:
    | "minutes"
    | "hours"
    | "days"
    | "percent"
    | "count"
    | "none";

  escalateToTeamId:
    string | null;

  escalateToPersonId:
    string | null;

  escalateToRole: string;

  notificationRequired:
    boolean;

  active: boolean;

  notes: string;
};

export type TeamContactInformation = {
  email: string;

  phone: string;

  mobilePhone: string;

  emergencyPhone: string;

  radioChannel: string;

  whatsappGroupName: string;

  notes: string;
};

export type TeamPerformanceMetrics = {
  assignedWorkOrderCount: number;

  completedWorkOrderCount: number;

  openWorkOrderCount: number;

  overdueWorkOrderCount: number;

  emergencyWorkOrderCount: number;

  preventiveWorkOrderCount: number;

  correctiveWorkOrderCount: number;

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

  utilizationPercent: number;

  plannedVsActualHoursPercent:
    number;

  slaCompliancePercent: number;

  safetyIncidentCount: number;

  qualityIssueCount: number;

  lastWorkOrderAt: string | null;
};

export type TeamSkillCoverage = {
  requiredSkillCount: number;

  coveredSkillCount: number;

  missingSkillCount: number;

  criticalMissingSkillCount:
    number;

  coveragePercent: number;
};

export type TeamCertificationCoverage = {
  requiredCertificationCount:
    number;

  coveredCertificationCount:
    number;

  missingCertificationCount:
    number;

  expiringCertificationCount:
    number;

  coveragePercent: number;
};

export type TeamMieProfile = {
  expertiseScore: number;

  availabilityScore: number;

  reliabilityScore: number;

  safetyScore: number;

  workloadScore: number;

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

export type Team = {
  id: string;

  /*
   * Identification
   */
  teamNumber: string;

  teamCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  teamType:
    TeamType;

  status:
    TeamStatus;

  active: boolean;

  /*
   * Organization
   */
  organizationalAssignment:
    TeamOrganizationalAssignment;

  leadership:
    TeamLeadership;

  /*
   * Members
   */
  members:
    TeamMember[];

  /*
   * Responsibilities
   */
  responsibilities:
    TeamResponsibility[];

  primaryAssetIds: string[];

  supportedAssetIds: string[];

  equipmentClassIds: string[];

  failureModeIds: string[];

  /*
   * Competency requirements
   */
  skillRequirements:
    TeamSkillRequirement[];

  certificationRequirements:
    TeamCertificationRequirement[];

  /*
   * Availability
   */
  availability:
    TeamAvailability;

  capacity:
    TeamCapacity;

  /*
   * Work order behavior
   */
  workOrderRules:
    TeamWorkOrderRules;

  escalationRules:
    TeamEscalationRule[];

  /*
   * Contact
   */
  contactInformation:
    TeamContactInformation;

  /*
   * Relationships
   */
  parentTeamId: string | null;

  childTeamIds: string[];

  backupTeamIds: string[];

  supportTeamIds: string[];

  contractorIds: string[];

  /*
   * Performance
   */
  performanceMetrics:
    TeamPerformanceMetrics;

  skillCoverage:
    TeamSkillCoverage;

  certificationCoverage:
    TeamCertificationCoverage;

  /*
   * Intelligence
   */
  mieProfile:
    TeamMieProfile;

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

export type CreateTeamInput =
  Omit<
    Team,
    | "id"
    | "performanceMetrics"
    | "skillCoverage"
    | "certificationCoverage"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateTeamInput =
  Partial<CreateTeamInput>;

export type TeamRepositoryResult = {
  success: boolean;

  team: Team | null;

  message: string;
};

export const defaultTeamOrganizationalAssignment:
  TeamOrganizationalAssignment = {
  plantId: null,

  plantName: "",

  departmentId: null,

  departmentName: "",

  primaryFunctionalLocationId:
    null,

  functionalLocationIds: [],

  costCenter: "",

  businessUnit: "",
};

export const defaultTeamLeadership:
  TeamLeadership = {
  managerPersonId: null,

  managerName: "",

  supervisorPersonId: null,

  supervisorName: "",

  leadPersonId: null,

  leadName: "",

  plannerPersonId: null,

  plannerName: "",

  coordinatorPersonId: null,

  coordinatorName: "",
};

export const defaultTeamAvailability:
  TeamAvailability = {
  status: "available",

  shiftType: "day",

  shiftStartTime: "",

  shiftEndTime: "",

  workingDays: [],

  availableFrom: null,

  availableUntil: null,

  onCallEnabled: false,

  onCallStartTime: "",

  onCallEndTime: "",

  emergencyResponseEnabled:
    false,

  maximumParallelWorkOrders: 1,

  currentAssignedWorkOrders: 0,

  currentAvailablePeople: 0,

  notes: "",
};

export const defaultTeamCapacity:
  TeamCapacity = {
  totalMembers: 0,

  activeMembers: 0,

  availableMembers: 0,

  qualifiedMembers: 0,

  onCallMembers: 0,

  plannedLaborHoursPerDay: 0,

  plannedLaborHoursPerWeek: 0,

  availableLaborHoursToday: 0,

  assignedLaborHoursToday: 0,

  availableLaborHoursWeek: 0,

  assignedLaborHoursWeek: 0,

  utilizationPercent: 0,

  overtimeCapacityHours: 0,
};

export const defaultTeamWorkOrderRules:
  TeamWorkOrderRules = {
  allowedWorkOrderTypes: [],

  preferredWorkOrderTypes: [],

  restrictedWorkOrderTypes: [],

  allowedPriorityLevels: [],

  maximumConcurrentWorkOrders: 1,

  autoAssignmentEnabled: false,

  emergencyAutoAssignment: false,

  requireSupervisorApproval:
    false,

  requireQualifiedMember: true,

  requireValidCertification:
    true,

  allowExternalSupport: true,

  allowCrossTeamAssignment:
    true,

  notes: "",
};

export const defaultTeamContactInformation:
  TeamContactInformation = {
  email: "",

  phone: "",

  mobilePhone: "",

  emergencyPhone: "",

  radioChannel: "",

  whatsappGroupName: "",

  notes: "",
};

export const defaultTeamPerformanceMetrics:
  TeamPerformanceMetrics = {
  assignedWorkOrderCount: 0,

  completedWorkOrderCount: 0,

  openWorkOrderCount: 0,

  overdueWorkOrderCount: 0,

  emergencyWorkOrderCount: 0,

  preventiveWorkOrderCount: 0,

  correctiveWorkOrderCount: 0,

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

  utilizationPercent: 0,

  plannedVsActualHoursPercent: 0,

  slaCompliancePercent: 0,

  safetyIncidentCount: 0,

  qualityIssueCount: 0,

  lastWorkOrderAt: null,
};

export const defaultTeamSkillCoverage:
  TeamSkillCoverage = {
  requiredSkillCount: 0,

  coveredSkillCount: 0,

  missingSkillCount: 0,

  criticalMissingSkillCount: 0,

  coveragePercent: 0,
};

export const defaultTeamCertificationCoverage:
  TeamCertificationCoverage = {
  requiredCertificationCount: 0,

  coveredCertificationCount: 0,

  missingCertificationCount: 0,

  expiringCertificationCount: 0,

  coveragePercent: 0,
};

export const defaultTeamMieProfile:
  TeamMieProfile = {
  expertiseScore: 0,

  availabilityScore: 0,

  reliabilityScore: 0,

  safetyScore: 0,

  workloadScore: 0,

  overallMatchScore: 0,

  experiencedAssetIds: [],

  experiencedEquipmentClassIds: [],

  experiencedFailureModeIds: [],

  successfulFailureModeIds: [],

  recommendedAssetIds: [],

  recommendedEquipmentClassIds: [],

  recommendedFailureModeIds: [],

  assignmentRestrictions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultTeam:
  CreateTeamInput = {
  teamNumber: "",

  teamCode: "",

  displayName: "",

  shortName: "",

  description: "",

  teamType: "maintenance",

  status: "active",

  active: true,

  organizationalAssignment:
    defaultTeamOrganizationalAssignment,

  leadership:
    defaultTeamLeadership,

  members: [],

  responsibilities: [],

  primaryAssetIds: [],

  supportedAssetIds: [],

  equipmentClassIds: [],

  failureModeIds: [],

  skillRequirements: [],

  certificationRequirements: [],

  availability:
    defaultTeamAvailability,

  capacity:
    defaultTeamCapacity,

  workOrderRules:
    defaultTeamWorkOrderRules,

  escalationRules: [],

  contactInformation:
    defaultTeamContactInformation,

  parentTeamId: null,

  childTeamIds: [],

  backupTeamIds: [],

  supportTeamIds: [],

  contractorIds: [],

  tags: [],

  notes: "",
};