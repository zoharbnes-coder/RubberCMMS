import type {
  AssetCriticality,
  AssetSpecification,
  AssetType,
} from "./asset";

export type EquipmentClassStatus =
  | "active"
  | "inactive"
  | "draft"
  | "obsolete";

export type EquipmentClassCategory =
  | "production"
  | "utilities"
  | "material-handling"
  | "electrical"
  | "infrastructure"
  | "laboratory"
  | "safety"
  | "other";

export type EquipmentClassSpecificationDefinition = {
  id: string;

  /*
   * Identification
   */
  key: string;
  displayName: string;

  /*
   * Value definition
   */
  dataType:
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "select";

  unit: string;

  required: boolean;

  defaultValue: string;

  options: string[];

  /*
   * Display and order
   */
  group: string;
  order: number;

  description: string;
};

export type EquipmentClassMaintenanceTemplate = {
  id: string;

  title: string;
  description: string;

  maintenanceType:
    | "preventive"
    | "predictive"
    | "inspection"
    | "lubrication"
    | "calibration"
    | "safety";

  frequencyType:
    | "days"
    | "weeks"
    | "months"
    | "years"
    | "operating-hours"
    | "cycles"
    | "condition";

  frequencyValue: number;

  estimatedDurationHours: number;

  requiredSkill: string;

  active: boolean;
};

export type EquipmentClassSparePartTemplate = {
  id: string;

  partNumber: string;
  displayName: string;

  manufacturer: string;
  manufacturerPartNumber: string;

  quantityRequired: number;

  critical: boolean;

  recommendedStockQuantity: number;

  notes: string;
};

export type EquipmentClassDocumentTemplate = {
  id: string;

  title: string;

  documentType:
    | "manual"
    | "drawing"
    | "electrical-drawing"
    | "hydraulic-drawing"
    | "pneumatic-drawing"
    | "datasheet"
    | "procedure"
    | "safety"
    | "certificate"
    | "other";

  required: boolean;

  description: string;
};

export type EquipmentClassSafetyRequirement = {
  id: string;

  title: string;
  description: string;

  requirementType:
    | "ppe"
    | "loto"
    | "permit"
    | "training"
    | "guarding"
    | "inspection"
    | "other";

  mandatory: boolean;
};

export type EquipmentClassLubricationPoint = {
  id: string;

  pointCode: string;
  displayName: string;

  lubricantType: string;
  lubricantSpecification: string;

  quantity: number;
  unit: string;

  frequencyType:
    | "days"
    | "weeks"
    | "months"
    | "operating-hours"
    | "cycles";

  frequencyValue: number;

  lubricationMethod:
    | "manual"
    | "automatic"
    | "central-system"
    | "oil-bath"
    | "other";

  notes: string;
};

export type EquipmentClass = {
  id: string;

  /*
   * Identification
   */
  classNumber: string;
  classCode: string;

  displayName: string;
  shortName: string;

  /*
   * Classification
   */
  category: EquipmentClassCategory;

  assetType: AssetType;

  status: EquipmentClassStatus;

  active: boolean;

  /*
   * Default asset behavior
   */
  defaultCriticality:
    AssetCriticality;

  defaultManufacturer: string;
  defaultModel: string;

  /*
   * Technical structure
   */
  specificationDefinitions:
    EquipmentClassSpecificationDefinition[];

  defaultSpecifications:
    AssetSpecification[];

  /*
   * Maintenance templates
   */
  maintenanceTemplates:
    EquipmentClassMaintenanceTemplate[];

  lubricationPoints:
    EquipmentClassLubricationPoint[];

  /*
   * Spare parts and documentation
   */
  sparePartTemplates:
    EquipmentClassSparePartTemplate[];

  documentTemplates:
    EquipmentClassDocumentTemplate[];

  /*
   * Safety
   */
  safetyRequirements:
    EquipmentClassSafetyRequirement[];

  /*
   * General information
   */
  description: string;
  notes: string;

  /*
   * Statistics
   */
  assetCount: number;
  activeAssetCount: number;

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

export type CreateEquipmentClassInput =
  Omit<
    EquipmentClass,
    | "id"
    | "assetCount"
    | "activeAssetCount"
    | "version"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateEquipmentClassInput =
  Partial<CreateEquipmentClassInput>;

export type EquipmentClassRepositoryResult = {
  success: boolean;

  equipmentClass:
    | EquipmentClass
    | null;

  message: string;
};

export const defaultEquipmentClass:
  CreateEquipmentClassInput = {
  classNumber: "",
  classCode: "",

  displayName: "",
  shortName: "",

  category: "production",

  assetType: "machine",

  status: "draft",

  active: true,

  defaultCriticality: "medium",

  defaultManufacturer: "",
  defaultModel: "",

  specificationDefinitions: [],
  defaultSpecifications: [],

  maintenanceTemplates: [],
  lubricationPoints: [],

  sparePartTemplates: [],
  documentTemplates: [],

  safetyRequirements: [],

  description: "",
  notes: "",
};