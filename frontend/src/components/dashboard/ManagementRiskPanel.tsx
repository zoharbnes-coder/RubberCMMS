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
    return "קריטי";
  }

  if (riskLevel === "high") {
    return "גבוה";
  }

  if (riskLevel === "medium") {
    return "בינוני";
  }

  return "נמוך";
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

function RiskCounter({
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        minWidth: 0,
        px: 1.5,
        py: 1,
        borderRadius: 2.5,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontWeight: 800,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          fontSize: 18,
          color,
          lineHeight: 1,
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
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1.25fr 0.75fr 0.7fr 1.8fr auto",
        },
        gap: {
          xs: 1.25,
          md: 1.75,
        },
        alignItems: "center",
        px: {
          xs: 1.5,
          md: 2,
        },
        py: {
          xs: 1.5,
          md: 1.35,
        },
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRight: `6px solid ${riskColor}`,
        cursor: "pointer",
        transition:
          "background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
        "&:hover": {
          bgcolor: "#F8FAFC",
          boxShadow:
            "0 6px 18px rgba(15,23,42,0.08)",
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: "3px solid #2563EB",
          outlineOffset: 2,
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{
            fontWeight: 900,
            fontSize: 14,
            lineHeight: 1.25,
            mb: 0.35,
          }}
        >
          {machine.assetNumber} -{" "}
          {machine.machineName}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 11.5,
          }}
        >
          {machine.department}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
            mb: 0.35,
          }}
        >
          Health Score
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 0.4,
            mb: 0.65,
          }}
        >
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 19,
              color: healthColor,
              lineHeight: 1,
            }}
          >
            {machine.healthScore}
          </Typography>

          <Typography
            component="span"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            /100
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={machine.healthScore}
          sx={{
            height: 6,
            "& .MuiLinearProgress-bar": {
              bgcolor: healthColor,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          justifyItems: {
            xs: "start",
            md: "center",
          },
          gap: 0.5,
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
            fontSize: 10.5,
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
            fontSize: 10.5,
            fontWeight:
              machine.downtimeWorkOrders > 0
                ? 900
                : 500,
          }}
        >
          משביתות:{" "}
          {machine.downtimeWorkOrders}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
            mb: 0.35,
          }}
        >
          פעולה מומלצת
        </Typography>

        <Typography
          component="div"
          sx={{
            fontWeight: 800,
            fontSize: 12.5,
            lineHeight: 1.45,
            overflowWrap: "anywhere",
          }}
        >
          {machine.primaryRecommendation}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
            mt: 0.5,
          }}
        >
          7 ימים:{" "}
          {machine.failuresLast7Days} · 30 ימים:{" "}
          {machine.failuresLast30Days} · השבתות:{" "}
          {
            machine.downtimeFailuresLast30Days
          }
        </Typography>
      </Box>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          fontSize: 20,
          color: "#64748B",
          transform: "rotate(180deg)",
          justifySelf: {
            xs: "start",
            md: "end",
          },
        }}
      >
        ‹
      </Typography>
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

  const attentionColor =
    snapshot.machinesRequiringAttention > 0
      ? "#DC2626"
      : "#16A34A";

  return (
    <Card
      sx={{
        mb: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: 5,
          bgcolor: healthColor,
        }}
      />

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
            gap: 1.25,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 900,
                fontSize: 18,
                mb: 0.25,
              }}
            >
              מצב המפעל
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11.5,
              }}
            >
              בריאות המכונות והנושאים הדורשים
              פעולה עכשיו
            </Typography>
          </Box>

          <Chip
            label={`${snapshot.machinesRequiringAttention} מכונות דורשות תשומת לב`}
            size="small"
            sx={{
              bgcolor: attentionColor,
              color: "white",
              fontWeight: 900,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "280px minmax(0, 1fr)",
            },
            gap: 1.5,
            mb: 1.75,
          }}
        >
          <Box
            sx={{
              display: "grid",
              alignContent: "center",
              px: 2,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11.5,
                mb: 0.4,
              }}
            >
              Plant Health
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 0.5,
                mb: 1,
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 38,
                  lineHeight: 1,
                  color: healthColor,
                }}
              >
                {snapshot.averageHealthScore.toFixed(
                  1
                )}
              </Typography>

              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                /100
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={snapshot.averageHealthScore}
              sx={{
                height: 8,
                "& .MuiLinearProgress-bar": {
                  bgcolor: healthColor,
                },
              }}
            />

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 10.5,
                mt: 0.75,
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
                sm: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1,
              alignContent: "center",
            }}
          >
            <RiskCounter
              label="סיכון נמוך"
              value={snapshot.lowRiskMachines}
              color="#16A34A"
            />

            <RiskCounter
              label="סיכון בינוני"
              value={
                snapshot.mediumRiskMachines
              }
              color="#F59E0B"
            />

            <RiskCounter
              label="סיכון גבוה"
              value={snapshot.highRiskMachines}
              color="#DC2626"
            />

            <RiskCounter
              label="סיכון קריטי"
              value={
                snapshot.criticalRiskMachines
              }
              color="#991B1B"
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontWeight: 900,
              fontSize: 15,
            }}
          >
            דורש טיפול עכשיו
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            ממויין לפי רמת סיכון
          </Typography>
        </Box>

        {snapshot.topRiskMachines.length ===
        0 ? (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "#F0FDF4",
              border: "1px solid #BBF7D0",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                color: "#166534",
                fontSize: 13,
                mb: 0.25,
              }}
            >
              אין כרגע מכונות בסיכון מהותי
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#166534",
                fontSize: 11.5,
              }}
            >
              כל המכונות נמצאות כרגע ברמת סיכון
              נמוכה.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 1,
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