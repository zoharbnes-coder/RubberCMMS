export type InventoryStatus =
  | "active"
  | "inactive"
  | "blocked"
  | "archived";

export type InventoryLocationType =
  | "warehouse"
  | "room"
  | "aisle"
  | "rack"
  | "shelf"
  | "bin"
  | "cabinet"
  | "yard"
  | "vehicle"
  | "tool-crib"
  | "workshop"
  | "consignment"
  | "other";

export type InventoryTransactionType =
  | "receipt"
  | "issue"
  | "return"
  | "transfer"
  | "adjustment-in"
  | "adjustment-out"
  | "reservation"
  | "reservation-release"
  | "quarantine"
  | "quarantine-release"
  | "repair-out"
  | "repair-return"
  | "scrap"
  | "count-adjustment"
  | "opening-balance"
  | "other";

export type InventoryReservationStatus =
  | "active"
  | "partially-issued"
  | "issued"
  | "released"
  | "expired"
  | "cancelled";

export type InventoryCountStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "approved"
  | "rejected"
  | "cancelled";

export type InventoryCountType =
  | "cycle-count"
  | "annual-count"
  | "spot-count"
  | "full-count"
  | "investigation"
  | "other";

export type InventoryStockCondition =
  | "available"
  | "reserved"
  | "quarantine"
  | "repair"
  | "damaged"
  | "obsolete"
  | "expired"
  | "scrap"
  | "unknown";

export type InventoryMovementReason =
  | "work-order"
  | "preventive-maintenance"
  | "corrective-maintenance"
  | "emergency-maintenance"
  | "project"
  | "production-support"
  | "internal-transfer"
  | "supplier-return"
  | "repair"
  | "inventory-count"
  | "damage"
  | "expiration"
  | "obsolescence"
  | "other";

export type InventoryValuationMethod =
  | "standard"
  | "average"
  | "fifo"
  | "last-purchase"
  | "manual";

export type InventoryOwnershipType =
  | "company"
  | "supplier-consignment"
  | "contractor"
  | "customer"
  | "leased"
  | "other";

export type InventoryWarehouse = {
  id: string;

  warehouseCode: string;

  displayName: string;

  description: string;

  plantId: string | null;

  plantName: string;

  functionalLocationId:
    string | null;

  functionalLocationName: string;

  status:
    InventoryStatus;

  active: boolean;

  managedByPersonId:
    string | null;

  managedByName: string;

  costCenter: string;

  address: string;

  restrictedAccess: boolean;

  allowNegativeStock: boolean;

  automaticReorderEnabled:
    boolean;

  defaultIssueLocationId:
    string | null;

  defaultReceiptLocationId:
    string | null;

  notes: string;
};

export type InventoryLocation = {
  id: string;

  warehouseId: string;

  parentLocationId:
    string | null;

  locationCode: string;

  displayName: string;

  description: string;

  locationType:
    InventoryLocationType;

  status:
    InventoryStatus;

  active: boolean;

  aisle: string;

  rack: string;

  shelf: string;

  bin: string;

  barcode: string;

  qrCode: string;

  capacityQuantity:
    number | null;

  capacityWeightKg:
    number | null;

  restrictedAccess: boolean;

  hazardousMaterialsAllowed:
    boolean;

  temperatureControlled:
    boolean;

  minimumTemperatureC:
    number | null;

  maximumTemperatureC:
    number | null;

  notes: string;
};

export type InventoryStockItem = {
  id: string;

  sparePartId: string;

  partNumber: string;

  sparePartName: string;

  warehouseId: string;

  locationId: string;

  locationCode: string;

  ownershipType:
    InventoryOwnershipType;

  condition:
    InventoryStockCondition;

  quantityOnHand: number;

  quantityAvailable: number;

  quantityReserved: number;

  quantityQuarantine: number;

  quantityRepair: number;

  quantityDamaged: number;

  quantityObsolete: number;

  unitOfMeasure: string;

  lotNumber: string;

  serialNumbers: string[];

  manufactureDate:
    string | null;

  expirationDate:
    string | null;

  receivedAt:
    string | null;

  lastMovementAt:
    string | null;

  lastCountAt:
    string | null;

  unitCost: number;

  totalValue: number;

  currency: string;

  notes: string;
};

