import { Box, Button, CssBaseline, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import type { AppUser, UserRole } from "../data/users";

type MainLayoutProps = {
  children: ReactNode;
  currentUser: AppUser;
  onLogout: () => void;
};

type MenuItem = {
  label: string;
  path: string;
  allowedRoles: UserRole[];
};

const menuItems: MenuItem[] = [
  {
    label: "Control Center",
    path: "/",
    allowedRoles: ["technician", "manager", "admin"],
  },
  {
    label: "קריאות",
    path: "/workorders",
    allowedRoles: ["operator", "technician", "manager", "admin"],
  },
  {
    label: "מכונות",
    path: "/machines",
    allowedRoles: ["technician", "manager", "admin"],
  },
  {
    label: "Analytics",
    path: "/analytics",
    allowedRoles: ["manager", "admin"],
  },
  {
    label: "היסטוריה",
    path: "/history",
    allowedRoles: ["technician", "manager", "admin"],
  },
  {
    label: "הגדרות",
    path: "/settings",
    allowedRoles: ["admin"],
  },
];

export function MainLayout({
  children,
  currentUser,
  onLogout,
}: MainLayoutProps) {
  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(currentUser.role)
  );

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />

      <Box
        component="header"
        sx={{
          minHeight: 72,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 22,
            }}
          >
            RubberCMMS
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "#CBD5E1",
              fontSize: 12,
            }}
          >
            Maintenance Intelligence Platform
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "left" }}>
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
              }}
            >
              {currentUser.fullName}
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#CBD5E1",
                fontSize: 12,
              }}
            >
              {currentUser.roleLabel} · מחובר
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={onLogout}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.55)",
              fontWeight: 800,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            יציאה
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box
          component="aside"
          sx={{
            width: 220,
            flexShrink: 0,
            minHeight: "calc(100vh - 72px)",
            bgcolor: "primary.main",
            color: "white",
            p: 2,
          }}
        >
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                display: "block",
                padding: "14px 12px",
                marginBottom: 6,
                borderRadius: 10,
                color: "white",
                textDecoration: "none",
                fontWeight: 800,
                background: isActive
                  ? "rgba(255,255,255,0.16)"
                  : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}