import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { openCalls } from "../../data/dashboardData";

export default function OpenCalls() {
  return (
    <Card sx={{ borderRadius: 5 }}>
      <CardContent>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
          קריאות פתוחות ודחופות
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {openCalls.map((call) => (
            <Box
              key={`${call.machine}-${call.fault}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                bgcolor: "#F8FAFC",
              }}
            >
              <Box>
                <Typography component="div" sx={{ fontWeight: 800 }}>
                  {call.machine}
                </Typography>

                <Typography component="div" sx={{ color: "text.secondary" }}>
                  {call.fault}
                </Typography>
              </Box>

              <Chip
                label={call.priority}
                color={call.color as "error" | "warning" | "success"}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}