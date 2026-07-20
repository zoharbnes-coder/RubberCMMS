export type MobilePlatform =
  | "android"
  | "ios"
  | "web"
  | "pwa";

export type MobileDeviceStatus =
  | "active"
  | "inactive"
  | "blocked"
  | "lost"
  | "retired";

export type MobileSyncStatus =
  | "idle"
  | "syncing"
  | "synced"
  | "pending"
  | "failed"
  | "conflict"
  | "offline";

export type MobileConnectionType =
  | "wifi"
  | "cellular"
  | "ethernet"
  | "offline"
  | "unknown";

export type MobileNotificationType =
  | "new-request"
  | "new-work-order"
  | "work-order-update"
  | "work-order-assignment"
  | "priority-change"
  | "escalation"
  | "risk"
  | "recommendation"
  | "prediction"
  | "inventory"
  | "spare-part"
  | "certification"
  | "inspection"
  | "document"
  | "system"
  | "other";

export type MobileNotificationStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "dismissed";

export type MobileActionType =
  | "open-request"
  | "open-work-order"
  | "create-request"
  | "create-work-order"
  | "start-work"
  | "pause-work"
  | "resume-work"
  | "complete-work"
  | "close-work"
  | "add-note"
  | "add-photo"
  | "add-video"
  | "add-document"
  | "scan-barcode"
  | "scan-qr"
  | "use-spare-part"
  | "reserve-spare-part"
  | "return-spare-part"
  | "perform-inspection"
  | "approve"
  | "reject"
  | "acknowledge"
  | "navigate"
  | "call"
  | "other";

export type MobileEntityType =
  | "plant"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "failure-mode"
  | "failure-event"
  | "maintenance-request"
  | "work-order"
  | "person"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "document"
  | "risk"
  | "recommendation"
  | "prediction"
  | "other";

export type MobileMediaType =
  | "photo"
  | "video"
  | "audio"
  | "document"
  | "signature"
  | "other";

export type MobileOfflineOperationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "conflict";

export type MobilePermissionStatus =
  | "granted"
  | "denied"
  | "restricted"
  | "not-requested"
  | "unknown";

export type MobileEntityReference = {
  entityType: MobileEntityType;

  entityId: string;

  entityCode: string;

  entityName: string;
};

export type MobileDevice = {
  id: string;

  deviceCode: string;

  displayName: string;

  platform: MobilePlatform;

  status: MobileDeviceStatus;

  active: boolean;

  deviceIdentifier: string;

  manufacturer: string;

  model: string;

  osVersion: string;

  appVersion: string;

  browserVersion: string;

  userAgent: string;

  assignedPersonId: string | null;

  assignedPersonName: string;

  lastLoginAt: string | null;

  lastSeenAt: string | null;

  lastSyncAt: string | null;

  pushToken: string;

  biometricEnabled: boolean;

  pinEnabled: boolean;

  remoteWipeEnabled: boolean;

  notes: string;
};

export type MobilePermissionProfile = {
  camera: MobilePermissionStatus;

  microphone: MobilePermissionStatus;

  location: MobilePermissionStatus;

  notifications: MobilePermissionStatus;

  photos: MobilePermissionStatus;

  storage: MobilePermissionStatus;

  bluetooth: MobilePermissionStatus;

  nfc: MobilePermissionStatus;

  barcodeScannerEnabled: boolean;

  qrScannerEnabled: boolean;

  offlineModeEnabled: boolean;

  backgroundSyncEnabled: boolean;
};

export type MobileLocation = {
  latitude: number | null;

  longitude: number | null;

  accuracyMeters: number | null;

  altitudeMeters: number | null;

  capturedAt: string | null;

  source:
    | "gps"
    | "network"
    | "manual"
    | "unknown";

  notes: string;
};

export type MobileMediaAttachment = {
  id: string;

  mediaType: MobileMediaType;

  entityReference:
    MobileEntityReference | null;

  fileName: string;

  mimeType: string;

  fileSizeBytes: number;

  localUri: string;

  remoteUrl: string;

  thumbnailUrl: string;

  capturedAt: string | null;

  uploadedAt: string | null;

  uploaded: boolean;

  uploadProgressPercent: number;

  createdByPersonId: string | null;

  createdByName: string;

  location:
    MobileLocation | null;

  notes: string;
};

