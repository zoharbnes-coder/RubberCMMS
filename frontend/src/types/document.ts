export type DocumentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "superseded"
  | "obsolete"
  | "archived";

export type DocumentType =
  | "drawing"
  | "manual"
  | "sop"
  | "loto"
  | "procedure"
  | "work-instruction"
  | "datasheet"
  | "certificate"
  | "inspection-report"
  | "test-report"
  | "maintenance-report"
  | "service-report"
  | "failure-analysis"
  | "risk-assessment"
  | "permit"
  | "contract"
  | "purchase-specification"
  | "training-material"
  | "photo"
  | "video"
  | "external-link"
  | "other";

export type DocumentCategory =
  | "technical"
  | "maintenance"
  | "engineering"
  | "safety"
  | "quality"
  | "operations"
  | "procurement"
  | "inventory"
  | "training"
  | "legal"
  | "regulatory"
  | "project"
  | "other";

export type DocumentFormat =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "dwg"
  | "dxf"
  | "step"
  | "stp"
  | "iges"
  | "jpg"
  | "jpeg"
  | "png"
  | "webp"
  | "mp4"
  | "mov"
  | "txt"
  | "csv"
  | "url"
  | "other";

export type DocumentVisibility =
  | "public"
  | "internal"
  | "restricted"
  | "confidential"
  | "management-only"
  | "safety-only"
  | "engineering-only";

export type DocumentApprovalStatus =
  | "not-required"
  | "pending"
  | "approved"
  | "rejected";

export type DocumentVerificationStatus =
  | "not-required"
  | "pending"
  | "verified"
  | "rejected"
  | "expired";

export type DocumentSourceType =
  | "internal"
  | "manufacturer"
  | "supplier"
  | "contractor"
  | "regulator"
  | "consultant"
  | "customer"
  | "external";

export type DocumentRelationshipType =
  | "parent"
  | "child"
  | "supersedes"
  | "superseded-by"
  | "reference"
  | "attachment"
  | "related"
  | "derived-from"
  | "revision-of"
  | "other";

export type DocumentReferenceScope =
  | "organization"
  | "plant"
  | "department"
  | "functional-location"
  | "equipment-class"
  | "asset"
  | "failure-mode"
  | "failure-event"
  | "maintenance-request"
  | "work-order"
  | "skill"
  | "certification"
  | "person"
  | "team"
  | "contractor"
  | "spare-part"
  | "inventory"
  | "project"
  | "other";

export type DocumentFile = {
  id: string;

  fileName: string;

  originalFileName: string;

  format:
    DocumentFormat;

  mimeType: string;

  fileSizeBytes: number;

  storagePath: string;

  downloadUrl: string;

  previewUrl: string;

  checksum: string;

  uploadedAt: string;

  uploadedByPersonId:
    string | null;

  uploadedByName: string;

  primary: boolean;

  notes: string;
};

export type DocumentRevision = {
  id: string;

  revisionNumber: string;

  revisionCode: string;

  description: string;

  changeSummary: string;

  fileIds: string[];

  status:
    DocumentStatus;

  createdAt: string;

  createdByPersonId:
    string | null;

  createdByName: string;

  approvedAt: string | null;

  approvedByPersonId:
    string | null;

  approvedByName: string;

  effectiveFrom: string | null;

  effectiveUntil: string | null;

  notes: string;
};

export type DocumentApproval = {
  id: string;

  approvalStatus:
    DocumentApprovalStatus;

  approvalStep: number;

  approvalRole: string;

  assignedPersonId:
    string | null;

  assignedPersonName: string;

  approvedAt: string | null;

  rejectedAt: string | null;

  comments: string;

  mandatory: boolean;
};

export type DocumentVerification = {
  required: boolean;

  status:
    DocumentVerificationStatus;

  verificationMethod:
    | "manual"
    | "document-review"
    | "authority-check"
    | "manufacturer-check"
    | "digital-registry"
    | "system-validation"
    | "other";

  verifiedAt: string | null;

  verifiedByPersonId:
    string | null;

  verifiedByName: string;

  validUntil: string | null;

  notes: string;
};

