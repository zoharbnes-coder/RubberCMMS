import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { appTheme } from "./theme/theme";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import { getDefaultRoute } from "./auth/permissions";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewWorkOrder from "./pages/NewWorkOrder";
import WorkOrders from "./pages/WorkOrders";
import Machines from "./pages/Machines";
import MachineDetails from "./pages/MachineDetails";

import type { AppUser } from "./data/users";

function Analytics() {
  return <h1>Analytics</h1>;
}

function History() {
  return <h1>היסטוריה</h1>;
}

function Settings() {
  return <h1>הגדרות</h1>;
}

function getSavedUser(): AppUser | null {
  const savedUser = localStorage.getItem("rubbercmms_user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AppUser;
  } catch {
    localStorage.removeItem("rubbercmms_user");
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(
    getSavedUser()
  );

  function handleLogin(user: AppUser) {
    localStorage.setItem(
      "rubbercmms_user",
      JSON.stringify(user)
    );

    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("rubbercmms_user");
    setCurrentUser(null);
  }

  return (
    <ThemeProvider theme={appTheme}>
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate
                  to={getDefaultRoute(currentUser.role)}
                  replace
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/*"
            element={
              currentUser ? (
                <MainLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_dashboard"
                        >
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/workorders/new"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="open_work_order"
                        >
                          <NewWorkOrder currentUser={currentUser} />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/workorders"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_work_orders"
                        >
                          <WorkOrders currentUser={currentUser} />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/machines"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_machines"
                        >
                          <Machines />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/machines/:machineCode"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_machines"
                        >
                          <MachineDetails />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_analytics"
                        >
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="view_history"
                        >
                          <History />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute
                          currentUserRole={currentUser.role}
                          permission="manage_settings"
                        >
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="*"
                      element={
                        <Navigate
                          to={getDefaultRoute(currentUser.role)}
                          replace
                        />
                      }
                    />
                  </Routes>
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}