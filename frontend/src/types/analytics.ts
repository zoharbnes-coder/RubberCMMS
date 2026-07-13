export type AnalyticsSummary = {
  totalWorkOrders: number;

  openWorkOrders: number;

  closedWorkOrders: number;

  pausedWorkOrders: number;

  downtimeWorkOrders: number;

  openDowntimeWorkOrders: number;

  totalDowntimeMinutes: number;

  totalRepairMinutes: number;

  averageResponseMinutes: number;

  averageRepairMinutes: number;

  averageAvailability: number;

  averageMtbfHours: number;

  averageMttrHours: number;
};

export type MachineAnalytics = {
  machineCode: string;

  assetNumber: string;

  displayName: string;

  department: string;

  availability: number;

  mtbfHours: number;

  mttrHours: number;

  openWorkOrders: number;

  downtimeWorkOrders: number;

  totalDowntimeMinutes: number;
};

export type DepartmentAnalytics = {
  department: string;

  machines: number;

  openWorkOrders: number;

  downtimeMinutes: number;
};

export type AnalyticsSnapshot = {
  generatedAt: string;

  summary: AnalyticsSummary;

  machines: MachineAnalytics[];

  departments: DepartmentAnalytics[];
};