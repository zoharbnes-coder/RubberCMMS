import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import type {
  Machine,
  MachineCriticality,
  MachineStatus,
} from "../../types/machine";

type MachineHeaderProps = {
  machine: Machine;
  onBack: () => void;
};

function getMachineStatusLabel(
  status: MachineStatus
): string {
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

function getMachineStatusColor(
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

function getMachineStatusAccent(
  status: MachineStatus
): string {
  if (status === "alarm") {
    return "#DC2626";
  }

  if (status === "warning") {
    return "#D97706";
  }

  if (status === "maintenance") {
    return "#0284C7";
  }

  return "#16A34A";
}

function getCriticalityLabel(
  criticality: MachineCriticality
): string {
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

function getCriticalityColor(
  criticality: MachineCriticality
):
  | "error"
  | "warning"
  | "info"
  | "default" {
  if (criticality === "critical") {
    return "error";
  }

  if (criticality === "high") {
    return "warning";
  }

  if (criticality === "medium") {
    return "info";
  }

  return "default";
}

function getTechnicalValue(
  value: string
): string {
  const normalizedValue = value.trim();

  return normalizedValue || "-";
}

export default function MachineHeader({
  machine,
  onBack,
}: MachineHeaderProps) {
  const statusAccent =
    getMachineStatusAccent(machine.status);

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={onBack}
        sx={{
          mb: 1.25,
          fontWeight: 900,
        }}
      >
        חזרה למרכז המכונות
      </Button>

      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRight: `6px solid ${statusAccent}`,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.5,
              md: 2,
            },
            "&:last-child": {
              pb: {
                xs: 1.5,
                md: 2,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.5fr) minmax(520px, 1fr)",
              },
              gap: {
                xs: 1.5,
                lg: 2,
              },
              alignItems: "center",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 0.5,
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: 20,
                      md: 23,
                    },
                    lineHeight: 1.2,
                    minWidth: 0,
                  }}
                >
                  {machine.assetNumber} -{" "}
                  {machine.displayName}
                </Typography>

                <Chip
                  label={getMachineStatusLabel(
                    machine.status
                  )}
                  color={getMachineStatusColor(
                    machine.status
                  )}
                  size="small"
                  sx={{
                    fontWeight: 900,
                  }}
                />

                <Chip
                  label={`קריטיות: ${getCriticalityLabel(
                    machine.criticality
                  )}`}
                  color={getCriticalityColor(
                    machine.criticality
                  )}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 900,
                  }}
                />
              </Box>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  mb: 0.25,
                }}
              >
                {machine.department}
                {machine.area
                  ? ` · ${machine.area}`
                  : ""}
                {machine.location
                  ? ` · ${machine.location}`
                  : ""}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 11,
                }}
              >
                מספר מכונה:{" "}
                <Box
                  component="span"
                  sx={{
                    color: "text.primary",
                    fontWeight: 900,
                  }}
                >
                  {machine.assetNumber}
                </Box>

                {" · "}

                קוד מערכת:{" "}
                <Box
                  component="span"
                  sx={{
                    color: "text.primary",
                    fontWeight: 900,
                  }}
                >
                  {machine.machineCode}
                </Box>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(0, 1fr))",
                },
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  px: 1.15,
                  py: 0.85,
                  borderRadius: 2.25,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  minWidth: 0,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 9.5,
                    mb: 0.2,
                  }}
                >
                  יצרן
                </Typography>

                <Typography
                  component="div"
                  title={getTechnicalValue(
                    machine.manufacturer
                  )}
                  sx={{
                    fontWeight: 900,
                    fontSize: 11.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getTechnicalValue(
                    machine.manufacturer
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.15,
                  py: 0.85,
                  borderRadius: 2.25,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  minWidth: 0,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 9.5,
                    mb: 0.2,
                  }}
                >
                  דגם
                </Typography>

                <Typography
                  component="div"
                  title={getTechnicalValue(
                    machine.model
                  )}
                  sx={{
                    fontWeight: 900,
                    fontSize: 11.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getTechnicalValue(
                    machine.model
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.15,
                  py: 0.85,
                  borderRadius: 2.25,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  minWidth: 0,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 9.5,
                    mb: 0.2,
                  }}
                >
                  מספר סידורי
                </Typography>

                <Typography
                  component="div"
                  title={getTechnicalValue(
                    machine.serialNumber
                  )}
                  sx={{
                    fontWeight: 900,
                    fontSize: 11.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getTechnicalValue(
                    machine.serialNumber
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.15,
                  py: 0.85,
                  borderRadius: 2.25,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  minWidth: 0,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 9.5,
                    mb: 0.2,
                  }}
                >
                  תאריך התקנה
                </Typography>

                <Typography
                  component="div"
                  title={getTechnicalValue(
                    machine.installationDate
                  )}
                  sx={{
                    fontWeight: 900,
                    fontSize: 11.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getTechnicalValue(
                    machine.installationDate
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}