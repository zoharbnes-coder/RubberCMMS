import { Box, Card, CardContent, Typography } from "@mui/material";
import { topDowntimeMachines } from "../../data/dashboardData";

export default function TopDowntime() {
  return (
    <Card sx={{ borderRadius: 5, boxShadow: "0 8px 24px rgba(15,23,42,0.10)" }}>
      <CardContent>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          TOP 5 זמן עצירה
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {topDowntimeMachines.map((machine, index) => (
            <Box
              key={machine.name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#F8FAFC",
                borderRadius: 3,
                p: 1.5,
                borderRight: `6px solid ${machine.color}`,
              }}
            >
              <Typography component="div" sx={{ fontWeight: 900 }}>
                {index + 1}. {machine.name}
              </Typography>

              <Typography component="div" sx={{ fontWeight: 900, color: machine.color }}>
                {machine.downtime}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}