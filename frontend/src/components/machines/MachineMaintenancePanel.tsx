import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type {
  MachineMaintenanceSummary,
  MaintenanceExecutionStatus,
} from "../../types/preventiveMaintenance";

type MachineMaintenancePanelProps = {
  summary: MachineMaintenanceSummary;
};

function getExecutionStatusLabel(
  status: MaintenanceExecutionStatus
): string {
  if (status === "overdue") {
    return "באיחור";
  }

  if (status === "due") {
    return "לביצוע";
  }

  if (status === "in_progress") {
    return "בביצוע";
  }

  if (status === "completed") {
    return "הושלם";
  }

  if (status === "cancelled") {
    return "בוטל";
  }

  return "מתוכנן";
}

function getExecutionStatusColor(
  status: MaintenanceExecutionStatus
):
  | "default"
  | "info"
  | "warning"
  | "error"
  | "success" {
  if (status === "overdue") {
    return "error";
  }

  if (status === "due") {
    return "warning";
  }

  if (status === "in_progress") {
    return "info";
  }

  if (status === "completed") {
    return "success";
  }

  return "default";
}

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function SummaryItem({
  label,
  value,
  color = "#0F172A",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: 1.25,
        py: 1,
        borderRadius: 2.5,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    >
      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          fontSize: 10.5,
          mb: 0.25,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          color,
          fontWeight: 900,
          fontSize: 20,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function MachineMaintenancePanel({
  summary,
}: MachineMaintenancePanelProps) {
  const navigate = useNavigate();

  const hasOverdue =
    summary.overdueExecutions > 0;

  const hasDue =
    summary.dueExecutions > 0;

  const attentionColor = hasOverdue
    ? "#DC2626"
    : hasDue
      ? "#D97706"
      : "#16A34A";

  const nextExecution =
    summary.nextExecution;

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
          bgcolor: attentionColor,
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
                fontSize: 17,
                mb: 0.25,
              }}
            >
              תוכנית טיפולים
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11.5,
              }}
            >
              טיפולים מונעים, ביצועים ומועדים
              למכונה
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {hasOverdue && (
              <Chip
                label={`${summary.overdueExecutions} טיפולים באיחור`}
                color="error"
                size="small"
              />
            )}

            {!hasOverdue && hasDue && (
              <Chip
                label={`${summary.dueExecutions} טיפולים לביצוע`}
                color="warning"
                size="small"
              />
            )}

            {!hasOverdue && !hasDue && (
              <Chip
                label="תוכנית הטיפולים תקינה"
                color="success"
                size="small"
              />
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                navigate(
                  `/maintenance?asset=${encodeURIComponent(
                    summary.assetNumber
                  )}`
                )
              }
              sx={{
                fontWeight: 900,
              }}
            >
              פתח תוכנית טיפולים
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
              xl: "repeat(6, minmax(0, 1fr))",
            },
            gap: 1,
            mb: 1.5,
          }}
        >
          <SummaryItem
            label="תוכניות פעילות"
            value={summary.activePlans}
            color="#2563EB"
          />

          <SummaryItem
            label="טיפולים מתוכננים"
            value={summary.upcomingExecutions}
            color="#0284C7"
          />

          <SummaryItem
            label="לביצוע"
            value={summary.dueExecutions}
            color="#D97706"
          />

          <SummaryItem
            label="באיחור"
            value={summary.overdueExecutions}
            color="#DC2626"
          />

          <SummaryItem
            label="בביצוע"
            value={summary.inProgressExecutions}
            color="#7C3AED"
          />

          <SummaryItem
            label="הושלמו ב־30 יום"
            value={summary.completedLast30Days}
            color="#16A34A"
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.1fr 1fr 1.5fr",
            },
            gap: 1.25,
            alignItems: "center",
            px: 1.5,
            py: 1.25,
            borderRadius: 3,
            bgcolor: nextExecution
              ? "#F8FAFC"
              : "#F0FDF4",
            border: nextExecution
              ? "1px solid #E2E8F0"
              : "1px solid #BBF7D0",
          }}
        >
          {!nextExecution ? (
            <Typography
              component="div"
              sx={{
                color: "#166534",
                fontWeight: 800,
                fontSize: 12.5,
                gridColumn: "1 / -1",
              }}
            >
              אין כרגע טיפול מתוכנן למכונה זו.
            </Typography>
          ) : (
            <>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 10.5,
                    mb: 0.25,
                  }}
                >
                  הטיפול הבא
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    fontSize: 13.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nextExecution.planTitle}
                </Typography>
              </Box>

              <Box>
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 10.5,
                    mb: 0.25,
                  }}
                >
                  מועד לביצוע
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    fontSize: 12.5,
                  }}
                >
                  {formatDate(nextExecution.dueAt)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "flex-start",
                    lg: "flex-end",
                  },
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={getExecutionStatusLabel(
                    nextExecution.status
                  )}
                  color={getExecutionStatusColor(
                    nextExecution.status
                  )}
                  size="small"
                />

                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 11,
                  }}
                >
                  אחראי:{" "}
                  {nextExecution.assignedUserName ??
                    "טרם שויך"}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}