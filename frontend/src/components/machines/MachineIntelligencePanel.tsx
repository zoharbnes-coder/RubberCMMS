import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import type {
  MachineInsightSeverity,
  MachineIntelligenceSnapshot,
  MachineRiskLevel,
} from "../../services/machineIntelligenceService";

type MachineIntelligencePanelProps = {
  intelligence: MachineIntelligenceSnapshot;
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

function getInsightAlertSeverity(
  severity: MachineInsightSeverity
): "success" | "info" | "warning" | "error" {
  if (severity === "positive") {
    return "success";
  }

  if (severity === "danger") {
    return "error";
  }

  if (severity === "warning") {
    return "warning";
  }

  return "info";
}

export default function MachineIntelligencePanel({
  intelligence,
}: MachineIntelligencePanelProps) {
  const healthColor = getHealthColor(
    intelligence.healthScore
  );

  const riskColor = getRiskColor(
    intelligence.riskLevel
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
              Machine Intelligence
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "text.secondary",
              }}
            >
              ניתוח מצב המכונה על בסיס הקריאות והיסטוריית
              האחזקה.
            </Typography>
          </Box>

          <Chip
            label={`רמת סיכון: ${getRiskLabel(
              intelligence.riskLevel
            )}`}
            sx={{
              bgcolor: riskColor,
              color: "white",
              fontWeight: 900,
              fontSize: 14,
              minHeight: 36,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "320px minmax(0, 1fr)",
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
              Machine Health Score
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 52,
                lineHeight: 1,
                color: healthColor,
                mb: 2,
              }}
            >
              {intelligence.healthScore}
              <Box
                component="span"
                sx={{
                  fontSize: 20,
                  color: "text.secondary",
                  mr: 0.5,
                }}
              >
                /100
              </Box>
            </Typography>

            <LinearProgress
              variant="determinate"
              value={intelligence.healthScore}
              sx={{
                height: 12,
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
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
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
                  mb: 0.5,
                }}
              >
                תקלות ב־7 ימים
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 28,
                }}
              >
                {intelligence.failuresLast7Days}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
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
                  mb: 0.5,
                }}
              >
                תקלות ב־30 ימים
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 28,
                }}
              >
                {intelligence.failuresLast30Days}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                bgcolor: "#FFF7ED",
                border: "1px solid #FED7AA",
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
                השבתות ב־30 ימים
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 28,
                  color: "#DC2626",
                }}
              >
                {
                  intelligence.downtimeFailuresLast30Days
                }
              </Typography>
            </Box>
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
          תובנות
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            mb: 3,
          }}
        >
          {intelligence.insights.length === 0 ? (
            <Alert severity="info">
              עדיין אין מספיק נתונים ליצירת תובנות.
            </Alert>
          ) : (
            intelligence.insights.map((insight) => (
              <Alert
                key={insight.id}
                severity={getInsightAlertSeverity(
                  insight.severity
                )}
              >
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    mb: 0.25,
                  }}
                >
                  {insight.title}
                </Typography>

                <Typography component="div">
                  {insight.description}
                </Typography>
              </Alert>
            ))
          )}
        </Box>

        <Typography
          component="h3"
          variant="h6"
          sx={{
            fontWeight: 900,
            mb: 1.5,
          }}
        >
          המלצות פעולה
        </Typography>

        <Box
          component="ol"
          sx={{
            m: 0,
            pr: 3,
            display: "grid",
            gap: 1.25,
          }}
        >
          {intelligence.recommendations.length === 0 ? (
            <Typography
              component="li"
              sx={{
                color: "text.secondary",
              }}
            >
              עדיין אין המלצות זמינות.
            </Typography>
          ) : (
            intelligence.recommendations.map(
              (recommendation) => (
                <Typography
                  component="li"
                  key={recommendation}
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {recommendation}
                </Typography>
              )
            )
          )}
        </Box>

        {intelligence.repeatedFailures.length > 0 && (
          <>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight: 900,
                mt: 3,
                mb: 1.5,
              }}
            >
              תקלות חוזרות שזוהו
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
              }}
            >
              {intelligence.repeatedFailures.map(
                (failure) => (
                  <Box
                    key={failure.normalizedDescription}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: "#FFF7ED",
                      border: "1px solid #FED7AA",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontWeight: 900,
                        mb: 0.5,
                      }}
                    >
                      {failure.exampleDescription}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color: "text.secondary",
                        fontSize: 13,
                      }}
                    >
                      הופיעה {failure.count} פעמים · מתוכן{" "}
                      {failure.downtimeCount} משביתות
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}