import { Box, Card, CardContent, Typography } from "@mui/material";
import { machines, type Machine } from "../../data/machines";

type MachineStatus = "running" | "warning" | "alarm";

function getMachineStatus(machine: Machine): MachineStatus {
  // בהמשך הסטטוס יגיע מהשרת ומהקריאות הפתוחות.
  // כרגע כל מכונה פעילה מוצגת כברירת מחדל כתקינה.
  return machine.active ? "running" : "warning";
}

function getStatusLabel(status: MachineStatus) {
  if (status === "alarm") {
    return "מושבת";
  }

  if (status === "warning") {
    return "לא פעילה";
  }

  return "תקין";
}

function getStatusColor(status: MachineStatus) {
  if (status === "alarm") {
    return "#DC2626";
  }

  if (status === "warning") {
    return "#F59E0B";
  }

  return "#16A34A";
}

const departments = Array.from(
  new Set(
    machines
      .filter((machine) => machine.active)
      .map((machine) => machine.department)
  )
);

export default function PlantOverview() {
  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
      }}
    >
      <CardContent>
        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: 900,
            mb: 3,
          }}
        >
          מפת מכונות המפעל
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 3,
          }}
        >
          {departments.map((department) => {
            const departmentMachines = machines.filter(
              (machine) =>
                machine.active && machine.department === department
            );

            return (
              <Box key={department}>
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 900,
                    mb: 1.5,
                  }}
                >
                  {department}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(3, minmax(0, 1fr))",
                      xl: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {departmentMachines.map((machine) => {
                    const status = getMachineStatus(machine);
                    const statusColor = getStatusColor(status);

                    return (
                      <Box
                        key={machine.code}
                        sx={{
                          bgcolor: "#0F172A",
                          color: "white",
                          borderRadius: 3,
                          p: 2,
                          borderRight: `8px solid ${statusColor}`,
                          boxShadow:
                            "inset 0 0 0 1px rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {machine.displayNumber} - {machine.name}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color: "#CBD5E1",
                            fontSize: 13,
                            mt: 0.5,
                          }}
                        >
                          קוד מכונה: {machine.code}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color: "#CBD5E1",
                            fontSize: 13,
                            mt: 0.5,
                          }}
                        >
                          סטטוס:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: statusColor,
                              fontWeight: 900,
                            }}
                          >
                            {getStatusLabel(status)}
                          </Box>
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
