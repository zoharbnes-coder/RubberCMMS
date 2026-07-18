export type SparePartStatus =
  | "active"
  | "inactive"
  | "obsolete"
  | "discontinued"
  | "blocked"
  | "draft";

export type SparePartCriticality =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type SparePartCategory =
  | "mechanical"
  | "electrical"
  | "automation"
  | "instrumentation"
  | "hydraulic"
  | "pneumatic"
  | "bearing"
  | "seal"
  | "motor"
  | "gearbox"
  | "drive"
  | "sensor"
  | "valve"
  | "pump"
  | "filter"
  | "belt"
  | "chain"
  | "coupling"
  | "fastener"
  | "lubricant"
  | "consumable"
  | "safety"
  | "other";

export type SparePartType =
  | "spare"
  | "consumable"
  | "repairable"
  | "rotating-spare"
  | "insurance-spare"
  | "tool"
  | "kit"
  | "assembly"
  | "subassembly"
  | "other";

export type SparePartStockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "overstock"
  | "reserved"
  | "on-order"
  | "unavailable"
  | "unknown";

export type SparePartCondition =
  | "new"
  | "used"
  | "repaired"
  | "refurbished"
  | "reconditioned"
  | "damaged"
  | "quarantine"
  | "unknown";

export type SparePartProcurementType =
  | "purchase"
  | "manufacture"
  | "repair"
  | "exchange"
  | "consignment"
  | "framework-agreement"
  | "other";

export type SparePartUsageType =
  | "planned"
  | "corrective"
  | "emergency"
  | "preventive"
  | "predictive"
  | "project"
  | "overhaul"
  | "other";

export type SparePartUnitOfMeasure =
  | "piece"
  | "set"
  | "kit"
  | "meter"
  | "kilogram"
  | "liter"
  | "box"
  | "pack"
  | "roll"
  | "pair"
  | "other";

export type SparePartSupplier = {
  id: string;

  supplierId: string | null;

  supplierCode: string;

  supplierName: string;

  manufacturer: boolean;

  preferred: boolean;

  approved: boolean;

  active: boolean;

  supplierPartNumber: string;

  manufacturerPartNumber: string;

  description: string;

  unitPrice: number | null;

  currency: string;

  minimumOrderQuantity: number;

  orderMultiple: number;

  leadTimeDays: number | null;

  emergencyLeadTimeDays:
    number | null;

  lastPurchaseDate: string | null;

  lastPurchasePrice: number | null;

  contactName: string;

  contactEmail: string;

  contactPhone: string;

  notes: string;
};

export type SparePartAlternative = {
  id: string;

  sparePartId: string | null;

  partNumber: string;

  manufacturer: string;

  model: string;

  description: string;

  alternativeType:
    | "direct-replacement"
    | "approved-alternative"
    | "temporary-replacement"
    | "upgrade"
    | "equivalent"
    | "other";

  approved: boolean;

  preferred: boolean;

  requiresEngineeringApproval:
    boolean;

  compatibilityNotes: string;

  notes: string;
};

export type SparePartCompatibility = {
  id: string;

  assetId: string | null;

  assetCode: string;

  assetName: string;

  equipmentClassId:
    string | null;

  equipmentClassCode: string;

  equipmentClassName: string;

  manufacturer: string;

  model: string;

  position: string;

  quantityRequired: number;

  criticalForOperation:
    boolean;

  recommendedStockQuantity:
    number;

  notes: string;
};

export type SparePartFailureModeRelation = {
  id: string;

  failureModeId: string;

  failureModeCode: string;

  failureModeName: string;

  typicalReplacementRequired:
    boolean;

  probabilityOfUsePercent:
    number | null;

  typicalQuantityUsed: number;

  notes: string;
};

export type SparePartInventorySummary = {
  totalQuantity: number;

  availableQuantity: number;

  reservedQuantity: number;

  quarantineQuantity: number;

  repairQuantity: number;

  onOrderQuantity: number;

  minimumStockLevel: number;

  maximumStockLevel: number;

  reorderPoint: number;

  reorderQuantity: number;

  safetyStock: number;

  stockStatus:
    SparePartStockStatus;

  lastStockUpdateAt:
    string | null;
};

export type SparePartStorageLocation = {
  id: string;

  warehouseId: string;

  warehouseCode: string;

  warehouseName: string;

  locationCode: string;

  aisle: string;

  rack: string;

  shelf: string;

  bin: string;

  quantity: number;

  reservedQuantity: number;

  condition:
    SparePartCondition;

  lotNumber: string;

  serialNumbers: string[];

  expirationDate: string | null;

  lastCountDate: string | null;

  notes: string;
};

export type SparePartCostProfile = {
  standardCost: number;

  averageCost: number;

  lastPurchaseCost: number;

  replacementCost: number;

  repairCost: number | null;

  currency: string;

  totalStockValue: number;

  annualUsageValue: number;

  annualHoldingCost:
    number | null;

  costCenter: string;

  glAccount: string;

  notes: string;
};

