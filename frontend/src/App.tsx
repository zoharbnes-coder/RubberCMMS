import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { appTheme } from "./theme/theme";
import { MainLayout } from "./layouts/MainLayout";

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <MainLayout>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 900 }}>
          Maintenance Control Center
        </Typography>
      </MainLayout>
    </ThemeProvider>
  );
}

