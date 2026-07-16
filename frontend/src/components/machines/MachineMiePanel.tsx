import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import type {
  MieAssetSnapshot,
} from "../../engine/mie/mieService";

import type {
  MieRecommendation,
  MieRecommendationPriority,
  MieRiskLevel,
  MieRuleResult,
  MieSeverity,
} from "../../engine/mie/types";

type MachineMiePanelProps = {
  snapshot: MieAssetSnapshot;
};

function getRiskLabel(
  riskLevel: MieRiskLevel
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
  riskLevel: MieRiskLevel
): string {
  if (riskLevel === "critical") {
    return "#991B1B";
  }

  if (riskLevel === "high") {
    return "#DC2626";
  }

  if (riskLevel === "medium") {
    return "#D97706";
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
    return "#D97706";
  }

  return "#16A34A";
}

function getSeverityLabel(
  severity: MieSeverity
): string {
  if (severity === "critical") {
    return "קריטי";
  }

  if (severity === "danger") {
    return "סכנה";
  }

  if (severity === "warning") {
    return "אזהרה";
  }

  if (severity === "positive") {
    return "תקין";
  }

  return "מידע";
}

function getSeverityColor(
  severity: MieSeverity
): string {
  if (severity === "critical") {
    return "#991B1B";
  }

  if (severity === "danger") {
    return "#DC2626";
  }

  if (severity === "warning") {
    return "#D97706";
  }

  if (severity === "positive") {
    return "#16A34A";
  }

  return "#2563EB";
}

function getSeverityBackground(
  severity: MieSeverity
): string {
  if (severity === "critical") {
    return "#FEF2F2";
  }

  if (severity === "danger") {
    return "#FEF2F2";
  }

  if (severity === "warning") {
    return "#FFFBEB";
  }

  if (severity === "positive") {
    return "#F0FDF4";
  }

  return "#EFF6FF";
}

function getSeverityBorder(
  severity: MieSeverity
): string {
  if (
    severity === "critical" ||
    severity === "danger"
  ) {
    return "#FECACA";
  }

  if (severity === "warning") {
    return "#FDE68A";
  }

  if (severity === "positive") {
    return "#BBF7D0";
  }

  return "#BFDBFE";
}

function getRecommendationPriorityLabel(
  priority: MieRecommendationPriority
): string {
  if (priority === "urgent") {
    return "דחוף";
  }

  if (priority === "high") {
    return "גבוה";
  }

  if (priority === "medium") {
    return "בינוני";
  }

  return "נמוך";
}

function getRecommendationPriorityColor(
  priority: MieRecommendationPriority
): string {
  if (priority === "urgent") {
    return "#991B1B";
  }

  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "medium") {
    return "#D97706";
  }

  return "#2563EB";
}