export type SparePartProcurementProfile = {
  procurementType:
    SparePartProcurementType;

  purchasingEnabled: boolean;

  automaticReorderEnabled:
    boolean;

  preferredSupplierId:
    string | null;

  minimumOrderQuantity: number;

  orderMultiple: number;

  defaultLeadTimeDays:
    number;

  emergencyPurchaseAllowed:
    boolean;

  requiresApproval: boolean;

  requiresTechnicalApproval:
    boolean;

  requiresManufacturerApproval:
    boolean;

  purchaseSpecification:
    string;

  notes: string;
};

export type SparePartRepairProfile = {
  repairable: boolean;

  internalRepairAllowed:
    boolean;

  externalRepairAllowed:
    boolean;

  preferredRepairContractorId:
    string | null;

  typicalRepairLeadTimeDays:
    number | null;

  maximumRepairCount:
    number | null;

  currentRepairCount: number;

  repairCostThreshold:
    number | null;

  replaceInsteadOfRepairPercent:
    number | null;

  requiresPostRepairInspection:
    boolean;

  requiresPostRepairTesting:
    boolean;

  notes: string;
};

export type SparePartTechnicalSpecification = {
  id: string;

  name: string;

  value: string;

  unit: string;

  mandatory: boolean;

  searchable: boolean;

  notes: string;
};

export type SparePartDocumentReference = {
  id: string;

  documentId: string;

  documentType:
    | "drawing"
    | "datasheet"
    | "manual"
    | "certificate"
    | "inspection-report"
    | "test-report"
    | "photo"
    | "purchase-specification"
    | "repair-report"
    | "other";

  title: string;

  description: string;

  revision: string;

  notes: string;
};

export type SparePartUsageRecord = {
  id: string;

  workOrderId: string | null;

  assetId: string | null;

  failureEventId: string | null;

  usageType:
    SparePartUsageType;

  quantity: number;

  unitCost: number;

  totalCost: number;

  currency: string;

  usedAt: string;

  usedByPersonId:
    string | null;

  usedByName: string;

  returnedQuantity: number;

  defectiveQuantity: number;

  notes: string;
};

export type SparePartPerformanceMetrics = {
  totalUsageQuantity: number;

  usageLast30Days: number;

  usageLast90Days: number;

  usageLast365Days: number;

  averageMonthlyUsage: number;

  annualUsageQuantity: number;

  emergencyUsageCount: number;

  stockoutCount: number;

  stockoutDays: number;

  averageLeadTimeDays: number;

  averageUnitCost: number;

  annualPurchaseCost: number;

  annualRepairCost: number;

  inventoryTurnover:
    number;

  daysOfStock:
    number | null;

  obsoleteStockQuantity:
    number;

  obsoleteStockValue:
    number;

  lastUsedAt: string | null;

  lastPurchasedAt: string | null;
};

