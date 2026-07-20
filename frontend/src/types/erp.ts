export type ErpIntegrationStatus =
  | "active"
  | "inactive"
  | "error"
  | "maintenance"
  | "disabled";

export type ErpSystemType =
  | "priority"
  | "sap"
  | "oracle"
  | "microsoft-dynamics"
  | "netsuite"
  | "odoo"
  | "infor"
  | "custom"
  | "other";

export type ErpConnectionType =
  | "rest-api"
  | "soap"
  | "odata"
  | "sql"
  | "file"
  | "sftp"
  | "webhook"
  | "message-queue"
  | "custom"
  | "other";

export type ErpEntityType =
  | "supplier"
  | "purchase-order"
  | "purchase-request"
  | "inventory-item"
  | "warehouse"
  | "stock-balance"
  | "stock-transaction"
  | "cost-center"
  | "gl-account"
  | "employee"
  | "contractor"
  | "asset"
  | "work-order"
  | "project"
  | "budget"
  | "invoice"
  | "service-order"
  | "other";

export type ErpSyncDirection =
  | "inbound"
  | "outbound"
  | "bidirectional";

export type ErpSyncStatus =
  | "pending"
  | "running"
  | "completed"
  | "partially-completed"
  | "failed"
  | "cancelled";

export type ErpRecordStatus =
  | "pending"
  | "synced"
  | "failed"
  | "conflict"
  | "ignored";

export type ErpConflictResolution =
  | "pending"
  | "use-erp"
  | "use-rubbermip"
  | "merged"
  | "manual"
  | "ignored";

export type ErpAuthenticationType =
  | "none"
  | "basic"
  | "api-key"
  | "oauth2"
  | "bearer-token"
  | "certificate"
  | "windows-auth"
  | "custom";

export type ErpDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "array";

export type ErpTriggerType =
  | "manual"
  | "scheduled"
  | "event"
  | "webhook"
  | "on-demand"
  | "other";

export type ErpEntityReference = {
  entityType: ErpEntityType;

  externalId: string;

  externalCode: string;

  externalName: string;

  internalId: string | null;
};

export type ErpConnection = {
  id: string;

  connectionCode: string;

  displayName: string;

  connectionType:
    ErpConnectionType;

  authenticationType:
    ErpAuthenticationType;

  baseUrl: string;

  endpoint: string;

  databaseName: string;

  serverName: string;

  port: number | null;

  username: string;

  apiKeyName: string;

  encrypted: boolean;

  certificateEnabled:
    boolean;

  timeoutSeconds: number;

  retryEnabled: boolean;

  maximumRetries: number;

  retryIntervalSeconds: number;

  active: boolean;

  lastConnectedAt:
    string | null;

  lastConnectionError:
    string;

  notes: string;
};

export type ErpFieldMapping = {
  id: string;

  entityType:
    ErpEntityType;

  sourceField: string;

  targetField: string;

  sourceDataType:
    ErpDataType;

  targetDataType:
    ErpDataType;

  required: boolean;

  primaryKey: boolean;

  transformationRule:
    string;

  defaultValue:
    string | number | boolean | null;

  active: boolean;

  notes: string;
};

export type ErpEntityMapping = {
  id: string;

  entityType:
    ErpEntityType;

  displayName: string;

  externalEntityName:
    string;

  internalEntityName:
    string;

  syncDirection:
    ErpSyncDirection;

  enabled: boolean;

  fieldMappings:
    ErpFieldMapping[];

  externalPrimaryKeyField:
    string;

  internalPrimaryKeyField:
    string;

  lastSyncAt:
    string | null;

  notes: string;
};

