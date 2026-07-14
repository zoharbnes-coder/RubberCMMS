import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type {
  ManagementInsightsSnapshot,
  ManagementRiskMachine,
} from "../../services/managementInsightsService";
import type { MachineRiskLevel } from "../../services/machineIntelligenceService";

type ManagementRiskPanelProps = {
  snapshot: ManagementInsightsSnapshot;
};

function getRiskLabel(
  riskLevel: MachineRiskLevel
): string {
  if (riskLevel === "critical") {
    return "קריטית";
  }

  if (riskLevel === "high") {
    return "גבוהה";
  }

  if (riskLevel === "medium") {
    return "בינונית";
  }

  return "נמוכה";
}

function getRiskColor(
  riskLevel: MachineRiskLevel
): string {
  if (riskLevel === "critical") {
    return "#991B1B";
  }

  if (riskLevel === "high") {
    return "#DC2626";
  }

  if (riskLevel === "medium") {
    return "#F59E0B";
  }

  return "#16A34A";
}

function getHealthColor(
  healthScore: number
): string {
  if (healthScore < 40) {
    return "#991B1B";
  }

  if (healthScore < 60) {
    return "#DC2626";
  }

  if (healthScore < 80) {
    return "#F59E0B";
  }

  return "#16A34A";
}

function RiskSummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderTop: `5px solid ${color}`,
      }}
    >
      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          fontSize: 13,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          fontSize: 28,
          color,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function RiskMachineRow({
  machine,
  onOpen,
}: {
  machine: ManagementRiskMachine;
  onOpen: () => void;
}) {
  const riskColor = getRiskColor(
    machine.riskLevel
  );

  const healthColor = getHealthColor(
    machine.healthScore
  );

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          onOpen();
        }
      }}
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRight: `7px solid ${riskColor}`,
        cursor: "pointer",
        transition:
          "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
        "&:hover": {
          bgcolor: "#EEF2F7",
          transform: "translateY(-2px)",
          boxShadow:
            "0 8px 20px rgba(15,23,42,0.10)",
        },
        "&:focus-visible": {
          outline: "3px solid #2563EB",
          outlineOffset: "3px",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.4fr 0.8fr 0.8fr 2fr",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 16,
            }}
          >
            {machine.assetNumber} -{" "}
            {machine.machineName}
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
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              mb: 0.5,
            }}
          >
            Health Score
          </Typography>

          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 20,
              color: healthColor,
            }}
          >
            {machine.healthScore}/100
          </Typography>

          <LinearProgress
            variant="determinate"
            value={machine.healthScore}
            sx={{
              mt: 0.75,
              height: 7,
              borderRadius: 10,
              bgcolor: "#E2E8F0",
              "& .MuiLinearProgress-bar": {
                bgcolor: healthColor,
                borderRadius: 10,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
          }}
        >
          <Chip
            label={`סיכון ${getRiskLabel(
              machine.riskLevel
            )}`}
            size="small"
            sx={{
              bgcolor: riskColor,
              color: "white",
              fontWeight: 900,
            }}
          />

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            פתוחות: {machine.openWorkOrders}
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                machine.downtimeWorkOrders > 0
                  ? "#DC2626"
                  : "text.secondary",
              fontSize: 12,
              fontWeight:
                machine.downtimeWorkOrders > 0
                  ? 900
                  : 400,
            }}
          >
            משביתות:{" "}
            {machine.downtimeWorkOrders}
          </Typography>
        </Box>

        <Box>
          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              mb: 0.5,
            }}
          >
            המלצה ראשית
          </Typography>

          <Typography
            component="div"
            sx={{
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            {machine.primaryRecommendation}
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              mt: 1,
            }}
          >
            7 ימים:{" "}
            {machine.failuresLast7Days} תקלות ·
            30 ימים:{" "}
            {machine.failuresLast30Days} ·
            משביתות:{" "}
            {
              machine.downtimeFailuresLast30Days
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function ManagementRiskPanel({
  snapshot,
}: ManagementRiskPanelProps) {
  const navigate = useNavigate();

  const healthColor = getHealthColor(
    snapshot.averageHealthScore
  );

  return (
    <Card
      sx={{
        borderRadius: 5,
        mb: 3,
        overflow: "hidden",
        boxShadow:
          "0 10px 30px rgba(15,23,42,0.10)",
      }}
    >
      <Box
        sx={{
          height: 7,
          bgcolor: healthColor,
        }}
      />

      <CardContent
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 900,
                mb: 0.5,
              }}
            >
              תמונת סיכון הנהלתית
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "text.secondary",
              }}
            >
              דירוג מצב המכונות והנושאים
              הדורשים תשומת לב ניהולית.
            </Typography>
          </Box>

          <Chip
            label={`${snapshot.machinesRequiringAttention} מכונות דורשות תשומת לב`}
            sx={{
              bgcolor:
                snapshot.machinesRequiringAttention >
                0
                  ? "#DC2626"
                  : "#16A34A",
              color: "white",
              fontWeight: 900,
              minHeight: 36,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "300px minmax(0, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 13,
                mb: 1,
              }}
            >
              Health Score מפעלי ממוצע
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 46,
                lineHeight: 1,
                color: healthColor,
                mb: 2,
              }}
            >
              {snapshot.averageHealthScore.toFixed(
                1
              )}
              <Box
                component="span"
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                  mr: 0.5,
                }}
              >
                /100
              </Box>
            </Typography>

            <LinearProgress
              variant="determinate"
              value={snapshot.averageHealthScore}
              sx={{
                height: 11,
                borderRadius: 10,
                bgcolor: "#E2E8F0",
                "& .MuiLinearProgress-bar": {
                  bgcolor: healthColor,
                  borderRadius: 10,
                },
              }}
            />

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 12,
                mt: 1.5,
              }}
            >
              מתוך {snapshot.totalMachines} מכונות
              פעילות
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <RiskSummaryCard
              label="סיכון נמוך"
              value={snapshot.lowRiskMachines}
              color="#16A34A"
            />

            <RiskSummaryCard
              label="סיכון בינוני"
              value={
                snapshot.mediumRiskMachines
              }
              color="#F59E0B"
            />

            <RiskSummaryCard
              label="סיכון גבוה"
              value={snapshot.highRiskMachines}
              color="#DC2626"
            />

            <RiskSummaryCard
              label="סיכון קריטי"
              value={
                snapshot.criticalRiskMachines
              }
              color="#991B1B"
            />
          </Box>
        </Box>

        <Typography
          component="h3"
          variant="h6"
          sx={{
            fontWeight: 900,
            mb: 1.5,
          }}
        >
          מכונות בעדיפות ניהולית
        </Typography>

        {snapshot.topRiskMachines.length ===
        0 ? (
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#F0FDF4",
              border: "1px solid #BBF7D0",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                color: "#166534",
                mb: 0.5,
              }}
            >
              אין כרגע מכונות בסיכון מהותי
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#166534",
              }}
            >
              כל המכונות נמצאות כרגע ברמת
              סיכון נמוכה.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
            }}
          >
            {snapshot.topRiskMachines.map(
              (machine) => (
                <RiskMachineRow
                  key={machine.machineCode}
                  machine={machine}
                  onOpen={() =>
                    navigate(
                      `/machines/${encodeURIComponent(
                        machine.assetNumber
                      )}`
                    )
                  }
                />
              )
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}