function getActionTypeLabel(
  actionType: MieRecommendation["actionType"]
): string {
  if (actionType === "monitor") {
    return "מעקב";
  }

  if (actionType === "inspect") {
    return "בדיקה";
  }

  if (actionType === "repair") {
    return "תיקון";
  }

  if (actionType === "replace") {
    return "החלפה";
  }

  if (actionType === "schedule_pm") {
    return "תכנון טיפול";
  }

  if (actionType === "open_work_order") {
    return "פתיחת קריאה";
  }

  if (actionType === "perform_rca") {
    return "ניתוח שורש תקלה";
  }

  if (actionType === "review_spares") {
    return "בדיקת חלפים";
  }

  if (actionType === "review_documents") {
    return "בדיקת מסמכים";
  }

  if (actionType === "review_staffing") {
    return "בדיקת כוח אדם";
  }

  if (actionType === "review_process") {
    return "בדיקת תהליך";
  }

  return "פעולת בטיחות";
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function RuleResultCard({
  result,
}: {
  result: MieRuleResult;
}) {
  const severityColor =
    getSeverityColor(result.severity);

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 3,
        bgcolor: getSeverityBackground(
          result.severity
        ),
        border: `1px solid ${getSeverityBorder(
          result.severity
        )}`,
        borderRight: `5px solid ${severityColor}`,
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
          gap: 0.75,
          mb: 0.75,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 13.5,
              lineHeight: 1.3,
              mb: 0.2,
            }}
          >
            {result.title}
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            {result.ruleName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0.6,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          <Chip
            label={getSeverityLabel(
              result.severity
            )}
            size="small"
            sx={{
              bgcolor: severityColor,
              color: "white",
              fontWeight: 900,
            }}
          />

          <Chip
            label={`Confidence ${result.confidencePercent}%`}
            size="small"
            variant="outlined"
          />

          {result.healthPenalty > 0 && (
            <Chip
              label={`Health -${result.healthPenalty}`}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Typography
        component="div"
        sx={{
          fontSize: 11.75,
          lineHeight: 1.55,
          mb:
            result.evidence.length > 0
              ? 1
              : 0,
        }}
      >
        {result.description}
      </Typography>

      {result.evidence.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.6,
          }}
        >
          {result.evidence
            .slice(0, 6)
            .map((evidence) => (
              <Chip
                key={evidence.id}
                label={`${evidence.label}: ${evidence.value}`}
                size="small"
                variant="outlined"
                sx={{
                  maxWidth: "100%",
                  bgcolor: "#FFFFFFB8",

                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}

function RecommendationCard({
  recommendation,
  isPrimary,
}: {
  recommendation: MieRecommendation;
  isPrimary: boolean;
}) {
  const priorityColor =
    getRecommendationPriorityColor(
      recommendation.priority
    );

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 3,
        bgcolor: isPrimary
          ? "#EFF6FF"
          : "#F8FAFC",
        border: isPrimary
          ? "1px solid #BFDBFE"
          : "1px solid #E2E8F0",
        borderRight: `5px solid ${priorityColor}`,
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
          gap: 0.75,
          mb: 0.75,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 13.5,
              lineHeight: 1.3,
              mb: 0.2,
            }}
          >
            {recommendation.title}
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            {getActionTypeLabel(
              recommendation.actionType
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0.6,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          {isPrimary && (
            <Chip
              label="פעולה ראשית"
              size="small"
              color="primary"
            />
          )}

          <Chip
            label={getRecommendationPriorityLabel(
              recommendation.priority
            )}
            size="small"
            sx={{
              bgcolor: priorityColor,
              color: "white",
              fontWeight: 900,
            }}
          />

          <Chip
            label={`${recommendation.confidencePercent}% ביטחון`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Typography
        component="div"
        sx={{
          fontSize: 11.75,
          lineHeight: 1.55,
          mb: 0.65,
        }}
      >
        {recommendation.description}
      </Typography>

      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          fontSize: 10.75,
          lineHeight: 1.5,
        }}
      >
        <Box
          component="span"
          sx={{
            color: "text.primary",
            fontWeight: 900,
          }}
        >
          למה?
        </Box>{" "}
        {recommendation.reason}
      </Typography>
    </Box>
  );
}

export default function MachineMiePanel({
  snapshot,
}: MachineMiePanelProps) {
  const healthColor =
    getHealthColor(snapshot.healthScore);

  const riskColor =
    getRiskColor(snapshot.riskLevel);

  const primaryRecommendation =
    snapshot.recommendations[0] ?? null;

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
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 900,
                fontSize: 17,
                mb: 0.25,
              }}
            >
              Maintenance Intelligence
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11,
              }}
            >
              חוקים, ראיות והמלצות פעולה של מנוע
              MIE
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`סיכון ${getRiskLabel(
                snapshot.riskLevel
              )}`}
              size="small"
              sx={{
                bgcolor: riskColor,
                color: "white",
                fontWeight: 900,
              }}
            />

            <Chip
              label={`${snapshot.recommendations.length} המלצות`}
              size="small"
              variant="outlined"
            />

            {snapshot.urgentRecommendations.length >
              0 && (
              <Chip
                label={`${snapshot.urgentRecommendations.length} דחופות`}
                size="small"
                color="error"
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "240px minmax(0, 1fr)",
            },
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              px: 1.75,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              alignSelf: "stretch",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 10.5,
                mb: 0.4,
              }}
            >
              MIE Health Score
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 0.45,
                mb: 0.85,
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 36,
                  lineHeight: 1,
                  color: healthColor,
                }}
              >
                {snapshot.healthScore}
              </Typography>

              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                /100
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={snapshot.healthScore}
              sx={{
                height: 8,

                "& .MuiLinearProgress-bar": {
                  bgcolor: healthColor,
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 1,
                mt: 0.75,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 10,
                }}
              >
                ציון בסיס
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 10.5,
                }}
              >
                {snapshot.baseHealthScore}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 1,
                mt: 0.4,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 10,
                }}
              >
                קנס מחוקים
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 10.5,
                  color:
                    snapshot.engine.summary
                      .totalHealthPenalty > 0
                      ? "#DC2626"
                      : "#16A34A",
                }}
              >
                -
                {
                  snapshot.engine.summary
                    .totalHealthPenalty
                }
              </Typography>
            </Box>
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
            {[
              {
                label: "חוקים שנבדקו",
                value:
                  snapshot.engine.summary
                    .totalRules,
                color: "#334155",
              },
              {
                label: "חוקים שהופעלו",
                value:
                  snapshot.engine.summary
                    .triggeredRules,
                color:
                  snapshot.engine.summary
                    .triggeredRules > 0
                    ? "#D97706"
                    : "#16A34A",
              },
              {
                label: "חוקים שעברו",
                value:
                  snapshot.engine.summary
                    .passedRules,
                color: "#16A34A",
              },
              {
                label: "המלצות דחופות",
                value:
                  snapshot.engine.summary
                    .urgentRecommendationCount,
                color:
                  snapshot.engine.summary
                    .urgentRecommendationCount > 0
                    ? "#DC2626"
                    : "#16A34A",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  px: 1.25,
                  py: 1,
                  borderRadius: 2.5,
                  bgcolor: "#F8FAFC",
                  border:
                    "1px solid #E2E8F0",
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 10,
                    mb: 0.25,
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    fontSize: 21,
                    lineHeight: 1,
                    color: item.color,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                gridColumn: {
                  xs: "1 / -1",
                  sm: "1 / -1",
                },
                px: 1.5,
                py: 1.25,
                borderRadius: 3,
                bgcolor: primaryRecommendation
                  ? "#EFF6FF"
                  : "#F0FDF4",
                border: primaryRecommendation
                  ? "1px solid #BFDBFE"
                  : "1px solid #BBF7D0",
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 10.5,
                  mb: 0.3,
                }}
              >
                הפעולה המומלצת עכשיו
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 13,
                  color: primaryRecommendation
                    ? "#1E3A8A"
                    : "#166534",
                  lineHeight: 1.45,
                }}
              >
                {primaryRecommendation
                  ? primaryRecommendation.title
                  : "לא נדרשת כרגע פעולה מיוחדת"}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: primaryRecommendation
                    ? "#1E3A8A"
                    : "#166534",
                  fontSize: 10.75,
                  mt: 0.3,
                  lineHeight: 1.45,
                }}
              >
                {primaryRecommendation
                  ? primaryRecommendation.reason
                  : "כל חוקי ה־MIE שנבדקו נמצאים בטווח התקין."}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          component="h3"
          sx={{
            fontWeight: 900,
            fontSize: 14.5,
            mb: 0.8,
          }}
        >
          ממצאים פעילים
        </Typography>

        {snapshot.triggeredRules.length === 0 ? (
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 3,
              bgcolor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              mb: 1.5,
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "#166534",
                fontWeight: 900,
                fontSize: 12.5,
              }}
            >
              לא זוהו כרגע חריגות פעילות
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 0.8,
              mb: 1.5,
            }}
          >
            {snapshot.triggeredRules.map(
              (result) => (
                <RuleResultCard
                  key={result.ruleId}
                  result={result}
                />
              )
            )}
          </Box>
        )}

        <Typography
          component="h3"
          sx={{
            fontWeight: 900,
            fontSize: 14.5,
            mb: 0.8,
          }}
        >
          המלצות פעולה
        </Typography>

        {snapshot.recommendations.length ===
        0 ? (
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 12,
              }}
            >
              עדיין אין המלצות פעילות לנכס זה.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 0.8,
            }}
          >
            {snapshot.recommendations.map(
              (recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={
                    recommendation
                  }
                  isPrimary={index === 0}
                />
              )
            )}
          </Box>
        )}

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 9.5,
            mt: 1.25,
            textAlign: "left",
          }}
        >
          עודכן:{" "}
          {formatDate(snapshot.generatedAt)}
        </Typography>
      </CardContent>
    </Card>
  );
}