export type DocumentRelationship = {
  id: string;

  relatedDocumentId: string;

  relatedDocumentNumber: string;

  relatedDocumentName: string;

  relationshipType:
    DocumentRelationshipType;

  notes: string;
};

export type DocumentEntityReference = {
  id: string;

  scope:
    DocumentReferenceScope;

  entityId: string;

  entityCode: string;

  entityName: string;

  primary: boolean;

  mandatory: boolean;

  notes: string;
};

export type DocumentAccessRule = {
  id: string;

  roleId: string | null;

  roleName: string;

  personId: string | null;

  personName: string;

  teamId: string | null;

  teamName: string;

  canView: boolean;

  canDownload: boolean;

  canUploadRevision: boolean;

  canEditMetadata: boolean;

  canApprove: boolean;

  canDelete: boolean;

  notes: string;
};

export type DocumentRetentionPolicy = {
  enabled: boolean;

  retentionYears:
    number | null;

  retainForever: boolean;

  archiveAfterYears:
    number | null;

  deleteAfterYears:
    number | null;

  regulatoryRetention:
    boolean;

  legalHold: boolean;

  notes: string;
};

export type DocumentNotificationPolicy = {
  enabled: boolean;

  notifyOnNewRevision:
    boolean;

  notifyOnApprovalRequired:
    boolean;

  notifyOnApprovalCompleted:
    boolean;

  notifyBeforeExpiration:
    boolean;

  expirationReminderDays:
    number[];

  notifyPersonIds: string[];

  notifyTeamIds: string[];

  notifyRoleIds: string[];
};

export type DocumentUsageMetrics = {
  viewCount: number;

  downloadCount: number;

  revisionCount: number;

  linkedEntityCount: number;

  workOrderReferenceCount:
    number;

  failureEventReferenceCount:
    number;

  lastViewedAt: string | null;

  lastDownloadedAt: string | null;

  lastReferencedAt: string | null;
};

export type DocumentMieProfile = {
  relevanceScore: number;

  usageScore: number;

  freshnessScore: number;

  reliabilityScore: number;

  overallKnowledgeScore:
    number;

  relatedAssetIds: string[];

  relatedEquipmentClassIds:
    string[];

  relatedFailureModeIds:
    string[];

  relatedWorkOrderIds:
    string[];

  relatedSparePartIds:
    string[];

  recommendedForAssetIds:
    string[];

  recommendedForFailureModeIds:
    string[];

  recommendedForWorkOrderTypes:
    string[];

  keywords: string[];

  mieSummary: string;

  lastAnalyzedAt: string | null;
};

export type Document = {
  id: string;

  /*
   * Identification
   */
  documentNumber: string;

  documentCode: string;

  displayName: string;

  shortName: string;

  description: string;

  /*
   * Classification
   */
  documentType:
    DocumentType;

  category:
    DocumentCategory;

  status:
    DocumentStatus;

  active: boolean;

  visibility:
    DocumentVisibility;

  sourceType:
    DocumentSourceType;

  /*
   * Source
   */
  sourceOrganizationName:
    string;

  manufacturerName: string;

  supplierId: string | null;

  contractorId: string | null;

  externalReferenceNumber:
    string;

  /*
   * Versioning
   */
  currentRevision: string;

  revisions:
    DocumentRevision[];

  /*
   * Files
   */
  files:
    DocumentFile[];

  /*
   * Approval
   */
  approvalRequired: boolean;

  approvalStatus:
    DocumentApprovalStatus;

  approvals:
    DocumentApproval[];

  /*
   * Verification
   */
  verification:
    DocumentVerification;

  /*
   * Validity
   */
  issueDate: string | null;

  effectiveFrom: string | null;

  effectiveUntil: string | null;

  expirationDate: string | null;

  reviewRequired: boolean;

  reviewIntervalMonths:
    number | null;

  lastReviewDate:
    string | null;

  nextReviewDate:
    string | null;

  /*
   * Relationships
   */
  relationships:
    DocumentRelationship[];

  entityReferences:
    DocumentEntityReference[];

  /*
   * Access
   */
  accessRules:
    DocumentAccessRule[];

  /*
   * Retention
   */
  retentionPolicy:
    DocumentRetentionPolicy;

  /*
   * Notifications
   */
  notificationPolicy:
    DocumentNotificationPolicy;

  /*
   * Search
   */
  keywords: string[];

  tags: string[];

  notes: string;

  /*
   * Analytics
   */
  usageMetrics:
    DocumentUsageMetrics;

  /*
   * Intelligence
   */
  mieProfile:
    DocumentMieProfile;

  /*
   * Audit
   */
  createdAt: string;

  updatedAt: string;

  createdByPersonId:
    string | null;

  createdByName: string;

  updatedByPersonId:
    string | null;

  updatedByName: string;
};