export type MobileNotification = {
  id: string;

  notificationCode: string;

  notificationType:
    MobileNotificationType;

  status:
    MobileNotificationStatus;

  title: string;

  message: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  entityReference:
    MobileEntityReference | null;

  actionType:
    MobileActionType | null;

  actionUrl: string;

  personId: string | null;

  teamId: string | null;

  deviceIds: string[];

  createdAt: string;

  scheduledAt: string | null;

  sentAt: string | null;

  deliveredAt: string | null;

  readAt: string | null;

  expiresAt: string | null;

  retryCount: number;

  errorMessage: string;

  notes: string;
};

export type MobileOfflineOperation = {
  id: string;

  operationCode: string;

  operationType:
    | "create"
    | "update"
    | "delete"
    | "upload"
    | "action";

  entityReference:
    MobileEntityReference | null;

  actionType:
    MobileActionType | null;

  payload: Record<
    string,
    string | number | boolean | null
  >;

  status:
    MobileOfflineOperationStatus;

  createdAt: string;

  lastAttemptAt: string | null;

  completedAt: string | null;

  retryCount: number;

  maximumRetries: number;

  conflictReason: string;

  errorMessage: string;

  notes: string;
};

export type MobileSyncConflict = {
  id: string;

  entityReference:
    MobileEntityReference;

  localUpdatedAt: string;

  serverUpdatedAt: string;

  localVersion: number | null;

  serverVersion: number | null;

  conflictFields: string[];

  resolution:
    | "pending"
    | "use-local"
    | "use-server"
    | "merged"
    | "manual";

  resolvedAt: string | null;

  resolvedByPersonId: string | null;

  resolvedByName: string;

  notes: string;
};

export type MobileSyncSession = {
  id: string;

  deviceId: string;

  personId: string | null;

  status: MobileSyncStatus;

  connectionType:
    MobileConnectionType;

  startedAt: string;

  completedAt: string | null;

  uploadedRecordCount: number;

  downloadedRecordCount: number;

  failedRecordCount: number;

  conflictCount: number;

  pendingOperationCount: number;

  durationMs: number | null;

  errorMessage: string;

  notes: string;
};

export type MobileQuickAction = {
  id: string;

  actionType: MobileActionType;

  displayName: string;

  iconName: string;

  order: number;

  enabled: boolean;

  requiredRoleIds: string[];

  requiredPermissionNames: string[];

  defaultEntityType:
    MobileEntityType | null;

  notes: string;
};

export type MobileWorkOrderView = {
  id: string;

  workOrderId: string;

  workOrderNumber: string;

  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  status: string;

  assetId: string | null;

  assetCode: string;

  assetName: string;

  functionalLocationName: string;

  assignedPersonIds: string[];

  assignedTeamId: string | null;

  plannedStartAt: string | null;

  dueAt: string | null;

  startedAt: string | null;

  completedAt: string | null;

  downtimeMinutes: number | null;

  requiredSkillIds: string[];

  requiredCertificationIds: string[];

  sparePartIds: string[];

  documentIds: string[];

  mediaAttachments:
    MobileMediaAttachment[];

  offlineAvailable: boolean;

  lastSyncedAt: string | null;

  notes: string;
};

export type MobileAssetView = {
  id: string;

  assetId: string;

  assetCode: string;

  assetName: string;

  description: string;

  functionalLocationId: string | null;

  functionalLocationName: string;

  equipmentClassId: string | null;

  equipmentClassName: string;

  status: string;

  criticality: string;

  qrCode: string;

  barcode: string;

  openFailureCount: number;

  openWorkOrderCount: number;

  activeRiskCount: number;

  documentIds: string[];

  sparePartIds: string[];

  recommendationIds: string[];

  offlineAvailable: boolean;

  lastSyncedAt: string | null;

  notes: string;
};

export type MobileSparePartView = {
  id: string;

  sparePartId: string;

  partNumber: string;

  displayName: string;

  barcode: string;

  qrCode: string;

  availableQuantity: number;

  reservedQuantity: number;

  unitOfMeasure: string;

  warehouseName: string;

  locationCode: string;

  criticality: string;

  stockStatus: string;

  compatibleAssetIds: string[];

  offlineAvailable: boolean;

  lastSyncedAt: string | null;

  notes: string;
};

