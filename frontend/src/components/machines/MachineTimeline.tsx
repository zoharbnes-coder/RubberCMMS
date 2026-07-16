import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  MachineTimelineEvent,
  MachineTimelineEventSeverity,
  MachineTimelineEventType,
  MachineTimelineSnapshot,
} from "../../services/machineTimelineService";
import { formatMinutes } from "../../utils/workOrderMetrics";

type MachineTimelineProps = {
  snapshot: MachineTimelineSnapshot;
};

type TimelineFilter =
  | "all"
  | "breakdown"
  | "preventive_maintenance"
  | "inspection"
  | "safety"
  | "improvement"
  | "work_order";

function getEventTypeLabel(
  eventType: MachineTimelineEventType
): string {
  if (eventType === "breakdown") {
    return "תקלה משביתה";
  }

  if (eventType === "preventive_maintenance") {
    return "טיפול מונע";
  }

  if (eventType === "inspection") {
    return "בדיקה";
  }

  if (eventType === "safety") {
    return "בטיחות";
  }

  if (eventType === "improvement") {
    return "שיפור";
  }

  return "קריאת אחזקה";
}

function getSeverityColor(
  severity: MachineTimelineEventSeverity
): string {
  if (severity === "danger") {
    return "#DC2626";
  }

  if (severity === "warning") {
    return "#D97706";
  }

  if (severity === "success") {
    return "#16A34A";
  }

  if (severity === "info") {
    return "#2563EB";
  }

  return "#64748B";
}

function getEventBackground(
  severity: MachineTimelineEventSeverity
): string {
  if (severity === "danger") {
    return "#FEF2F2";
  }

  if (severity === "warning") {
    return "#FFFBEB";
  }

  if (severity === "success") {
    return "#F0FDF4";
  }

  if (severity === "info") {
    return "#EFF6FF";
  }

  return "#F8FAFC";
}