export type CreateDocumentInput =
  Omit<
    Document,
    | "id"
    | "usageMetrics"
    | "mieProfile"
    | "createdAt"
    | "updatedAt"
  >;

export type UpdateDocumentInput =
  Partial<CreateDocumentInput>;

export type DocumentRepositoryResult = {
  success: boolean;

  document: Document | null;

  message: string;
};

export const defaultDocumentVerification:
  DocumentVerification = {
  required: false,

  status: "not-required",

  verificationMethod:
    "manual",

  verifiedAt: null,

  verifiedByPersonId: null,

  verifiedByName: "",

  validUntil: null,

  notes: "",
};

export const defaultDocumentRetentionPolicy:
  DocumentRetentionPolicy = {
  enabled: true,

  retentionYears: null,

  retainForever: true,

  archiveAfterYears: null,

  deleteAfterYears: null,

  regulatoryRetention: false,

  legalHold: false,

  notes: "",
};

export const defaultDocumentNotificationPolicy:
  DocumentNotificationPolicy = {
  enabled: false,

  notifyOnNewRevision: false,

  notifyOnApprovalRequired:
    false,

  notifyOnApprovalCompleted:
    false,

  notifyBeforeExpiration:
    false,

  expirationReminderDays: [
    90,
    60,
    30,
    14,
    7,
  ],

  notifyPersonIds: [],

  notifyTeamIds: [],

  notifyRoleIds: [],
};

export const defaultDocumentUsageMetrics:
  DocumentUsageMetrics = {
  viewCount: 0,

  downloadCount: 0,

  revisionCount: 0,

  linkedEntityCount: 0,

  workOrderReferenceCount: 0,

  failureEventReferenceCount: 0,

  lastViewedAt: null,

  lastDownloadedAt: null,

  lastReferencedAt: null,
};

export const defaultDocumentMieProfile:
  DocumentMieProfile = {
  relevanceScore: 0,

  usageScore: 0,

  freshnessScore: 0,

  reliabilityScore: 0,

  overallKnowledgeScore: 0,

  relatedAssetIds: [],

  relatedEquipmentClassIds: [],

  relatedFailureModeIds: [],

  relatedWorkOrderIds: [],

  relatedSparePartIds: [],

  recommendedForAssetIds: [],

  recommendedForFailureModeIds:
    [],

  recommendedForWorkOrderTypes:
    [],

  keywords: [],

  mieSummary: "",

  lastAnalyzedAt: null,
};

export const defaultDocument:
  CreateDocumentInput = {
  documentNumber: "",

  documentCode: "",

  displayName: "",

  shortName: "",

  description: "",

  documentType: "manual",

  category: "technical",

  status: "draft",

  active: true,

  visibility: "internal",

  sourceType: "internal",

  sourceOrganizationName: "",

  manufacturerName: "",

  supplierId: null,

  contractorId: null,

  externalReferenceNumber: "",

  currentRevision: "",

  revisions: [],

  files: [],

  approvalRequired: false,

  approvalStatus:
    "not-required",

  approvals: [],

  verification:
    defaultDocumentVerification,

  issueDate: null,

  effectiveFrom: null,

  effectiveUntil: null,

  expirationDate: null,

  reviewRequired: false,

  reviewIntervalMonths: null,

  lastReviewDate: null,

  nextReviewDate: null,

  relationships: [],

  entityReferences: [],

  accessRules: [],

  retentionPolicy:
    defaultDocumentRetentionPolicy,

  notificationPolicy:
    defaultDocumentNotificationPolicy,

  keywords: [],

  tags: [],

  notes: "",

  createdByPersonId: null,

  createdByName: "",

  updatedByPersonId: null,

  updatedByName: "",
};