export type SparePartMieProfile = {
  criticalityScore: number;

  stockRiskScore: number;

  leadTimeRiskScore: number;

  failureImpactScore: number;

  costRiskScore: number;

  obsolescenceRiskScore: number;

  overallRiskScore: number;

  predictedMonthlyUsage:
    number;

  predictedAnnualUsage:
    number;

  recommendedMinimumStock:
    number;

  recommendedMaximumStock:
    number;

  recommendedReorderPoint:
    number;

  recommendedReorderQuantity:
    number;

  recommendedSafetyStock:
    number;

  recommendedSupplierId:
    string | null;

  recommendedAlternativePartIds:
    string[];

  relatedFailureModeIds:
    string[];

  relatedAssetIds: string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type SparePart = {
  id: string;

  /*
   * Identification
   */
  sparePartNumber: string;

  partNumber: string;

  internalPartNumber: string;

  manufacturerPartNumber: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  category:
    SparePartCategory;

  sparePartType:
    SparePartType;

  status:
    SparePartStatus;

  criticality:
    SparePartCriticality;

  active: boolean;

  /*
   * Manufacturer
   */
  manufacturer: string;

  manufacturerModel: string;

  /*
   * Unit
   */
  unitOfMeasure:
    SparePartUnitOfMeasure;

  /*
   * Technical
   */
  technicalSpecifications:
    SparePartTechnicalSpecification[];

  /*
   * Compatibility
   */
  compatibility:
    SparePartCompatibility[];

  alternativeParts:
    SparePartAlternative[];

  failureModeRelations:
    SparePartFailureModeRelation[];

  /*
   * Suppliers
   */
  suppliers:
    SparePartSupplier[];

  /*
   * Inventory
   */
  inventorySummary:
    SparePartInventorySummary;

  storageLocations:
    SparePartStorageLocation[];

  /*
   * Cost
   */
  costProfile:
    SparePartCostProfile;

  /*
   * Procurement
   */
  procurementProfile:
    SparePartProcurementProfile;

  /*
   * Repair
   */
  repairProfile:
    SparePartRepairProfile;

  /*
   * Documents
   */
  documents:
    SparePartDocumentReference[];

  /*
   * Usage
   */
  usageRecords:
    SparePartUsageRecord[];

  /*
   * Relationships
   */
  assetIds: string[];

  equipmentClassIds: string[];

  failureModeIds: string[];

  workOrderIds: string[];

  supplierIds: string[];

  contractorIds: string[];

  /*
   * Performance
   */
  performanceMetrics:
    SparePartPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    SparePartMieProfile;

  /*
   * General
   */
  barcode: string;

  qrCode: string;

  tags: string[];

  notes: string;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;
};

export type CreateSparePartInput =
  Omit<
    SparePart,
    | "id"
    | "performanceMetrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateSparePartInput =
  Partial<CreateSparePartInput>;

export type SparePartRepositoryResult = {
  success: boolean;

  sparePart: SparePart | null;

  message: string;
};

export const defaultSparePartInventorySummary:
  SparePartInventorySummary = {
  totalQuantity: 0,

  availableQuantity: 0,

  reservedQuantity: 0,

  quarantineQuantity: 0,

  repairQuantity: 0,

  onOrderQuantity: 0,

  minimumStockLevel: 0,

  maximumStockLevel: 0,

  reorderPoint: 0,

  reorderQuantity: 0,

  safetyStock: 0,

  stockStatus: "out-of-stock",

  lastStockUpdateAt: null,
};

export const defaultSparePartCostProfile:
  SparePartCostProfile = {
  standardCost: 0,

  averageCost: 0,

  lastPurchaseCost: 0,

  replacementCost: 0,

  repairCost: null,

  currency: "ILS",

  totalStockValue: 0,

  annualUsageValue: 0,

  annualHoldingCost: null,

  costCenter: "",

  glAccount: "",

  notes: "",
};

export const defaultSparePartProcurementProfile:
  SparePartProcurementProfile = {
  procurementType: "purchase",

  purchasingEnabled: true,

  automaticReorderEnabled:
    false,

  preferredSupplierId: null,

  minimumOrderQuantity: 1,

  orderMultiple: 1,

  defaultLeadTimeDays: 0,

  emergencyPurchaseAllowed:
    true,

  requiresApproval: false,

  requiresTechnicalApproval:
    false,

  requiresManufacturerApproval:
    false,

  purchaseSpecification: "",

  notes: "",
};

export const defaultSparePartRepairProfile:
  SparePartRepairProfile = {
  repairable: false,

  internalRepairAllowed: false,

  externalRepairAllowed: false,

  preferredRepairContractorId:
    null,

  typicalRepairLeadTimeDays:
    null,

  maximumRepairCount: null,

  currentRepairCount: 0,

  repairCostThreshold: null,

  replaceInsteadOfRepairPercent:
    null,

  requiresPostRepairInspection:
    false,

  requiresPostRepairTesting:
    false,

  notes: "",
};

export const defaultSparePartPerformanceMetrics:
  SparePartPerformanceMetrics = {
  totalUsageQuantity: 0,

  usageLast30Days: 0,

  usageLast90Days: 0,

  usageLast365Days: 0,

  averageMonthlyUsage: 0,

  annualUsageQuantity: 0,

  emergencyUsageCount: 0,

  stockoutCount: 0,

  stockoutDays: 0,

  averageLeadTimeDays: 0,

  averageUnitCost: 0,

  annualPurchaseCost: 0,

  annualRepairCost: 0,

  inventoryTurnover: 0,

  daysOfStock: null,

  obsoleteStockQuantity: 0,

  obsoleteStockValue: 0,

  lastUsedAt: null,

  lastPurchasedAt: null,
};

export const defaultSparePartMieProfile:
  SparePartMieProfile = {
  criticalityScore: 0,

  stockRiskScore: 0,

  leadTimeRiskScore: 0,

  failureImpactScore: 0,

  costRiskScore: 0,

  obsolescenceRiskScore: 0,

  overallRiskScore: 0,

  predictedMonthlyUsage: 0,

  predictedAnnualUsage: 0,

  recommendedMinimumStock: 0,

  recommendedMaximumStock: 0,

  recommendedReorderPoint: 0,

  recommendedReorderQuantity: 0,

  recommendedSafetyStock: 0,

  recommendedSupplierId: null,

  recommendedAlternativePartIds:
    [],

  relatedFailureModeIds: [],

  relatedAssetIds: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultSparePart:
  CreateSparePartInput = {
  sparePartNumber: "",

  partNumber: "",

  internalPartNumber: "",

  manufacturerPartNumber: "",

  displayName: "",

  shortName: "",

  description: "",

  category: "mechanical",

  sparePartType: "spare",

  status: "active",

  criticality: "medium",

  active: true,

  manufacturer: "",

  manufacturerModel: "",

  unitOfMeasure: "piece",

  technicalSpecifications: [],

  compatibility: [],

  alternativeParts: [],

  failureModeRelations: [],

  suppliers: [],

  inventorySummary:
    defaultSparePartInventorySummary,

  storageLocations: [],

  costProfile:
    defaultSparePartCostProfile,

  procurementProfile:
    defaultSparePartProcurementProfile,

  repairProfile:
    defaultSparePartRepairProfile,

  documents: [],

  usageRecords: [],

  assetIds: [],

  equipmentClassIds: [],

  failureModeIds: [],

  workOrderIds: [],

  supplierIds: [],

  contractorIds: [],

  barcode: "",

  qrCode: "",

  tags: [],

  notes: "",
};