import {
  Box,
  Button,
  CssBaseline,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

import type {
  AppUser,
  UserRole,
} from "../data/users";

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

const HEADER_HEIGHT = 58;
const SIDEBAR_WIDTH = 176;

const menuItems: MenuItem[] = [
  {
    label: "Control Center",
    path: "/",
    allowedRoles: [
      "technician",
      "manager",
      "admin",
    ],
  },
  {
    label: "קריאות",
    path: "/workorders",
    allowedRoles: [
      "operator",
      "technician",
      "manager",
      "admin",
    ],
  },
  {
    label: "מכונות",
    path: "/machines",
    allowedRoles: [
      "technician",
      "manager",
      "admin",
    ],
  },
  {
    label: "Analytics",
    path: "/analytics",
    allowedRoles: [
      "manager",
      "admin",
    ],
  },
  {
    label: "היסטוריה",
    path: "/history",
    allowedRoles: [
      "technician",
      "manager",
      "admin",
    ],
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
  const visibleMenuItems =
    menuItems.filter((item) =>
      item.allowedRoles.includes(
        currentUser.role
      )
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
          height: HEADER_HEIGHT,
          bgcolor: "#0F172A",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 2,
          px: {
            xs: 1.5,
            md: 2.25,
          },
          position: "sticky",
          top: 0,
          zIndex: 1200,
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 2px 10px rgba(15,23,42,0.16)",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: 16,
                md: 18,
              },
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            RubberCMMS
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "#94A3B8",
              fontSize: 10.5,
              mt: 0.25,
              whiteSpace: "nowrap",
            }}
          >
            Maintenance Intelligence Platform
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              md: 1.5,
            },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              textAlign: "left",
              minWidth: 0,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 12.5,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
            >
              {currentUser.fullName}
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#94A3B8",
                fontSize: 10.5,
                mt: 0.25,
                whiteSpace: "nowrap",
              }}
            >
              {currentUser.roleLabel} · מחובר
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={onLogout}
            sx={{
              minHeight: 32,
              px: 1.5,
              color: "white",
              borderColor:
                "rgba(255,255,255,0.28)",
              fontWeight: 800,
              "&:hover": {
                borderColor: "white",
                bgcolor:
                  "rgba(255,255,255,0.08)",
              },
            }}
          >
            יציאה
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <Box
          component="aside"
          sx={{
            width: {
              xs: 0,
              md: SIDEBAR_WIDTH,
            },
            flexShrink: 0,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            bgcolor: "#0F172A",
            color: "white",
            borderLeft:
              "1px solid rgba(255,255,255,0.06)",
            position: {
              md: "sticky",
            },
            top: {
              md: HEADER_HEIGHT,
            },
            alignSelf: {
              md: "flex-start",
            },
            height: {
              md: `calc(100vh - ${HEADER_HEIGHT}px)`,
            },
            overflowY: "auto",
            px: {
              xs: 0,
              md: 1,
            },
            py: {
              xs: 0,
              md: 1.25,
            },
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: 0.5,
            }}
          >
            {visibleMenuItems.map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    minHeight: 38,
                    padding: "8px 10px",
                    borderRadius: 8,
                    color: isActive
                      ? "#FFFFFF"
                      : "#CBD5E1",
                    textDecoration: "none",
                    fontSize: "12.5px",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    background: isActive
                      ? "rgba(37,99,235,0.26)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(96,165,250,0.34)"
                      : "1px solid transparent",
                    transition:
                      "background-color 150ms ease, color 150ms ease, border-color 150ms ease",
                  })}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            p: {
              xs: 1.5,
              sm: 1.75,
              md: 2,
              xl: 2.25,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: {
                xs: "100%",
                xl: 1700,
              },
              mx: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}