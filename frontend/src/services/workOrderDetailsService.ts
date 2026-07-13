import type { WorkOrder } from "../types/workOrder";

import { getWorkOrderById } from "./workOrderService";
import {
  getDowntime,
  getOpenTime,
  getRepairTime,
  getResponseTime,
} from "../utils/workOrderMetrics";

export type WorkOrderDetailsSnapshot = {
  generatedAt: string;

  workOrder: WorkOrder;

  openTimeMinutes: number;
  responseTimeMinutes: number | null;
  repairTimeMinutes: number | null;
  downtimeMinutes: number | null;

  hasStarted: boolean;
  isPaused: boolean;
  isClosed: boolean;
  hasReplacedParts: boolean;
};

export function getWorkOrderDetailsSnapshot(
  workOrderId: string
): WorkOrderDetailsSnapshot | null {
  const workOrder = getWorkOrderById(workOrderId);

  if (!workOrder) {
    return null;
  }

  const openTime = getOpenTime(workOrder);
  const responseTime = getResponseTime(workOrder);
  const repairTime = getRepairTime(workOrder);
  const downtime = getDowntime(workOrder);

  return {
    generatedAt: new Date().toISOString(),

    workOrder,

    openTimeMinutes: openTime.totalMinutes,

    responseTimeMinutes:
      responseTime?.totalMinutes ?? null,

    repairTimeMinutes:
      repairTime?.totalMinutes ?? null,

    downtimeMinutes:
      downtime?.totalMinutes ?? null,

    hasStarted: Boolean(workOrder.takenAt),

    isPaused: workOrder.status === "paused",

    isClosed: workOrder.status === "closed",

    hasReplacedParts:
      workOrder.replacedParts.length > 0,
  };
}