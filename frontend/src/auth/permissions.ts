import type { UserRole } from "../data/users";

export type AppPermission =
  | "open_work_order"
  | "view_work_orders"
  | "update_work_orders"
  | "close_work_orders"
  | "view_dashboard"
  | "view_machines"
  | "view_history"
  | "view_analytics"
  | "manage_settings";

const rolePermissions: Record<UserRole, AppPermission[]> = {
  operator: [
    "open_work_order",
  ],

  technician: [
    "open_work_order",
    "view_work_orders",
    "update_work_orders",
    "close_work_orders",
    "view_dashboard",
    "view_machines",
    "view_history",
  ],

  electrician: [
    "open_work_order",
    "view_work_orders",
    "update_work_orders",
    "close_work_orders",
    "view_dashboard",
    "view_machines",
    "view_history",
  ],

  manager: [
    "open_work_order",
    "view_work_orders",
    "update_work_orders",
    "close_work_orders",
    "view_dashboard",
    "view_machines",
    "view_history",
    "view_analytics",
  ],

  admin: [
    "open_work_order",
    "view_work_orders",
    "update_work_orders",
    "close_work_orders",
    "view_dashboard",
    "view_machines",
    "view_history",
    "view_analytics",
    "manage_settings",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: AppPermission
): boolean {
  return rolePermissions[role].includes(permission);
}

export function getDefaultRoute(role: UserRole): string {
  if (role === "operator") {
    return "/workorders/new";
  }

  return "/";
}
