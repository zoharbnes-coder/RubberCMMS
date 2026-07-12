export type MachineCriticality =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type MachineStatus =
  | "running"
  | "warning"
  | "alarm"
  | "maintenance";

export type Machine = {
  id: string;

  // זיהוי
  assetNumber: string;      // 311
  machineCode: string;      // MIX-311
  displayName: string;      // White Mixer D9
  shortName: string;        // D9

  // מיקום
  department: string;
  area: string;
  location: string;

  // יצרן
  manufacturer: string;
  model: string;
  serialNumber: string;

  // מידע טכני
  installationDate: string;
  criticality: MachineCriticality;

  // מצב
  active: boolean;
  status: MachineStatus;

  // נתונים חיים
  openWorkOrders: number;
  downtimeWorkOrders: number;

  // KPI
  mttrHours: number;
  mtbfHours: number;
  availability: number;

  // תחזוקה
  preventivePlanCount: number;

  // מחסן
  sparePartsCount: number;

  // מסמכים
  drawings: number;
  manuals: number;
  images: number;
};