import { Box, CssBaseline } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Control Center", path: "/" },
  { label: "קריאות", path: "/workorders" },
  { label: "מכונות", path: "/machines" },
  { label: "Analytics", path: "/analytics" },
  { label: "היסטוריה", path: "/history" },
  { label: "הגדרות", path: "/settings" },
];

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />

      <Box
        component="header"
        sx={{
          height: 72,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          px: 3,
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        RubberCMMS
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box
          component="aside"
          sx={{
            width: 220,
            minHeight: "calc(100vh - 72px)",
            bgcolor: "primary.main",
            color: "white",
            p: 2,
          }}
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "14px 12px",
                marginBottom: 6,
                borderRadius: 10,
                color: "white",
                textDecoration: "none",
                fontWeight: 800,
                background: isActive ? "rgba(255,255,255,0.16)" : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>

        <Box component="main" sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
