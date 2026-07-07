import { Box, Card, CardContent, Typography } from "@mui/material";
import { plantDepartments } from "../../data/dashboardData";

export default function PlantOverview() {
  return (
    <Card sx={{ borderRadius: 5, boxShadow: "0 8px 24px rgba(15,23,42,0.10)" }}>
      <CardContent>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          Plant Overview
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          {plantDepartments.map((department) => (
            <Box key={department.name}>
              <Typography component="h3" sx={{ fontWeight: 900, mb: 1.5 }}>
                {department.name}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    xl: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {department.machines.map((machine) => (
                  <Box
                    key={machine.name}
                    sx={{
                      bgcolor: "#0F172A",
                      color: "white",
                      borderRadius: 3,
                      p: 2,
                      borderRight: `8px solid ${machine.color}`,
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    <Typography component="div" sx={{ fontWeight: 900 }}>
                      {machine.name}
                    </Typography>

                    <Typography component="div" sx={{ color: "#CBD5E1", fontSize: 13, mt: 0.5 }}>
                      סטטוס:{" "}
                      <Box component="span" sx={{ color: machine.color, fontWeight: 900 }}>
                        {machine.status}
                      </Box>
                    </Typography>

                    <Typography component="div" sx={{ color: "#CBD5E1", fontSize: 13, mt: 0.5 }}>
                      קריאה: {machine.workOrder}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}