function getEventBorder(
  severity: MachineTimelineEventSeverity
): string {
  if (severity === "danger") {
    return "#FECACA";
  }

  if (severity === "warning") {
    return "#FDE68A";
  }

  if (severity === "success") {
    return "#BBF7D0";
  }

  if (severity === "info") {
    return "#BFDBFE";
  }

  return "#E2E8F0";
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

function openEvent(
  event: MachineTimelineEvent,
  navigate: ReturnType<typeof useNavigate>
) {
  if (event.sourceType === "work_order") {
    navigate(
      `/workorders/${encodeURIComponent(
        event.sourceId
      )}`
    );

    return;
  }

  navigate(
    `/maintenance?asset=${encodeURIComponent(
      event.assetNumber
    )}&execution=${encodeURIComponent(
      event.sourceId
    )}`
  );
}

function TimelineEventRow({
  event,
  isLast,
  onOpen,
}: {
  event: MachineTimelineEvent;
  isLast: boolean;
  onOpen: () => void;
}) {
  const severityColor = getSeverityColor(
    event.severity
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "28px minmax(0, 1fr)",
          md: "34px 145px minmax(0, 1fr)",
        },
        gap: {
          xs: 1,
          md: 1.25,
        },
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: severityColor,
            border: "3px solid #FFFFFF",
            boxShadow: `0 0 0 2px ${severityColor}33`,
            mt: 1.35,
            zIndex: 1,
          }}
        />

        {!isLast && (
          <Box
            sx={{
              position: "absolute",
              top: 24,
              bottom: -12,
              width: 2,
              bgcolor: "#E2E8F0",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          pt: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontWeight: 900,
            fontSize: 11.5,
            lineHeight: 1.25,
          }}
        >
          {formatDate(event.occurredAt)}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
            mt: 0.25,
          }}
        >
          {event.sourceNumber}
        </Typography>
      </Box>

      <Box
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(keyboardEvent) => {
          if (
            keyboardEvent.key === "Enter" ||
            keyboardEvent.key === " "
          ) {
            onOpen();
          }
        }}
        sx={{
          gridColumn: {
            xs: "2",
            md: "3",
          },
          mb: 1.25,
          px: {
            xs: 1.25,
            md: 1.5,
          },
          py: 1.25,
          borderRadius: 3,
          bgcolor: getEventBackground(
            event.severity
          ),
          border: `1px solid ${getEventBorder(
            event.severity
          )}`,
          borderRight: `5px solid ${severityColor}`,
          cursor: "pointer",
          transition:
            "transform 150ms ease, box-shadow 150ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow:
              "0 6px 16px rgba(15,23,42,0.08)",
          },
          "&:focus-visible": {
            outline: "3px solid #2563EB",
            outlineOffset: 2,
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
            mb: 0.75,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 13.5,
                lineHeight: 1.35,
                overflowWrap: "anywhere",
              }}
            >
              {event.title}
            </Typography>

            <Typography
              component="div"
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
                color: "text.secondary",
                fontSize: 10.5,
                mt: 0.3,
              }}
            >
              {formatDate(event.occurredAt)} ·{" "}
              {event.sourceNumber}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.6,
              flexShrink: 0,
            }}
          >
            <Chip
              label={getEventTypeLabel(
                event.eventType
              )}
              size="small"
              sx={{
                bgcolor: severityColor,
                color: "white",
                fontWeight: 900,
              }}
            />

            <Chip
              label={event.statusLabel}
              size="small"
              variant="outlined"
            />

            {event.isDowntime && (
              <Chip
                label="השבתה"
                size="small"
                color="error"
              />
            )}
          </Box>
        </Box>

        <Typography
          component="div"
          sx={{
            color: "text.primary",
            fontSize: 11.75,
            lineHeight: 1.5,
            mb: 0.75,
            whiteSpace: "pre-wrap",
          }}
        >
          {event.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.25,
            alignItems: "center",
            mb:
              event.details.length > 0
                ? 0.75
                : 0,
          }}
        >
          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            אחראי:{" "}
            <Box
              component="span"
              sx={{
                color: "text.primary",
                fontWeight: 800,
              }}
            >
              {event.responsibleName}
            </Box>
          </Typography>

          {event.durationMinutes !== null && (
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 10.5,
              }}
            >
              משך:{" "}
              <Box
                component="span"
                sx={{
                  color: severityColor,
                  fontWeight: 900,
                }}
              >
                {formatMinutes(
                  event.durationMinutes
                )}
              </Box>
            </Typography>
          )}
        </Box>

        {event.details.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.6,
            }}
          >
            {event.details.map((detail) => (
              <Chip
                key={detail}
                label={detail}
                size="small"
                variant="outlined"
                sx={{
                  maxWidth: "100%",
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
    </Box>
  );
}

export default function MachineTimeline({
  snapshot,
}: MachineTimelineProps) {
  const navigate = useNavigate();

  const [filter, setFilter] =
    useState<TimelineFilter>("all");

  const filteredEvents = useMemo(() => {
    if (filter === "all") {
      return snapshot.events;
    }

    return snapshot.events.filter(
      (event) =>
        event.eventType === filter
    );
  }, [filter, snapshot.events]);

  const filters: Array<{
    value: TimelineFilter;
    label: string;
  }> = [
    {
      value: "all",
      label: `הכול (${snapshot.summary.totalEvents})`,
    },
    {
      value: "breakdown",
      label: `תקלות (${snapshot.summary.breakdownEvents})`,
    },
    {
      value: "preventive_maintenance",
      label: `PM (${snapshot.summary.preventiveMaintenanceEvents})`,
    },
    {
      value: "safety",
      label: `בטיחות (${snapshot.summary.safetyEvents})`,
    },
    {
      value: "inspection",
      label: `בדיקות (${snapshot.summary.inspectionEvents})`,
    },
  ];

  return (
    <Card sx={{ mb: 2 }}>
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
            justifyContent:
              "space-between",
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
                fontSize: 16,
                mb: 0.25,
              }}
            >
              ציר זמן המכונה
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11,
              }}
            >
              תקלות, טיפולים מונעים ואירועים
              לפי סדר כרונולוגי
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.6,
            }}
          >
            {filters.map((item) => (
              <Button
                key={item.value}
                variant={
                  filter === item.value
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() =>
                  setFilter(item.value)
                }
                sx={{
                  fontWeight: 900,
                }}
              >
                {item.label}
              </Button>
            ))}
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
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              px: 1.15,
              py: 0.8,
              borderRadius: 2.25,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 9.5,
              }}
            >
              אירועים ב־7 ימים
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 17,
              }}
            >
              {snapshot.summary.eventsLast7Days}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.15,
              py: 0.8,
              borderRadius: 2.25,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 9.5,
              }}
            >
              אירועים ב־30 ימים
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 17,
              }}
            >
              {snapshot.summary.eventsLast30Days}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.15,
              py: 0.8,
              borderRadius: 2.25,
              bgcolor:
                snapshot.summary
                  .downtimeEvents > 0
                  ? "#FEF2F2"
                  : "#F0FDF4",
              border:
                snapshot.summary
                  .downtimeEvents > 0
                  ? "1px solid #FECACA"
                  : "1px solid #BBF7D0",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 9.5,
              }}
            >
              אירועי השבתה
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 17,
                color:
                  snapshot.summary
                    .downtimeEvents > 0
                    ? "#DC2626"
                    : "#16A34A",
              }}
            >
              {snapshot.summary.downtimeEvents}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.15,
              py: 0.8,
              borderRadius: 2.25,
              bgcolor: "#EFF6FF",
              border: "1px solid #BFDBFE",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 9.5,
              }}
            >
              טיפולים מונעים
            </Typography>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 17,
                color: "#2563EB",
              }}
            >
              {
                snapshot.summary
                  .preventiveMaintenanceEvents
              }
            </Typography>
          </Box>
        </Box>

        {filteredEvents.length === 0 ? (
          <Box
            sx={{
              px: 2,
              py: 2.5,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: 13,
                mb: 0.25,
              }}
            >
              אין אירועים להצגה
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontSize: 11,
              }}
            >
              לא נמצאו אירועים שמתאימים לסינון
              שנבחר.
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredEvents.map(
              (event, index) => (
                <TimelineEventRow
                  key={event.id}
                  event={event}
                  isLast={
                    index ===
                    filteredEvents.length - 1
                  }
                  onOpen={() =>
                    openEvent(
                      event,
                      navigate
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