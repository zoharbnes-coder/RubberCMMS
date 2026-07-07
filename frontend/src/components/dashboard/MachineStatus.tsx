import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const machines = [
  {
    machine: "REP-539",
    department: "הזרקה",
    status: "Running",
    color: "#16A34A",
  },
  {
    machine: "BatchOff-109",
    department: "BatchOff",
    status: "Alarm",
    color: "#DC2626",
  },
  {
    machine: "Troester-315",
    department: "אקסטרוזיה",
    status: "Service",
    color: "#F59E0B",
  },
  {
    machine: "Banbury-101",
    department: "ערבול",
    status: "Running",
    color: "#16A34A",
  },
  {
    machine: "Press-221",
    department: "כבישה",
    status: "Running",
    color: "#16A34A",
  },
  {
    machine: "Mixer-9D",
    department: "ערבול",
    status: "Stopped",
    color: "#2563EB",
  },
];

export default function MachineStatus() {
  return (
    <Card
      sx={{
        borderRadius: 6,
        boxShadow: 6,
      }}
    >
      <CardContent>

        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: 900,
            mb: 3,
            textAlign: "center",
          }}
        >
          מצב המכונות
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2,1fr)",
              xl: "repeat(3,1fr)",
            },
            gap: 2,
          }}
        >
          {machines.map((m) => (
            <Card
              key={m.machine}
              sx={{
                bgcolor: "#F8FAFC",
                borderRadius: 4,
                boxShadow: 1,
              }}
            >
              <CardContent>

                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 900,
                    mb: 0.5,
                  }}
                >
                  {m.machine}
                </Typography>

                <Typography
                  component="p"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  {m.department}
                </Typography>

                <Chip
                  label={m.status}
                  sx={{
                    bgcolor: m.color,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />

              </CardContent>
            </Card>
          ))}
        </Box>

      </CardContent>
    </Card>
  );
}