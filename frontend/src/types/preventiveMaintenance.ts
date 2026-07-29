export type MaintenanceAssetType =
  | "machine"
  | "production_line"
  | "infrastructure"
  | "utility"
  | "building"
  | "component"
  | "safety"
  | "other";

export type MaintenanceTriggerType =
  | "calendar"
  | "operating_hours"
  | "cycles"
  | "condition";

export type MaintenanceFrequencyUnit =
  | "day"
  | "week"
  | "month"
  | "year"
  | "hour"
  | "cycle";

export type MaintenancePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MaintenancePlanStatus =
  | "active"
  | "inactive"
  | "draft";

export type MaintenanceExecutionStatus =
  | "upcoming"
  | "due"
  | "overdue"
  | "in_progress"
  | "completed"
  | "cancelled";

export type MaintenanceResponsibleRole =
  | "mechanic"
  | "electrician"
  | "technician"
  | "contractor"
  | "operator"
  | "engineer";

export type MaintenanceChecklistItem = {
  id: string;

  order: number;

  title: string;

  description: string;

  required: boolean;

  expectedValue: string;

  unit: string;

  requiresPhoto: boolean;

  requiresMeasurement: boolean;
};

export type MaintenanceRequiredPart = {
  id: string;

  itemCode: string;

  description: string;

  quantity: number;

  unit: string;

  isMandatory: boolean;
};

/*
 * Preventive Maintenance Plan
 *
 * Asset is the single source of truth.
 *
 * No Machine legacy identity is kept.
 */
export type PreventiveMaintenancePlan = {
  id: string;

  planNumber: string;

  title: string;

  description: string;

  /*
   * Asset identity
   */
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  assetType:
    MaintenanceAssetType;

  /*
   * Organizational context
   */
  department: string;

  area: string;

  /*
   * Trigger
   */
  triggerType:
    MaintenanceTriggerType;

  frequencyValue: number;

  frequencyUnit:
    MaintenanceFrequencyUnit;

  meterThreshold:
    number | null;

  currentMeterValue:
    number | null;

  /*
   * Plan management
   */
  priority:
    MaintenancePriority;

  status:
    MaintenancePlanStatus;

  responsibleRole:
    MaintenanceResponsibleRole;

  assignedUserId:
    string | null;

  assignedUserName:
    string | null;

  estimatedDurationMinutes:
    number;

  /*
   * Safety / operational requirements
   */
  requiresShutdown: boolean;

  requiresLockoutTagout:
    boolean;

  requiresPermit: boolean;

  /*
   * Work content
   */
  checklist:
    MaintenanceChecklistItem[];

  requiredParts:
    MaintenanceRequiredPart[];

  /*
   * Scheduling
   */
  lastCompletedAt:
    string | null;

  nextDueAt:
    string | null;

  /*
   * Audit
   */
  createdAt: string;

  createdBy: string;

  updatedAt: string;

  updatedBy: string;
};

export type MaintenanceChecklistResult = {
  checklistItemId: string;

  completed: boolean;

  result: string;

  measurementValue: string;

  notes: string;

  photoUrl:
    string | null;
};

/*
 * A scheduled / actual PM execution.
 *
 * Execution carries Asset identity so its
 * historical record remains understandable
 * even if the Asset master data later changes.
 */
export type PreventiveMaintenanceExecution = {
  id: string;

  executionNumber: string;

  planId: string;

  /*
   * Asset identity
   */
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  /*
   * Plan snapshot
   */
  planTitle: string;

  /*
   * Schedule
   */
  scheduledAt: string;

  dueAt: string;

  startedAt:
    string | null;

  completedAt:
    string | null;

  status:
    MaintenanceExecutionStatus;

  priority:
    MaintenancePriority;

  /*
   * Assignment
   */
  assignedUserId:
    string | null;

  assignedUserName:
    string | null;

  completedByUserId:
    string | null;

  completedByUserName:
    string | null;

  /*
   * Execution results
   */
  checklistResults:
    MaintenanceChecklistResult[];

  workPerformed: string;

  findings: string;

  recommendations: string;

  replacedParts:
    MaintenanceRequiredPart[];

  actualDurationMinutes:
    number | null;

  /*
   * Operational / safety state
   */
  assetStopped: boolean;

  lockoutTagoutApplied:
    boolean;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type MaintenancePlanFormData = {
  /*
   * Plan
   */
  title: string;

  description: string;

  /*
   * Asset
   */
  assetId: string;

  /*
   * Trigger
   */
  triggerType:
    MaintenanceTriggerType;

  frequencyValue: number;

  frequencyUnit:
    MaintenanceFrequencyUnit;

  priority:
    MaintenancePriority;

  responsibleRole:
    MaintenanceResponsibleRole;

  estimatedDurationMinutes:
    number;

  requiresShutdown: boolean;

  requiresLockoutTagout:
    boolean;

  requiresPermit: boolean;

  checklist:
    MaintenanceChecklistItem[];

  requiredParts:
    MaintenanceRequiredPart[];
};

export type AssetMaintenanceSummary = {
  assetId: string;

  assetCode: string;

  assetNumber: string;

  totalPlans: number;

  activePlans: number;

  upcomingExecutions:
    number;

  dueExecutions:
    number;

  overdueExecutions:
    number;

  inProgressExecutions:
    number;

  completedLast30Days:
    number;

  nextExecution:
    | PreventiveMaintenanceExecution
    | null;
};