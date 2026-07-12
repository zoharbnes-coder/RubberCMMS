import type { WorkOrder } from "../types/workOrder";

export type DurationResult = {
  totalMinutes: number;
  display: string;
};

function calculateDuration(
  startValue: string | null,
  endValue: string | null
): DurationResult | null {
  if (!startValue) {
    return null;
  }

  const startTime = new Date(startValue).getTime();

  const endTime = endValue
    ? new Date(endValue).getTime()
    : Date.now();

  if (
    Number.isNaN(startTime) ||
    Number.isNaN(endTime) ||
    endTime < startTime
  ) {
    return null;
  }

  const totalMinutes = Math.floor(
    (endTime - startTime) / 60000
  );

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor(
    (totalMinutes % 1440) / 60
  );
  const minutes = totalMinutes % 60;

  let display = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}`;

  if (days > 0) {
    display = `${days} ימים ${display}`;
  }

  return {
    totalMinutes,
    display,
  };
}

export function getResponseTime(
  workOrder: WorkOrder
): DurationResult | null {
  if (!workOrder.takenAt) {
    return null;
  }

  return calculateDuration(
    workOrder.openedAt,
    workOrder.takenAt
  );
}

export function getRepairTime(
  workOrder: WorkOrder
): DurationResult | null {
  if (!workOrder.takenAt) {
    return null;
  }

  return calculateDuration(
    workOrder.takenAt,
    workOrder.closedAt
  );
}

export function getDowntime(
  workOrder: WorkOrder
): DurationResult | null {
  if (!workOrder.isDowntime) {
    return null;
  }

  return calculateDuration(
    workOrder.openedAt,
    workOrder.closedAt
  );
}

export function getOpenTime(
  workOrder: WorkOrder
): DurationResult {
  return (
    calculateDuration(
      workOrder.openedAt,
      workOrder.closedAt
    ) ?? {
      totalMinutes: 0,
      display: "00:00",
    }
  );
}

export function formatMinutes(
  totalMinutes: number
): string {
  const safeMinutes = Math.max(
    0,
    Math.floor(totalMinutes)
  );

  const days = Math.floor(safeMinutes / 1440);
  const hours = Math.floor(
    (safeMinutes % 1440) / 60
  );
  const minutes = safeMinutes % 60;

  const time = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}`;

  return days > 0 ? `${days} ימים ${time}` : time;
}