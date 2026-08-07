import {
  users as defaultUsers,
  type AppUser,
  type UserRole,
} from "../data/users";

/*
 * RubberMIP
 * User Management Service
 *
 * Runtime user source of truth:
 * localStorage
 *
 * The static users.ts file is used only
 * as the initial seed for a clean system.
 */

const STORAGE_KEY =
  "rubbermip_users_v1";

export type CreateUserInput = {
  username: string;

  password: string;

  fullName: string;

  role:
    UserRole;
};

export type UpdateUserInput = {
  username: string;

  password: string;

  fullName: string;

  role:
    UserRole;
};

export type UserManagementResult = {
  success: boolean;

  user:
    AppUser | null;

  message: string;
};

/* -------------------------------- */
/* Role labels                      */
/* -------------------------------- */

function getRoleLabel(
  role:
    UserRole,
): string {
  if (
    role ===
    "operator"
  ) {
    return "מפעיל";
  }

  if (
    role ===
    "technician"
  ) {
    return "טכנאי";
  }

  if (
    role ===
    "electrician"
  ) {
    return "חשמלאי";
  }

  if (
    role ===
    "admin"
  ) {
    return "מנהל מערכת";
  }

  return "ניהול";
}

/* -------------------------------- */
/* Normalization                    */
/* -------------------------------- */

function normalizeUsername(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "en-US",
    );
}

function normalizeUser(
  user:
    AppUser,
): AppUser {
  return {
    username:
      normalizeUsername(
        user.username,
      ),

    password:
      user.password,

    fullName:
      user.fullName.trim(),

    role:
      user.role,

    roleLabel:
      getRoleLabel(
        user.role,
      ),
  };
}

/* -------------------------------- */
/* Storage                          */
/* -------------------------------- */

function saveUsers(
  users:
    AppUser[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      users,
    ),
  );
}

function seedUsers():
  AppUser[] {
  const seededUsers =
    defaultUsers.map(
      normalizeUser,
    );

  saveUsers(
    seededUsers,
  );

  return seededUsers;
}

function loadUsers():
  AppUser[] {
  const raw =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return seedUsers();
  }

  try {
    const parsed =
      JSON.parse(
        raw,
      );

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return seedUsers();
    }

    const validUsers =
      parsed
        .filter(
          (item) =>
            item &&
            typeof item ===
              "object" &&
            typeof item.username ===
              "string" &&
            typeof item.password ===
              "string" &&
            typeof item.fullName ===
              "string" &&
            typeof item.role ===
              "string",
        )
        .map(
          (item) =>
            normalizeUser(
              item as AppUser,
            ),
        );

    if (
      validUsers.length ===
      0
    ) {
      return seedUsers();
    }

    return validUsers;
  } catch {
    return seedUsers();
  }
}

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

function countAdmins(
  users:
    AppUser[],
): number {
  return users.filter(
    (user) =>
      user.role ===
      "admin",
  ).length;
}

function validateUserInput(
  input:
    CreateUserInput,
): string | null {
  if (
    !input.fullName.trim()
  ) {
    return "שם מלא הוא שדה חובה.";
  }

  if (
    !input.username.trim()
  ) {
    return "שם משתמש הוא שדה חובה.";
  }

  if (
    input.username.trim().length <
    3
  ) {
    return "שם המשתמש חייב להכיל לפחות 3 תווים.";
  }

  if (
    !input.password
  ) {
    return "סיסמה היא שדה חובה.";
  }

  if (
    input.password.length <
    4
  ) {
    return "הסיסמה חייבת להכיל לפחות 4 תווים.";
  }

  return null;
}

/* -------------------------------- */
/* Read                             */
/* -------------------------------- */

export function getManagedUsers():
  AppUser[] {
  return loadUsers()
    .slice()
    .sort(
      (
        first,
        second,
      ) =>
        first.fullName.localeCompare(
          second.fullName,
          "he",
        ),
    );
}

export function getManagedUserByUsername(
  username: string,
): AppUser | null {
  const normalizedUsername =
    normalizeUsername(
      username,
    );

  return (
    loadUsers().find(
      (user) =>
        user.username ===
        normalizedUsername,
    ) ??
    null
  );
}

/* -------------------------------- */
/* Authentication                   */
/* -------------------------------- */

