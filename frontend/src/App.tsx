import { Box, CssBaseline, Typography } from "@mui/material";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Box
        dir="rtl"
        sx={{
          minHeight: "100vh",
          fontFamily: "Arial",
          background: "#f4f6f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            component="h1"
            variant="h2"
            sx={{ fontWeight: 800, color: "#0f172a" }}
          >
            RubberCMMS
          </Typography>

          <Typography
            component="h2"
            variant="h5"
            sx={{ color: "#475569", mt: 2 }}
          >
            Maintenance Intelligence Platform
          </Typography>

          <Typography
            component="h3"
            variant="h6"
            sx={{ color: "#64748b", mt: 4 }}
          >
            מערכת ניהול אחזקה חכמה
          </Typography>
        </Box>
      </Box>
    </>
  );
}