export type MobileUserPreferences = {
  language: string;

  darkModeEnabled: boolean;

  compactModeEnabled: boolean;

  vibrationEnabled: boolean;

  soundEnabled: boolean;

  pushNotificationsEnabled: boolean;

  criticalNotificationsOnly: boolean;

  offlineDownloadEnabled: boolean;

  autoDownloadAssignedWorkOrders: boolean;

  autoDownloadDocuments: boolean;

  autoUploadMedia: boolean;

  uploadOnlyOnWifi: boolean;

  showAssetQrScanner: boolean;

  showSparePartScanner: boolean;

  defaultHomePage:
    | "dashboard"
    | "work-orders"
    | "requests"
    | "assets"
    | "scanner";

  quickActionIds: string[];

  notes: string;
};

export type MobileSession = {
  id: string;

  personId: string;

  personName: string;

  deviceId: string;

  startedAt: string;

  lastActivityAt: string;

  expiresAt: string | null;

  active: boolean;

  offline: boolean;

  connectionType:
    MobileConnectionType;

  currentLocation:
    MobileLocation | null;

  notes: string;
};

export type MobilePerformanceMetrics = {
  activeDeviceCount: number;

  activeUserCount: number;

  onlineUserCount: number;

  offlineUserCount: number;

  pendingSyncOperationCount: number;

  failedSyncOperationCount: number;

  syncConflictCount: number;

  pendingMediaUploadCount: number;

  notificationSentCount: number;

  notificationDeliveredCount: number;

  notificationReadCount: number;

  averageSyncDurationMs: number;

  averageNotificationDeliverySeconds:
    number;

  workOrdersStartedFromMobile:
    number;

  workOrdersCompletedFromMobile:
    number;

  requestsCreatedFromMobile:
    number;

  photosUploadedCount: number;

  qrScanCount: number;

  barcodeScanCount: number;

  lastSyncAt: string | null;

  lastMobileActivityAt: string | null;
};