export function authenticateManagedUser(
  username: string,
  password: string,
): AppUser | null {
  const normalizedUsername =
    normalizeUsername(
      username,
    );

  return (
    loadUsers().find(
      (user) =>
        user.username ===
          normalizedUsername &&
        user.password ===
          password,
    ) ??
    null
  );
}

/* -------------------------------- */
/* Create                           */
/* -------------------------------- */

export function createManagedUser(
  input:
    CreateUserInput,
): UserManagementResult {
  const validationMessage =
    validateUserInput(
      input,
    );

  if (
    validationMessage
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        validationMessage,
    };
  }

  const users =
    loadUsers();

  const username =
    normalizeUsername(
      input.username,
    );

  const duplicate =
    users.some(
      (user) =>
        user.username ===
        username,
    );

  if (
    duplicate
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "שם המשתמש כבר קיים במערכת.",
    };
  }

  const newUser:
    AppUser = {
    username,

    password:
      input.password,

    fullName:
      input.fullName.trim(),

    role:
      input.role,

    roleLabel:
      getRoleLabel(
        input.role,
      ),
  };

  users.push(
    newUser,
  );

  saveUsers(
    users,
  );

  return {
    success:
      true,

    user:
      newUser,

    message:
      "המשתמש נוצר בהצלחה.",
  };
}

/* -------------------------------- */
/* Update                           */
/* -------------------------------- */

export function updateManagedUser(
  originalUsername:
    string,
  input:
    UpdateUserInput,
): UserManagementResult {
  const validationMessage =
    validateUserInput(
      input,
    );

  if (
    validationMessage
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        validationMessage,
    };
  }

  const users =
    loadUsers();

  const original =
    normalizeUsername(
      originalUsername,
    );

  const index =
    users.findIndex(
      (user) =>
        user.username ===
        original,
    );

  if (
    index <
    0
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "המשתמש לא נמצא.",
    };
  }

  const username =
    normalizeUsername(
      input.username,
    );

  const duplicate =
    users.some(
      (
        user,
        userIndex,
      ) =>
        userIndex !==
          index &&
        user.username ===
          username,
    );

  if (
    duplicate
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "שם המשתמש כבר קיים במערכת.",
    };
  }

  const currentUser =
    users[
      index
    ];

  if (
    currentUser.role ===
      "admin" &&
    input.role !==
      "admin" &&
    countAdmins(
      users,
    ) <=
      1
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "לא ניתן להסיר הרשאת מנהל מערכת מהמנהל האחרון.",
    };
  }

  const updatedUser:
    AppUser = {
    username,

    password:
      input.password,

    fullName:
      input.fullName.trim(),

    role:
      input.role,

    roleLabel:
      getRoleLabel(
        input.role,
      ),
  };

  users[
    index
  ] =
    updatedUser;

  saveUsers(
    users,
  );

  return {
    success:
      true,

    user:
      updatedUser,

    message:
      "המשתמש עודכן בהצלחה.",
  };
}

/* -------------------------------- */
/* Delete                           */
/* -------------------------------- */

export function deleteManagedUser(
  username: string,
  currentUsername:
    string | null = null,
): UserManagementResult {
  const users =
    loadUsers();

  const normalizedUsername =
    normalizeUsername(
      username,
    );

  const index =
    users.findIndex(
      (user) =>
        user.username ===
        normalizedUsername,
    );

  if (
    index <
    0
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "המשתמש לא נמצא.",
    };
  }

  const user =
    users[
      index
    ];

  if (
    currentUsername &&
    normalizeUsername(
      currentUsername,
    ) ===
      normalizedUsername
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "לא ניתן למחוק את המשתמש שמחובר כעת למערכת.",
    };
  }

  if (
    user.role ===
      "admin" &&
    countAdmins(
      users,
    ) <=
      1
  ) {
    return {
      success:
        false,

      user:
        null,

      message:
        "לא ניתן למחוק את מנהל המערכת האחרון.",
    };
  }

  users.splice(
    index,
    1,
  );

  saveUsers(
    users,
  );

  return {
    success:
      true,

    user,

    message:
      "המשתמש נמחק בהצלחה.",
  };
}

/* -------------------------------- */
/* Reset                            */
/* -------------------------------- */

export function resetManagedUsersToDefaults():
  AppUser[] {
  localStorage.removeItem(
    STORAGE_KEY,
  );

  return seedUsers();
}