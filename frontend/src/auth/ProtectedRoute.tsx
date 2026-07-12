import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import type { UserRole } from "../data/users";
import {
  getDefaultRoute,
  hasPermission,
  type AppPermission,
} from "./permissions";

type ProtectedRouteProps = {
  currentUserRole: UserRole;
  permission: AppPermission;
  children: ReactNode;
};

export default function ProtectedRoute({
  currentUserRole,
  permission,
  children,
}: ProtectedRouteProps) {
  const isAllowed = hasPermission(currentUserRole, permission);

  if (!isAllowed) {
    return (
      <Navigate
        to={getDefaultRoute(currentUserRole)}
        replace
      />
    );
  }

  return <>{children}</>;
}