export type InventoryTransaction = {
  id: string;

  transactionNumber: string;

  transactionType:
    InventoryTransactionType;

  movementReason:
    InventoryMovementReason;

  sparePartId: string;

  partNumber: string;

  sparePartName: string;

  quantity: number;

  unitOfMeasure: string;

  fromWarehouseId:
    string | null;

  fromLocationId:
    string | null;

  toWarehouseId:
    string | null;

  toLocationId:
    string | null;

  lotNumber: string;

  serialNumbers: string[];

  conditionBefore:
    InventoryStockCondition | null;

  conditionAfter:
    InventoryStockCondition | null;

  workOrderId: string | null;

  assetId: string | null;

  failureEventId: string | null;

  projectId: string | null;

  purchaseOrderNumber: string;

  supplierId: string | null;

  contractorId: string | null;

  referenceDocumentId:
    string | null;

  unitCost: number;

  totalCost: number;

  currency: string;

  performedAt: string;

  performedByPersonId:
    string | null;

  performedByName: string;

  approvedByPersonId:
    string | null;

  approvedByName: string;

  approvalRequired: boolean;

  approved: boolean;

  notes: string;
};

export type InventoryReservation = {
  id: string;

  reservationNumber: string;

  sparePartId: string;

  partNumber: string;

  sparePartName: string;

  warehouseId: string | null;

  locationId: string | null;

  workOrderId: string | null;

  assetId: string | null;

  projectId: string | null;

  requestedQuantity: number;

  reservedQuantity: number;

  issuedQuantity: number;

  releasedQuantity: number;

  unitOfMeasure: string;

  status:
    InventoryReservationStatus;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  requiredAt: string | null;

  reservedAt: string;

  expiresAt: string | null;

  reservedByPersonId:
    string | null;

  reservedByName: string;

  notes: string;
};

export type InventoryCountLine = {
  id: string;

  sparePartId: string;

  partNumber: string;

  sparePartName: string;

  locationId: string;

  locationCode: string;

  expectedQuantity: number;

  countedQuantity:
    number | null;

  varianceQuantity:
    number | null;

  unitCost: number;

  varianceValue:
    number | null;

  currency: string;

  lotNumber: string;

  serialNumbersExpected:
    string[];

  serialNumbersCounted:
    string[];

  countedByPersonId:
    string | null;

  countedByName: string;

  countedAt: string | null;

  recountRequired: boolean;

  approved: boolean;

  notes: string;
};

export type InventoryCount = {
  id: string;

  countNumber: string;

  warehouseId: string;

  warehouseName: string;

  countType:
    InventoryCountType;

  status:
    InventoryCountStatus;

  plannedStartAt:
    string | null;

  plannedEndAt:
    string | null;

  startedAt: string | null;

  completedAt: string | null;

  approvedAt: string | null;

  requestedByPersonId:
    string | null;

  requestedByName: string;

  approvedByPersonId:
    string | null;

  approvedByName: string;

  locationIds: string[];

  lines:
    InventoryCountLine[];

  totalExpectedValue: number;

  totalCountedValue: number;

  totalVarianceValue: number;

  currency: string;

  notes: string;
};

export type InventoryReorderRule = {
  id: string;

  sparePartId: string;

  warehouseId: string | null;

  locationId: string | null;

  enabled: boolean;

  minimumStockLevel: number;

  maximumStockLevel: number;

  reorderPoint: number;

  reorderQuantity: number;

  safetyStock: number;

  leadTimeDays: number;

  averageDailyUsage: number;

  automaticReorder: boolean;

  preferredSupplierId:
    string | null;

  approvalRequired: boolean;

  notes: string;
};

export type InventoryTransferRequest = {
  id: string;

  transferNumber: string;

  sparePartId: string;

  partNumber: string;

  sparePartName: string;

  quantity: number;

  unitOfMeasure: string;

  fromWarehouseId: string;

  fromLocationId:
    string | null;

  toWarehouseId: string;

  toLocationId:
    string | null;

  requestedAt: string;

  requiredAt: string | null;

  requestedByPersonId:
    string | null;

  requestedByName: string;

  approvedByPersonId:
    string | null;

  approvedByName: string;

  status:
    | "requested"
    | "approved"
    | "in-transit"
    | "completed"
    | "rejected"
    | "cancelled";

  workOrderId: string | null;

  projectId: string | null;

  notes: string;
};

export type InventoryPerformanceMetrics = {
  totalSparePartCount: number;

  totalStockQuantity: number;

  totalInventoryValue: number;

  availableInventoryValue:
    number;

  reservedInventoryValue:
    number;

  quarantineInventoryValue:
    number;

  obsoleteInventoryValue:
    number;

  damagedInventoryValue:
    number;

  repairInventoryValue:
    number;

  lowStockPartCount: number;

  outOfStockPartCount: number;

  overstockPartCount: number;

  obsoletePartCount: number;

  expiredPartCount: number;

  stockoutEventsLast30Days:
    number;

  emergencyIssueCountLast30Days:
    number;

  inventoryAccuracyPercent:
    number;

  averageInventoryTurnover:
    number;

  averageDaysOfStock:
    number;

  totalOpenReservations:
    number;

  totalPendingTransfers:
    number;

  totalOpenCountTasks:
    number;

  lastCountAt: string | null;

  lastTransactionAt:
    string | null;
};