export type MobileEngineProfile = {
  mobileHealthScore: number;

  syncReliabilityScore: number;

  notificationDeliveryScore: number;

  offlineCapabilityScore: number;

  mobileAdoptionScore: number;

  fieldUsageScore: number;

  dataQualityScore: number;

  userEngagementScore: number;

  overallMobilePerformanceScore:
    number;

  inactiveDeviceIds: string[];

  highFailureDeviceIds: string[];

  unresolvedConflictIds: string[];

  highOfflineUsagePersonIds: string[];

  lowMobileAdoptionTeamIds: string[];

  recommendedOfflineEntityIds:
    string[];

  recommendedActions: string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type MobileEngine = {
  id: string;

  /*
   * Identification
   */
  engineCode: string;

  displayName: string;

  description: string;

  version: string;

  /*
   * Configuration
   */
  active: boolean;

  supportedPlatforms:
    MobilePlatform[];

  minimumSupportedAppVersion:
    string;

  offlineModeEnabled: boolean;

  backgroundSyncEnabled: boolean;

  pushNotificationsEnabled:
    boolean;

  locationServicesEnabled:
    boolean;

  mediaUploadEnabled: boolean;

  qrScanningEnabled: boolean;

  barcodeScanningEnabled:
    boolean;

  biometricLoginEnabled:
    boolean;

  /*
   * Sync configuration
   */
  automaticSyncEnabled: boolean;

  syncIntervalMinutes: number;

  maximumOfflineDays: number;

  maximumSyncRetries: number;

  mediaUploadOnlyOnWifi:
    boolean;

  /*
   * Devices
   */
  devices:
    MobileDevice[];

  /*
   * Sessions
   */
  sessions:
    MobileSession[];

  /*
   * Sync
   */
  syncSessions:
    MobileSyncSession[];

  offlineOperations:
    MobileOfflineOperation[];

  syncConflicts:
    MobileSyncConflict[];

  /*
   * Notifications
   */
  notifications:
    MobileNotification[];

  /*
   * Quick actions
   */
  quickActions:
    MobileQuickAction[];

  /*
   * Cached mobile views
   */
  workOrderViews:
    MobileWorkOrderView[];

  assetViews:
    MobileAssetView[];

  sparePartViews:
    MobileSparePartView[];

  /*
   * Metrics
   */
  metrics:
    MobilePerformanceMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    MobileEngineProfile;

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

export type CreateMobileDeviceInput =
  Omit<
    MobileDevice,
    "id"
  >;

export type UpdateMobileDeviceInput =
  Partial<CreateMobileDeviceInput>;

export type CreateMobileNotificationInput =
  Omit<
    MobileNotification,
    "id"
  >;

export type UpdateMobileNotificationInput =
  Partial<CreateMobileNotificationInput>;

export type CreateMobileEngineInput =
  Omit<
    MobileEngine,
    | "id"
    | "metrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateMobileEngineInput =
  Partial<CreateMobileEngineInput>;

export type MobileEngineRepositoryResult = {
  success: boolean;

  mobileEngine:
    MobileEngine | null;

  message: string;
};

export const defaultMobilePermissionProfile:
  MobilePermissionProfile = {
  camera: "not-requested",

  microphone: "not-requested",

  location: "not-requested",

  notifications: "not-requested",

  photos: "not-requested",

  storage: "not-requested",

  bluetooth: "not-requested",

  nfc: "not-requested",

  barcodeScannerEnabled: true,

  qrScannerEnabled: true,

  offlineModeEnabled: true,

  backgroundSyncEnabled: true,
};

export const defaultMobileUserPreferences:
  MobileUserPreferences = {
  language: "he",

  darkModeEnabled: false,

  compactModeEnabled: false,

  vibrationEnabled: true,

  soundEnabled: true,

  pushNotificationsEnabled: true,

  criticalNotificationsOnly: false,

  offlineDownloadEnabled: true,

  autoDownloadAssignedWorkOrders:
    true,

  autoDownloadDocuments: false,

  autoUploadMedia: true,

  uploadOnlyOnWifi: false,

  showAssetQrScanner: true,

  showSparePartScanner: true,

  defaultHomePage: "work-orders",

  quickActionIds: [],

  notes: "",
};

export const defaultMobilePerformanceMetrics:
  MobilePerformanceMetrics = {
  activeDeviceCount: 0,

  activeUserCount: 0,

  onlineUserCount: 0,

  offlineUserCount: 0,

  pendingSyncOperationCount: 0,

  failedSyncOperationCount: 0,

  syncConflictCount: 0,

  pendingMediaUploadCount: 0,

  notificationSentCount: 0,

  notificationDeliveredCount: 0,

  notificationReadCount: 0,

  averageSyncDurationMs: 0,

  averageNotificationDeliverySeconds:
    0,

  workOrdersStartedFromMobile: 0,

  workOrdersCompletedFromMobile: 0,

  requestsCreatedFromMobile: 0,

  photosUploadedCount: 0,

  qrScanCount: 0,

  barcodeScanCount: 0,

  lastSyncAt: null,

  lastMobileActivityAt: null,
};

export const defaultMobileEngineProfile:
  MobileEngineProfile = {
  mobileHealthScore: 0,

  syncReliabilityScore: 0,

  notificationDeliveryScore: 0,

  offlineCapabilityScore: 0,

  mobileAdoptionScore: 0,

  fieldUsageScore: 0,

  dataQualityScore: 0,

  userEngagementScore: 0,

  overallMobilePerformanceScore: 0,

  inactiveDeviceIds: [],

  highFailureDeviceIds: [],

  unresolvedConflictIds: [],

  highOfflineUsagePersonIds: [],

  lowMobileAdoptionTeamIds: [],

  recommendedOfflineEntityIds: [],

  recommendedActions: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultMobileEngine:
  CreateMobileEngineInput = {
  engineCode: "MOBILE",

  displayName:
    "Maintenance Mobile Engine",

  description: "",

  version: "1.0.0",

  active: true,

  supportedPlatforms: [
    "android",
    "ios",
    "web",
    "pwa",
  ],

  minimumSupportedAppVersion:
    "1.0.0",

  offlineModeEnabled: true,

  backgroundSyncEnabled: true,

  pushNotificationsEnabled:
    true,

  locationServicesEnabled:
    false,

  mediaUploadEnabled: true,

  qrScanningEnabled: true,

  barcodeScanningEnabled: true,

  biometricLoginEnabled: false,

  automaticSyncEnabled: true,

  syncIntervalMinutes: 5,

  maximumOfflineDays: 7,

  maximumSyncRetries: 5,

  mediaUploadOnlyOnWifi: false,

  devices: [],

  sessions: [],

  syncSessions: [],

  offlineOperations: [],

  syncConflicts: [],

  notifications: [],

  quickActions: [],

  workOrderViews: [],

  assetViews: [],

  sparePartViews: [],

  tags: [],

  notes: "",
};