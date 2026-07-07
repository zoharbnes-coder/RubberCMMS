import { Box, Typography } from "@mui/material";
import KpiCard from "../components/cards/KpiCard";
import OpenCalls from "../components/dashboard/OpenCalls";
import TopDowntime from "../components/dashboard/TopDowntime";
import PlantOverview from "../components/dashboard/PlantOverview";
import { dashboardStats } from "../data/dashboardData";

export default function Dashboard() {
  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        Maintenance Control Center
      </Typography>

      <Typography component="p" sx={{ color: "text.secondary", mb: 4 }}>
        תמונת מצב אחזקה בזמן אמת
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {dashboardStats.map((item) => {
          const Icon = item.icon;

          return (
            <KpiCard
              key={item.title}
              title={item.title}
              value={item.value}
              color={item.color}
              icon={<Icon fontSize="large" />}
              subtitle={item.subtitle}
            />
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <OpenCalls />
        <TopDowntime />
      </Box>

      <PlantOverview />
    </Box>
  );
}