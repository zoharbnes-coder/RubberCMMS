import {
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { getLiveMachines } from "../services/machineService";
import type {
  Machine,
  MachineCriticality,
  MachineStatus,
} from "../types/machine";

type StatusFilter = "all" | MachineStatus;
type CriticalityFilter = "all" | MachineCriticality;

function getStatusLabel(status: MachineStatus) {
  if (status === "alarm") {
    return "מושבתת";
  }

  if (status === "warning") {
    return "קריאה פתוחה";
  }

  if (status === "maintenance") {
    return "בתחזוקה";
  }

  return "תקינה";
}

function getStatusColor(
  status: MachineStatus
): "success" | "warning" | "error" | "info" {
  if (status === "alarm") {
    return "error";
  }

  if (status === "warning") {
    return "warning";
  }

  if (status === "maintenance") {
    return "info";
  }

  return "success";
}

function getCriticalityLabel(
  criticality: MachineCriticality
) {
  if (criticality === "critical") {
    return "קריטית";
  }

  if (criticality === "high") {
    return "גבוהה";
  }

  if (criticality === "low") {
    return "נמוכה";
  }

  return "בינונית";
}

function formatHours(value: number) {
  if (value <= 0) {
    return "-";
  }

  return `${value.toFixed(1)} ש׳`;
}

export default function Machines() {
  const [machines] = useState<Machine[]>(getLiveMachines());

  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [criticalityFilter, setCriticalityFilter] =
    useState<CriticalityFilter>("all");

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          machines.map(
            (machine) => machine.department
          )
        )
      ).sort(),
    [machines]
  );

  const filteredMachines = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return machines.filter((machine) => {
      const matchesSearch =
        !normalizedSearch ||
        machine.assetNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        machine.machineCode
          .toLowerCase()
          .includes(normalizedSearch) ||
        machine.displayName
          .toLowerCase()
          .includes(normalizedSearch) ||
        machine.shortName
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        departmentFilter === "all" ||
        machine.department === departmentFilter;

      const matchesStatus =
        statusFilter === "all" ||
        machine.status === statusFilter;

      const matchesCriticality =
        criticalityFilter === "all" ||
        machine.criticality === criticalityFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesCriticality
      );
    });
  }, [
    criticalityFilter,
    departmentFilter,
    machines,
    searchText,
    statusFilter,
  ]);

  return (
    <Box dir="rtl">
      <Typography
        component="h1"
        variant="h4"
        sx={{
          fontWeight: 900,
          mb: 1,
        }}
      >
        מרכז המכונות
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          mb: 3,
        }}
      >
        תצוגת כל המכונות, סטטוס חי ומדדי אחזקה.
      </Typography>

      <Card
        sx={{
          borderRadius: 5,
          mb: 3,
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="חיפוש מכונה"
              placeholder="מספר, קוד או שם..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            <TextField
              select
              fullWidth
              label="מחלקה"
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
            >
              <MenuItem value="all">
                כל המחלקות
              </MenuItem>

              {departments.map((department) => (
                <MenuItem
                  key={department}
                  value={department}
                >
                  {department}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="סטטוס"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
            >
              <MenuItem value="all">הכול</MenuItem>
              <MenuItem value="running">תקינה</MenuItem>
              <MenuItem value="warning">
                קריאה פתוחה
              </MenuItem>
              <MenuItem value="alarm">מושבתת</MenuItem>
              <MenuItem value="maintenance">
                בתחזוקה
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="קריטיות"
              value={criticalityFilter}
              onChange={(event) =>
                setCriticalityFilter(
                  event.target
                    .value as CriticalityFilter
                )
              }
            >
              <MenuItem value="all">הכול</MenuItem>
              <MenuItem value="critical">קריטית</MenuItem>
              <MenuItem value="high">גבוהה</MenuItem>
              <MenuItem value="medium">בינונית</MenuItem>
              <MenuItem value="low">נמוכה</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          mb: 2,
        }}
      >
        נמצאו {filteredMachines.length} מכונות
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {filteredMachines.map((machine) => (
          <Card
            key={machine.id}
            sx={{
              borderRadius: 4,
              borderTop: "6px solid",
              borderTopColor:
                machine.status === "alarm"
                  ? "#DC2626"
                  : machine.status === "warning"
                    ? "#F59E0B"
                    : machine.status === "maintenance"
                      ? "#2563EB"
                      : "#16A34A",
              boxShadow:
                "0 8px 24px rgba(15,23,42,0.08)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    component="h2"
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    {machine.assetNumber} -{" "}
                    {machine.displayName}
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      color: "text.secondary",
                      fontSize: 13,
                    }}
                  >
                    {machine.department}
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                      mt: 0.5,
                    }}
                  >
                    קוד: {machine.machineCode}
                  </Typography>
                </Box>

                <Chip
                  label={getStatusLabel(machine.status)}
                  color={getStatusColor(machine.status)}
                  sx={{
                    fontWeight: 900,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Chip
                  label={`קריטיות: ${getCriticalityLabel(
                    machine.criticality
                  )}`}
                  size="small"
                  variant="outlined"
                />

                <Chip
                  label={`קריאות פתוחות: ${machine.openWorkOrders}`}
                  size="small"
                  variant="outlined"
                />

                {machine.downtimeWorkOrders > 0 && (
                  <Chip
                    label={`משביתות: ${machine.downtimeWorkOrders}`}
                    size="small"
                    color="error"
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                    }}
                  >
                    זמינות
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    {machine.availability.toFixed(1)}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                    }}
                  >
                    MTTR
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    {formatHours(machine.mttrHours)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                    }}
                  >
                    MTBF
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 900,
                    }}
                  >
                    {formatHours(machine.mtbfHours)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}