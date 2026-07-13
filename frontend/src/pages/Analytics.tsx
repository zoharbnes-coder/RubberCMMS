import { Box, Typography } from "@mui/material";

import KpiCard from "../components/shared/KpiCard";
import KpiGrid from "../components/shared/KpiGrid";

export default function Analytics() {
  return (
    <Box dir="rtl">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          mb: 3,
        }}
      >
        Analytics
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 4,
        }}
      >
        דוחות וניתוחי ביצועים של מערך האחזקה
      </Typography>

      <KpiGrid>
        <KpiCard
          title="קריאות פתוחות"
          value="-"
          color="#2563EB"
        />

        <KpiCard
          title="קריאות סגורות"
          value="-"
          color="#16A34A"
        />

        <KpiCard
          title="MTTR"
          value="-"
          color="#7C3AED"
        />

        <KpiCard
          title="MTBF"
          value="-"
          color="#F59E0B"
        />

        <KpiCard
          title="זמינות"
          value="-"
          color="#0891B2"
        />

        <KpiCard
          title="זמן השבתה"
          value="-"
          color="#DC2626"
        />
      </KpiGrid>
    </Box>
  );
}