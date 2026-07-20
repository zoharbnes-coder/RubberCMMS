/*
 * RubberMIP
 * Repository Types
 *
 * Shared contracts for the platform data access layer.
 */

export type RepositoryOperationStatus =
  | "success"
  | "error"
  | "not-found"
  | "validation-error"
  | "conflict"
  | "unauthorized"
  | "forbidden";

export type RepositorySortDirection =
  | "asc"
  | "desc";

export type RepositoryFilterOperator =
  | "equals"
  | "not-equals"
  | "contains"
  | "not-contains"
  | "starts-with"
  | "ends-with"
  | "greater-than"
  | "greater-than-or-equal"
  | "less-than"
  | "less-than-or-equal"
  | "in"
  | "not-in"
  | "exists"
  | "not-exists";

export type RepositoryFilterValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[];

export type RepositoryFilter = {
  field: string;

  operator:
    RepositoryFilterOperator;

  value:
    RepositoryFilterValue;
};

export type RepositorySort = {
  field: string;

  direction:
    RepositorySortDirection;
};

export type RepositoryPagination = {
  page: number;

  pageSize: number;
};

export type RepositoryQuery = {
  search?: string;

  filters?: RepositoryFilter[];

  sort?: RepositorySort[];

  pagination?: RepositoryPagination;

  includeInactive?: boolean;
};

export type RepositoryPaginationResult = {
  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
};

export type RepositoryListResult<T> = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  data: T[];

  pagination:
    RepositoryPaginationResult | null;

  message: string;

  errorCode:
    string | null;
};

export type RepositoryItemResult<T> = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  data: T | null;

  message: string;

  errorCode:
    string | null;
};

export type RepositoryDeleteResult = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  deletedId:
    string | null;

  message: string;

  errorCode:
    string | null;
};

export type RepositoryCountResult = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  count: number;

  message: string;

  errorCode:
    string | null;
};

export type RepositoryExistsResult = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  exists: boolean;

  message: string;

  errorCode:
    string | null;
};

export type RepositoryBulkResult<T> = {
  success: boolean;

  status:
    RepositoryOperationStatus;

  successfulItems: T[];

  failedItems: RepositoryBulkFailure[];

  totalRequested: number;

  totalSuccessful: number;

  totalFailed: number;

  message: string;
};

export type RepositoryBulkFailure = {
  id:
    string | null;

  index:
    number | null;

  errorCode:
    string | null;

  message: string;
};

export type RepositoryAuditContext = {
  personId:
    string | null;

  personName: string;

  userId:
    string | null;

  username: string;

  source:
    | "web"
    | "mobile"
    | "api"
    | "integration"
    | "system"
    | "import"
    | "other";

  timestamp: string;
};

export type RepositoryChangeType =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "archive";

export type RepositoryChangeRecord = {
  id: string;

  entityType: string;

  entityId: string;

  changeType:
    RepositoryChangeType;

  changedFields:
    string[];

  previousValues:
    Record<
      string,
      unknown
    >;

  newValues:
    Record<
      string,
      unknown
    >;

  auditContext:
    RepositoryAuditContext;

  createdAt: string;
};

export type RepositoryTransactionStatus =
  | "pending"
  | "committed"
  | "rolled-back"
  | "failed";

export type RepositoryTransaction = {
  id: string;

  status:
    RepositoryTransactionStatus;

  startedAt: string;

  completedAt:
    string | null;

  operationCount: number;

  errorMessage: string;

  auditContext:
    RepositoryAuditContext | null;
};

export interface Repository<
  TEntity,
  TCreateInput,
  TUpdateInput,
> {
  getAll(
    query?: RepositoryQuery,
  ): Promise<
    RepositoryListResult<TEntity>
  >;

  getById(
    id: string,
  ): Promise<
    RepositoryItemResult<TEntity>
  >;

  create(
    input: TCreateInput,
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryItemResult<TEntity>
  >;

  update(
    id: string,
    input: TUpdateInput,
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryItemResult<TEntity>
  >;

  delete(
    id: string,
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryDeleteResult
  >;

  exists(
    id: string,
  ): Promise<
    RepositoryExistsResult
  >;

  count(
    query?: RepositoryQuery,
  ): Promise<
    RepositoryCountResult
  >;
}

export interface BulkRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
> extends Repository<
    TEntity,
    TCreateInput,
    TUpdateInput
  > {
  createMany(
    inputs: TCreateInput[],
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryBulkResult<TEntity>
  >;

  updateMany(
    updates: {
      id: string;
      input: TUpdateInput;
    }[],
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryBulkResult<TEntity>
  >;

  deleteMany(
    ids: string[],
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryBulkResult<string>
  >;
}

export interface SearchableRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
> extends Repository<
    TEntity,
    TCreateInput,
    TUpdateInput
  > {
  search(
    searchText: string,
    query?: RepositoryQuery,
  ): Promise<
    RepositoryListResult<TEntity>
  >;
}

export interface ArchivableRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
> extends Repository<
    TEntity,
    TCreateInput,
    TUpdateInput
  > {
  archive(
    id: string,
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryItemResult<TEntity>
  >;

  restore(
    id: string,
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryItemResult<TEntity>
  >;
}

export interface AuditableRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
> extends Repository<
    TEntity,
    TCreateInput,
    TUpdateInput
  > {
  getChangeHistory(
    entityId: string,
  ): Promise<
    RepositoryListResult<
      RepositoryChangeRecord
    >
  >;
}

export interface TransactionalRepository {
  beginTransaction(
    auditContext?: RepositoryAuditContext,
  ): Promise<
    RepositoryItemResult<
      RepositoryTransaction
    >
  >;

  commitTransaction(
    transactionId: string,
  ): Promise<
    RepositoryItemResult<
      RepositoryTransaction
    >
  >;

  rollbackTransaction(
    transactionId: string,
  ): Promise<
    RepositoryItemResult<
      RepositoryTransaction
    >
  >;
}

export const createEmptyRepositoryListResult =
  <T>(): RepositoryListResult<T> => ({
    success: true,

    status: "success",

    data: [],

    pagination: null,

    message: "",

    errorCode: null,
  });

export const createRepositoryNotFoundResult =
  <T>(
    message = "Entity not found",
  ): RepositoryItemResult<T> => ({
    success: false,

    status: "not-found",

    data: null,

    message,

    errorCode: "NOT_FOUND",
  });

export const createRepositorySuccessResult =
  <T>(
    data: T,
    message = "",
  ): RepositoryItemResult<T> => ({
    success: true,

    status: "success",

    data,

    message,

    errorCode: null,
  });

export const createRepositoryErrorResult =
  <T>(
    message: string,
    errorCode = "REPOSITORY_ERROR",
  ): RepositoryItemResult<T> => ({
    success: false,

    status: "error",

    data: null,

    message,

    errorCode,
  });

export const createRepositoryDeleteSuccessResult =
  (
    deletedId: string,
    message = "",
  ): RepositoryDeleteResult => ({
    success: true,

    status: "success",

    deletedId,

    message,

    errorCode: null,
  });

export const createRepositoryDeleteErrorResult =
  (
    message: string,
    errorCode = "DELETE_ERROR",
  ): RepositoryDeleteResult => ({
    success: false,

    status: "error",

    deletedId: null,

    message,

    errorCode,
  });