export type ErpSupplier = {
  id: string;

  externalSupplierId: string;

  supplierCode: string;

  displayName: string;

  legalName: string;

  taxNumber: string;

  active: boolean;

  approved: boolean;

  preferred: boolean;

  contactName: string;

  email: string;

  phone: string;

  paymentTermsDays:
    number;

  currency: string;

  country: string;

  city: string;

  address: string;

  internalContractorId:
    string | null;

  internalSupplierId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpPurchaseOrderLine = {
  id: string;

  lineNumber: number;

  itemCode: string;

  itemDescription: string;

  sparePartId:
    string | null;

  quantityOrdered:
    number;

  quantityReceived:
    number;

  quantityOpen:
    number;

  unitOfMeasure: string;

  unitPrice: number;

  totalPrice: number;

  currency: string;

  expectedDeliveryDate:
    string | null;

  warehouseCode: string;

  locationCode: string;

  workOrderId:
    string | null;

  assetId:
    string | null;

  projectId:
    string | null;

  notes: string;
};

export type ErpPurchaseOrder = {
  id: string;

  externalPurchaseOrderId:
    string;

  purchaseOrderNumber:
    string;

  supplierId: string;

  supplierCode: string;

  supplierName: string;

  status:
    | "draft"
    | "approved"
    | "open"
    | "partially-received"
    | "received"
    | "closed"
    | "cancelled";

  orderDate:
    string | null;

  expectedDeliveryDate:
    string | null;

  currency: string;

  totalAmount: number;

  costCenter: string;

  projectCode: string;

  requesterPersonId:
    string | null;

  requesterName: string;

  approverPersonId:
    string | null;

  approverName: string;

  lines:
    ErpPurchaseOrderLine[];

  internalPurchaseRequestId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpPurchaseRequestLine = {
  id: string;

  lineNumber: number;

  itemCode: string;

  itemDescription: string;

  sparePartId:
    string | null;

  requestedQuantity:
    number;

  unitOfMeasure: string;

  estimatedUnitPrice:
    number | null;

  estimatedTotalPrice:
    number | null;

  currency: string;

  requiredDate:
    string | null;

  preferredSupplierId:
    string | null;

  warehouseCode: string;

  workOrderId:
    string | null;

  assetId:
    string | null;

  projectId:
    string | null;

  notes: string;
};

export type ErpPurchaseRequest = {
  id: string;

  externalPurchaseRequestId:
    string;

  requestNumber: string;

  status:
    | "draft"
    | "submitted"
    | "approved"
    | "rejected"
    | "converted-to-po"
    | "cancelled";

  requestDate:
    string | null;

  requiredDate:
    string | null;

  requesterPersonId:
    string | null;

  requesterName: string;

  approverPersonId:
    string | null;

  approverName: string;

  costCenter: string;

  projectCode: string;

  currency: string;

  estimatedTotalAmount:
    number;

  lines:
    ErpPurchaseRequestLine[];

  relatedPurchaseOrderIds:
    string[];

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpInventoryItem = {
  id: string;

  externalItemId: string;

  itemCode: string;

  displayName: string;

  description: string;

  manufacturer: string;

  manufacturerPartNumber:
    string;

  unitOfMeasure: string;

  active: boolean;

  inventoryManaged: boolean;

  serialManaged: boolean;

  lotManaged: boolean;

  standardCost:
    number;

  averageCost:
    number;

  lastPurchaseCost:
    number;

  currency: string;

  internalSparePartId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpWarehouse = {
  id: string;

  externalWarehouseId:
    string;

  warehouseCode: string;

  displayName: string;

  plantCode: string;

  active: boolean;

  internalWarehouseId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpStockBalance = {
  id: string;

  itemCode: string;

  sparePartId:
    string | null;

  warehouseCode: string;

  locationCode: string;

  quantityOnHand:
    number;

  quantityAvailable:
    number;

  quantityReserved:
    number;

  quantityOnOrder:
    number;

  unitOfMeasure: string;

  lotNumber: string;

  serialNumbers: string[];

  lastUpdatedAt:
    string | null;

  notes: string;
};

export type ErpStockTransaction = {
  id: string;

  externalTransactionId:
    string;

  transactionType:
    | "receipt"
    | "issue"
    | "return"
    | "transfer"
    | "adjustment"
    | "scrap"
    | "reservation"
    | "other";

  transactionDate:
    string;

  itemCode: string;

  sparePartId:
    string | null;

  quantity: number;

  unitOfMeasure: string;

  fromWarehouseCode:
    string;

  fromLocationCode:
    string;

  toWarehouseCode:
    string;

  toLocationCode:
    string;

  workOrderId:
    string | null;

  assetId:
    string | null;

  purchaseOrderNumber:
    string;

  supplierCode: string;

  unitCost: number;

  totalCost: number;

  currency: string;

  internalInventoryTransactionId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpCostCenter = {
  id: string;

  externalCostCenterId:
    string;

  costCenterCode: string;

  displayName: string;

  description: string;

  active: boolean;

  plantCode: string;

  departmentCode: string;

  internalEntityId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpGlAccount = {
  id: string;

  externalGlAccountId:
    string;

  accountCode: string;

  displayName: string;

  description: string;

  active: boolean;

  accountType:
    string;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpBudgetRecord = {
  id: string;

  externalBudgetId:
    string;

  budgetCode: string;

  displayName: string;

  costCenterCode: string;

  glAccountCode: string;

  fiscalYear: number;

  fiscalPeriod:
    number | null;

  budgetAmount: number;

  committedAmount: number;

  actualAmount: number;

  remainingAmount: number;

  currency: string;

  internalBudgetId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpInvoice = {
  id: string;

  externalInvoiceId:
    string;

  invoiceNumber: string;

  supplierCode: string;

  supplierName: string;

  purchaseOrderNumber:
    string;

  invoiceDate:
    string | null;

  dueDate:
    string | null;

  status:
    | "open"
    | "approved"
    | "paid"
    | "cancelled"
    | "disputed";

  subtotalAmount:
    number;

  taxAmount:
    number;

  totalAmount:
    number;

  currency: string;

  costCenterCode: string;

  projectCode: string;

  internalCostRecordId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpWorkOrderReference = {
  id: string;

  externalWorkOrderId:
    string;

  workOrderNumber: string;

  displayName: string;

  status: string;

  assetCode: string;

  costCenterCode: string;

  projectCode: string;

  totalLaborCost:
    number;

  totalMaterialCost:
    number;

  totalContractorCost:
    number;

  totalCost: number;

  currency: string;

  internalWorkOrderId:
    string | null;

  lastSyncedAt:
    string | null;

  notes: string;
};

export type ErpSyncRecord = {
  id: string;

  syncSessionId: string;

  entityType:
    ErpEntityType;

  externalId: string;

  internalId:
    string | null;

  status:
    ErpRecordStatus;

  operation:
    | "create"
    | "update"
    | "delete"
    | "skip";

  direction:
    ErpSyncDirection;

  startedAt: string;

  completedAt:
    string | null;

  errorMessage: string;

  retryCount: number;

  notes: string;
};

export type ErpSyncConflict = {
  id: string;

  entityType:
    ErpEntityType;

  externalId: string;

  internalId:
    string | null;

  conflictFields:
    string[];

  externalUpdatedAt:
    string | null;

  internalUpdatedAt:
    string | null;

  resolution:
    ErpConflictResolution;

  resolvedAt:
    string | null;

  resolvedByPersonId:
    string | null;

  resolvedByName: string;

  notes: string;
};

export type ErpSyncSession = {
  id: string;

  sessionCode: string;

  triggerType:
    ErpTriggerType;

  status:
    ErpSyncStatus;

  direction:
    ErpSyncDirection;

  entityTypes:
    ErpEntityType[];

  startedAt: string;

  completedAt:
    string | null;

  processedRecordCount:
    number;

  successfulRecordCount:
    number;

  failedRecordCount:
    number;

  conflictCount: number;

  skippedRecordCount:
    number;

  durationMs:
    number | null;

  records:
    ErpSyncRecord[];

  conflictIds:
    string[];

  errorMessage: string;

  notes: string;
};

export type ErpSchedule = {
  id: string;

  scheduleCode: string;

  displayName: string;

  active: boolean;

  entityTypes:
    ErpEntityType[];

  direction:
    ErpSyncDirection;

  intervalMinutes:
    number;

  startTime: string;

  daysOfWeek:
    number[];

  lastRunAt:
    string | null;

  nextRunAt:
    string | null;

  notes: string;
};

export type ErpPerformanceMetrics = {
  totalSyncSessionCount:
    number;

  successfulSyncSessionCount:
    number;

  failedSyncSessionCount:
    number;

  partialSyncSessionCount:
    number;

  totalSyncedRecordCount:
    number;

  failedRecordCount:
    number;

  conflictCount: number;

  unresolvedConflictCount:
    number;

  supplierCount: number;

  purchaseOrderCount:
    number;

  openPurchaseOrderCount:
    number;

  purchaseRequestCount:
    number;

  inventoryItemCount:
    number;

  stockTransactionCount:
    number;

  budgetRecordCount:
    number;

  invoiceCount: number;

  averageSyncDurationMs:
    number;

  syncSuccessRatePercent:
    number;

  dataFreshnessScore:
    number;

  lastSuccessfulSyncAt:
    string | null;

  lastFailedSyncAt:
    string | null;
};

export type ErpEngineProfile = {
  engineHealthScore: number;

  connectionHealthScore:
    number;

  syncReliabilityScore:
    number;

  dataQualityScore:
    number;

  dataFreshnessScore:
    number;

  mappingCoverageScore:
    number;

  inventoryIntegrationScore:
    number;

  procurementIntegrationScore:
    number;

  costIntegrationScore:
    number;

  overallErpIntegrationScore:
    number;

  failedEntityTypes:
    ErpEntityType[];

  highConflictEntityTypes:
    ErpEntityType[];

  staleEntityTypes:
    ErpEntityType[];

  missingMappingEntityTypes:
    ErpEntityType[];

  unresolvedConflictIds:
    string[];

  recommendedActions:
    string[];

  mieSummary: string;

  lastAnalyzedAt:
    string | null;
};

export type ErpEngine = {
  id: string;

  /*
   * Identification
   */
  engineCode: string;

  displayName: string;

  description: string;

  version: string;

  /*
   * ERP system
   */
  systemType:
    ErpSystemType;

  systemName: string;

  systemVersion: string;

  status:
    ErpIntegrationStatus;

  active: boolean;

  /*
   * Connection
   */
  connections:
    ErpConnection[];

  /*
   * Mapping
   */
  entityMappings:
    ErpEntityMapping[];

  /*
   * Sync configuration
   */
  automaticSyncEnabled:
    boolean;

  defaultSyncDirection:
    ErpSyncDirection;

  syncIntervalMinutes:
    number;

  maximumSyncRetries:
    number;

  conflictResolutionMode:
    | "manual"
    | "prefer-erp"
    | "prefer-rubbermip";

  /*
   * Schedules
   */
  schedules:
    ErpSchedule[];

  /*
   * ERP data
   */
  suppliers:
    ErpSupplier[];

  purchaseOrders:
    ErpPurchaseOrder[];

  purchaseRequests:
    ErpPurchaseRequest[];

  inventoryItems:
    ErpInventoryItem[];

  warehouses:
    ErpWarehouse[];

  stockBalances:
    ErpStockBalance[];

  stockTransactions:
    ErpStockTransaction[];

  costCenters:
    ErpCostCenter[];

  glAccounts:
    ErpGlAccount[];

  budgets:
    ErpBudgetRecord[];

  invoices:
    ErpInvoice[];

  workOrderReferences:
    ErpWorkOrderReference[];

  /*
   * Sync
   */
  syncSessions:
    ErpSyncSession[];

  syncConflicts:
    ErpSyncConflict[];

  /*
   * Metrics
   */
  metrics:
    ErpPerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    ErpEngineProfile;

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

export type CreateErpEngineInput =
  Omit<
    ErpEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateErpEngineInput =
  Partial<CreateErpEngineInput>;

export type ErpEngineRepositoryResult = {
  success: boolean;

  erpEngine:
    ErpEngine | null;

  message: string;
};

export const defaultErpPerformanceMetrics:
  ErpPerformanceMetrics = {
  totalSyncSessionCount: 0,

  successfulSyncSessionCount: 0,

  failedSyncSessionCount: 0,

  partialSyncSessionCount: 0,

  totalSyncedRecordCount: 0,

  failedRecordCount: 0,

  conflictCount: 0,

  unresolvedConflictCount: 0,

  supplierCount: 0,

  purchaseOrderCount: 0,

  openPurchaseOrderCount: 0,

  purchaseRequestCount: 0,

  inventoryItemCount: 0,

  stockTransactionCount: 0,

  budgetRecordCount: 0,

  invoiceCount: 0,

  averageSyncDurationMs: 0,

  syncSuccessRatePercent: 0,

  dataFreshnessScore: 0,

  lastSuccessfulSyncAt: null,

  lastFailedSyncAt: null,
};

export const defaultErpEngineProfile:
  ErpEngineProfile = {
  engineHealthScore: 0,

  connectionHealthScore: 0,

  syncReliabilityScore: 0,

  dataQualityScore: 0,

  dataFreshnessScore: 0,

  mappingCoverageScore: 0,

  inventoryIntegrationScore: 0,

  procurementIntegrationScore: 0,

  costIntegrationScore: 0,

  overallErpIntegrationScore: 0,

  failedEntityTypes: [],

  highConflictEntityTypes: [],

  staleEntityTypes: [],

  missingMappingEntityTypes: [],

  unresolvedConflictIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultErpEngine:
  CreateErpEngineInput = {
  engineCode: "ERP",

  displayName:
    "ERP Integration Engine",

  description: "",

  version: "1.0.0",

  systemType: "priority",

  systemName: "Priority",

  systemVersion: "",

  status: "inactive",

  active: false,

  connections: [],

  entityMappings: [],

  automaticSyncEnabled:
    false,

  defaultSyncDirection:
    "bidirectional",

  syncIntervalMinutes: 60,

  maximumSyncRetries: 3,

  conflictResolutionMode:
    "manual",

  schedules: [],

  suppliers: [],

  purchaseOrders: [],

  purchaseRequests: [],

  inventoryItems: [],

  warehouses: [],

  stockBalances: [],

  stockTransactions: [],

  costCenters: [],

  glAccounts: [],

  budgets: [],

  invoices: [],

  workOrderReferences: [],

  syncSessions: [],

  syncConflicts: [],

  tags: [],

  notes: "",
};