export type InventoryMieProfile = {
  stockRiskScore: number;

  availabilityRiskScore:
    number;

  obsolescenceRiskScore:
    number;

  costRiskScore: number;

  criticalSpareCoverageScore:
    number;

  inventoryAccuracyScore:
    number;

  overallInventoryHealthScore:
    number;

  predictedStockoutPartIds:
    string[];

  predictedOverstockPartIds:
    string[];

  predictedObsoletePartIds:
    string[];

  recommendedReorderPartIds:
    string[];

  recommendedTransferPartIds:
    string[];

  recommendedCountLocationIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type Inventory = {
  id: string;

  /*
   * Identification
   */
  inventoryNumber: string;

  displayName: string;

  description: string;

  /*
   * Classification
   */
  status:
    InventoryStatus;

  active: boolean;

  valuationMethod:
    InventoryValuationMethod;

  defaultCurrency: string;

  /*
   * Structure
   */
  warehouses:
    InventoryWarehouse[];

  locations:
    InventoryLocation[];

  /*
   * Stock
   */
  stockItems:
    InventoryStockItem[];

  /*
   * Transactions
   */
  transactions:
    InventoryTransaction[];

  /*
   * Reservations
   */
  reservations:
    InventoryReservation[];

  /*
   * Counts
   */
  counts:
    InventoryCount[];

  /*
   * Reorder
   */
  reorderRules:
    InventoryReorderRule[];

  /*
   * Transfers
   */
  transferRequests:
    InventoryTransferRequest[];

  /*
   * Relationships
   */
  sparePartIds: string[];

  workOrderIds: string[];

  assetIds: string[];

  supplierIds: string[];

  contractorIds: string[];

  /*
   * Performance
   */
  performanceMetrics:
    InventoryPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    InventoryMieProfile;

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

export type CreateInventoryInput =
  Omit<
    Inventory,
    | "id"
    | "performanceMetrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateInventoryInput =
  Partial<CreateInventoryInput>;

export type InventoryRepositoryResult = {
  success: boolean;

  inventory: Inventory | null;

  message: string;
};

export const defaultInventoryPerformanceMetrics:
  InventoryPerformanceMetrics = {
  totalSparePartCount: 0,

  totalStockQuantity: 0,

  totalInventoryValue: 0,

  availableInventoryValue: 0,

  reservedInventoryValue: 0,

  quarantineInventoryValue: 0,

  obsoleteInventoryValue: 0,

  damagedInventoryValue: 0,

  repairInventoryValue: 0,

  lowStockPartCount: 0,

  outOfStockPartCount: 0,

  overstockPartCount: 0,

  obsoletePartCount: 0,

  expiredPartCount: 0,

  stockoutEventsLast30Days: 0,

  emergencyIssueCountLast30Days:
    0,

  inventoryAccuracyPercent: 0,

  averageInventoryTurnover: 0,

  averageDaysOfStock: 0,

  totalOpenReservations: 0,

  totalPendingTransfers: 0,

  totalOpenCountTasks: 0,

  lastCountAt: null,

  lastTransactionAt: null,
};

export const defaultInventoryMieProfile:
  InventoryMieProfile = {
  stockRiskScore: 0,

  availabilityRiskScore: 0,

  obsolescenceRiskScore: 0,

  costRiskScore: 0,

  criticalSpareCoverageScore: 0,

  inventoryAccuracyScore: 0,

  overallInventoryHealthScore: 0,

  predictedStockoutPartIds: [],

  predictedOverstockPartIds: [],

  predictedObsoletePartIds: [],

  recommendedReorderPartIds: [],

  recommendedTransferPartIds: [],

  recommendedCountLocationIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultInventory:
  CreateInventoryInput = {
  inventoryNumber: "",

  displayName: "",

  description: "",

  status: "active",

  active: true,

  valuationMethod: "average",

  defaultCurrency: "ILS",

  warehouses: [],

  locations: [],

  stockItems: [],

  transactions: [],

  reservations: [],

  counts: [],

  reorderRules: [],

  transferRequests: [],

  sparePartIds: [],

  workOrderIds: [],

  assetIds: [],

  supplierIds: [],

  contractorIds: [],

  tags: [],

  notes: "",
};