import { ThemeProvider } from "@mui/material/styles";
import { HashRouter, Routes, Route } from "react-router-dom";

import { appTheme } from "./theme/theme";
import { MainLayout } from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";

function WorkOrders() {
  return <h1>קריאות</h1>;
}

function Machines() {
  return <h1>מכונות</h1>;
}

function Analytics() {
  return <h1>Analytics</h1>;
}

function History() {
  return <h1>היסטוריה</h1>;
}

function Settings() {
  return <h1>הגדרות</h1>;
}

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workorders" element={<WorkOrders />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </ThemeProvider>
  );
}
