export type MaintenanceAssetType =
  | "machine"
  | "infrastructure"
  | "utility"
  | "building"
  | "safety";

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

export type PreventiveMaintenancePlan = {
  id: string;

  planNumber: string;
  title: string;
  description: string;

  assetType: MaintenanceAssetType;

  assetNumber: string;
  assetName: string;
  machineCode: string;

  department: string;
  area: string;

  triggerType: MaintenanceTriggerType;

  frequencyValue: number;
  frequencyUnit: MaintenanceFrequencyUnit;

  meterThreshold: number | null;
  currentMeterValue: number | null;

  priority: MaintenancePriority;
  status: MaintenancePlanStatus;

  responsibleRole: MaintenanceResponsibleRole;
  assignedUserId: string | null;
  assignedUserName: string | null;

  estimatedDurationMinutes: number;

  requiresShutdown: boolean;
  requiresLockoutTagout: boolean;
  requiresPermit: boolean;

  checklist: MaintenanceChecklistItem[];
  requiredParts: MaintenanceRequiredPart[];

  lastCompletedAt: string | null;
  nextDueAt: string | null;

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
  photoUrl: string | null;
};

export type PreventiveMaintenanceExecution = {
  id: string;

  executionNumber: string;
  planId: string;

  assetNumber: string;
  assetName: string;
  machineCode: string;

  planTitle: string;

  scheduledAt: string;
  dueAt: string;

  startedAt: string | null;
  completedAt: string | null;

  status: MaintenanceExecutionStatus;
  priority: MaintenancePriority;

  assignedUserId: string | null;
  assignedUserName: string | null;

  completedByUserId: string | null;
  completedByUserName: string | null;

  checklistResults: MaintenanceChecklistResult[];

  workPerformed: string;
  findings: string;
  recommendations: string;

  replacedParts: MaintenanceRequiredPart[];

  actualDurationMinutes: number | null;

  machineStopped: boolean;
  lockoutTagoutApplied: boolean;

  createdAt: string;
  updatedAt: string;
};

export type MaintenancePlanFormData = {
  title: string;
  description: string;

  assetNumber: string;

  triggerType: MaintenanceTriggerType;
  frequencyValue: number;
  frequencyUnit: MaintenanceFrequencyUnit;

  priority: MaintenancePriority;
  responsibleRole: MaintenanceResponsibleRole;

  estimatedDurationMinutes: number;

  requiresShutdown: boolean;
  requiresLockoutTagout: boolean;
  requiresPermit: boolean;

  checklist: MaintenanceChecklistItem[];
  requiredParts: MaintenanceRequiredPart[];
};

export type MachineMaintenanceSummary = {
  assetNumber: string;

  totalPlans: number;
  activePlans: number;

  upcomingExecutions: number;
  dueExecutions: number;
  overdueExecutions: number;
  inProgressExecutions: number;

  completedLast30Days: number;

  nextExecution:
    | PreventiveMaintenanceExecution
    | null;
};