export type WorkOrderStatus =
  | "open"
  | "paused"
  | "closed";

export type WorkOrderPriority =
  | "high"
  | "medium"
  | "low";

export type WorkOrderType =
  | "fault"
  | "preventive"
  | "safety"
  | "improvement";

export type ReplacedPart = {
  id: string;

  itemCode: string;

  description: string;

  quantity: number;
};

export type WorkOrder = {
  id: string;

  /*
   * Work order identity
   */
  workOrderNumber: string;

  /*
   * Asset identity
   *
   * Asset is now the single source
   * of truth for equipment.
   */
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  /*
   * Organizational context
   */
  department: string;

  /*
   * Work classification
   */
  type: WorkOrderType;

  status: WorkOrderStatus;

  priority: WorkOrderPriority;

  /*
   * Downtime
   */
  isDowntime: boolean;

  /*
   * Fault / maintenance description
   */
  faultDescription: string;

  repairDescription: string;

  /*
   * Opening
   */
  openedBy: string;

  openedAt: string;

  /*
   * Technician response
   */
  takenBy: string | null;

  takenAt: string | null;

  /*
   * Closure
   */
  closedBy: string | null;

  closedAt: string | null;

  /*
   * Parts
   */
  replacedParts: ReplacedPart[];

  /*
   * Duplicate call tracking
   */
  openedWhileAnotherCallWasOpen:
    boolean;
};

export type CreateWorkOrderInput = {
  /*
   * Asset identity
   */
  assetId: string;

  assetCode: string;

  assetNumber: string;

  assetName: string;

  /*
   * Organizational context
   */
  department: string;

  /*
   * Work classification
   */
  type: WorkOrderType;

  priority: WorkOrderPriority;

  isDowntime: boolean;

  /*
   * Opening
   */
  faultDescription: string;

  openedBy: string;
};

export type UpdateWorkOrderInput =
  Partial<
    Pick<
      WorkOrder,
      | "priority"
      | "isDowntime"
      | "faultDescription"
      | "repairDescription"
      | "department"
    >
  >;