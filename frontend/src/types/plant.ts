export type PlantStatus =
  | "active"
  | "inactive"
  | "commissioning"
  | "shutdown";

export type PlantIndustry =
  | "rubber"
  | "plastics"
  | "food"
  | "pharmaceutical"
  | "metal"
  | "chemical"
  | "automotive"
  | "energy"
  | "logistics"
  | "other";

export type PlantAddress = {
  country: string;
  city: string;
  street: string;
  postalCode: string;
};

export type PlantContact = {
  name: string;
  role: string;
  phone: string;
  email: string;
};

export type PlantOperatingSchedule = {
  workingDays: number[];

  shiftsPerDay: number;

  firstShiftStart: string;
  secondShiftStart: string;
  thirdShiftStart: string;

  hoursPerShift: number;

  operatesOnWeekends: boolean;
  operatesOnHolidays: boolean;
};

export type Plant = {
  id: string;

  /*
   * Identification
   */
  plantNumber: string;
  plantCode: string;

  displayName: string;
  shortName: string;

  /*
   * Classification
   */
  industry: PlantIndustry;
  status: PlantStatus;

  active: boolean;

  /*
   * Location
   */
  address: PlantAddress;

  latitude: number | null;
  longitude: number | null;

  timezone: string;

  /*
   * Contact information
   */
  primaryContact: PlantContact | null;

  /*
   * Operational structure
   */
  operatingSchedule:
    PlantOperatingSchedule;

  /*
   * Production and maintenance context
   */
  employeeCount: number;

  maintenanceEmployeeCount: number;

  productionLinesCount: number;

  assetCount: number;

  /*
   * Organizational information
   */
  companyName: string;
  businessUnit: string;

  /*
   * General information
   */
  description: string;
  notes: string;

  /*
   * Audit information
   */
  createdAt: string;
  updatedAt: string;
};

export type CreatePlantInput = {
  plantNumber: string;
  plantCode: string;

  displayName: string;
  shortName: string;

  industry: PlantIndustry;
  status: PlantStatus;

  active: boolean;

  address: PlantAddress;

  latitude: number | null;
  longitude: number | null;

  timezone: string;

  primaryContact: PlantContact | null;

  operatingSchedule:
    PlantOperatingSchedule;

  employeeCount: number;

  maintenanceEmployeeCount: number;

  productionLinesCount: number;

  companyName: string;
  businessUnit: string;

  description: string;
  notes: string;
};

export type UpdatePlantInput =
  Partial<CreatePlantInput>;

export type PlantRepositoryResult = {
  success: boolean;
  plant: Plant | null;
  message: string;
};

export const defaultPlantAddress:
  PlantAddress = {
  country: "ישראל",
  city: "",
  street: "",
  postalCode: "",
};

export const defaultPlantOperatingSchedule:
  PlantOperatingSchedule = {
  workingDays: [0, 1, 2, 3, 4],

  shiftsPerDay: 3,

  firstShiftStart: "06:30",
  secondShiftStart: "15:30",
  thirdShiftStart: "23:30",

  hoursPerShift: 8,

  operatesOnWeekends: false,
  operatesOnHolidays: false,
};