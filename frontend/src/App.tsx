import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, Typography } from "@mui/material";
import { appTheme } from "./theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      <Box
        dir="rtl"
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 900 }}
          >
            RubberCMMS
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Design System Foundation
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
