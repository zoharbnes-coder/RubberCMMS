export type UserRole =
  | "operator"
  | "technician"
  | "electrician"
  | "manager"
  | "admin";

export type AppUser = {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
};

export const users: AppUser[] = [
  {
    username: "admin",
    password: "admin",
    fullName: "זוהר",
    role: "admin",
    roleLabel: "ניהול",
  },
  {
    username: "manager",
    password: "1234",
    fullName: "מנהל אחזקה",
    role: "manager",
    roleLabel: "ניהול",
  },
  {
    username: "tech",
    password: "1234",
    fullName: "טכנאי",
    role: "technician",
    roleLabel: "טכנאי",
  },
  {
    username: "electric",
    password: "1234",
    fullName: "חשמלאי",
    role: "electrician",
    roleLabel: "חשמלאי",
  },
  {
    username: "operator",
    password: "1234",
    fullName: "מפעיל",
    role: "operator",
    roleLabel: "מפעיל",
  },
];
