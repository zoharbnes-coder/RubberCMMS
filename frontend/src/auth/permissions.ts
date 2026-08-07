import type {
  UserRole,
} from "../data/users";

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

export type PermissionDefinition = {
  permission:
    AppPermission;

  label:
    string;

  description:
    string;
};

export type RoleDefinition = {
  role:
    UserRole;

  label:
    string;

  description:
    string;
};

export const permissionDefinitions:
  PermissionDefinition[] = [
  {
    permission:
      "open_work_order",

    label:
      "פתיחת קריאת שירות",

    description:
      "מאפשר פתיחת קריאת שירות חדשה.",
  },

  {
    permission:
      "view_work_orders",

    label:
      "צפייה בקריאות שירות",

    description:
      "מאפשר צפייה ברשימת הקריאות ובפרטי קריאה.",
  },

  {
    permission:
      "update_work_orders",

    label:
      "עדכון קריאות שירות",

    description:
      "מאפשר קבלת קריאה, עדכון והשהיית טיפול.",
  },

  {
    permission:
      "close_work_orders",

    label:
      "סגירת קריאות שירות",

    description:
      "מאפשר סגירת קריאה ותיעוד הטיפול שבוצע.",
  },

  {
    permission:
      "view_dashboard",

    label:
      "צפייה בדשבורד",

    description:
      "מאפשר צפייה במרכז השליטה וה־KPI התפעוליים.",
  },

  {
    permission:
      "view_machines",

    label:
      "צפייה בנכסים",

    description:
      "מאפשר צפייה במרכז הנכסים ובכרטיסי הנכס.",
  },

  {
    permission:
      "view_history",

    label:
      "צפייה בהיסטוריה",

    description:
      "מאפשר גישה למסכי היסטוריית האחזקה.",
  },

  {
    permission:
      "view_analytics",

    label:
      "צפייה באנליטיקה",

    description:
      "מאפשר גישה ל־Analytics ולמדדי Reliability.",
  },

  {
    permission:
      "manage_settings",

    label:
      "ניהול הגדרות",

    description:
      "מאפשר גישה ושינוי של הגדרות המערכת.",
  },
];

export const roleDefinitions:
  RoleDefinition[] = [
  {
    role:
      "operator",

    label:
      "מפעיל",

    description:
      "פתיחת קריאות שירות בלבד.",
  },

  {
    role:
      "technician",

    label:
      "טכנאי",

    description:
      "טיפול מלא בקריאות שירות וגישה למידע תפעולי.",
  },

  {
    role:
      "electrician",

    label:
      "חשמלאי",

    description:
      "טיפול מלא בקריאות שירות וגישה למידע תפעולי.",
  },

  {
    role:
      "manager",

    label:
      "ניהול",

    description:
      "ניהול אחזקה, Dashboard, נכסים ו־Analytics.",
  },

  {
    role:
      "admin",

    label:
      "מנהל מערכת",

    description:
      "גישה מלאה למערכת כולל Settings.",
  },
];

export const rolePermissions:
  Record<
    UserRole,
    AppPermission[]
  > = {
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
  role:
    UserRole,
  permission:
    AppPermission,
): boolean {
  return rolePermissions[
    role
  ].includes(
    permission,
  );
}

export function getPermissionsForRole(
  role:
    UserRole,
): AppPermission[] {
  return [
    ...rolePermissions[
      role
    ],
  ];
}

export function getPermissionDefinition(
  permission:
    AppPermission,
): PermissionDefinition | undefined {
  return permissionDefinitions.find(
    (item) =>
      item.permission ===
      permission,
  );
}

export function getRoleDefinition(
  role:
    UserRole,
): RoleDefinition | undefined {
  return roleDefinitions.find(
    (item) =>
      item.role ===
      role,
  );
}

export function getRoleLabel(
  role:
    UserRole,
): string {
  return (
    getRoleDefinition(
      role,
    )?.label ??
    role
  );
}

export function getDefaultRoute(
  role:
    UserRole,
): string {
  if (
    role ===
    "operator"
  ) {
    return "/workorders/new";
  }

  return "/";
}