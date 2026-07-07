import { Box, CssBaseline } from "@mui/material";
import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
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
          <Box sx={{ py: 1.5, fontWeight: 800 }}>Control Center</Box>
          <Box sx={{ py: 1.5, fontWeight: 800 }}>קריאות</Box>
          <Box sx={{ py: 1.5, fontWeight: 800 }}>מכונות</Box>
          <Box sx={{ py: 1.5, fontWeight: 800 }}>Analytics</Box>
          <Box sx={{ py: 1.5, fontWeight: 800 }}>היסטוריה</Box>
          <Box sx={{ py: 1.5, fontWeight: 800 }}>הגדרות</Box>
        </Box>

        <Box component="main" sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
