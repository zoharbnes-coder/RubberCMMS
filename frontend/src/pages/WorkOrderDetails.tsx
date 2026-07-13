import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CloseWorkOrderForm from "../components/workorders/CloseWorkOrderForm";
import WorkOrderActions from "../components/workorders/WorkOrderActions";
import type { AppUser } from "../data/users";
import {
  getWorkOrderDetailsSnapshot,
} from "../services/workOrderDetailsService";
import type {
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
  WorkOrderType,
} from "../types/workOrder";
import { formatMinutes } from "../utils/workOrderMetrics";

type WorkOrderDetailsProps = {
  currentUser: AppUser;
};

function getStatusLabel(status: WorkOrderStatus) {
  if (status === "paused") {
    return "מושהה";
  }

  if (status === "closed") {
    return "סגור";
  }

  return "פתוח";
}

function getStatusColor(
  status: WorkOrderStatus
): "info" | "warning" | "success" {
  if (status === "paused") {
    return "warning";
  }

  if (status === "closed") {
    return "success";
  }

  return "info";
}

function getPriorityLabel(
  priority: WorkOrderPriority
) {
  if (priority === "high") {
    return "גבוהה";
  }

  if (priority === "low") {
    return "נמוכה";
  }

  return "בינונית";
}

function getPriorityColor(
  priority: WorkOrderPriority
) {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#F59E0B";
}

function getTypeLabel(type: WorkOrderType) {
  if (type === "preventive") {
    return "טיפול מונע";
  }

  if (type === "safety") {
    return "בטיחות";
  }

  if (type === "improvement") {
    return "שיפור";
  }

  return "תקלה";
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

type MetricCardProps = {
  label: string;
  value: string;
  color?: string;
};

function MetricCard({
  label,
  value,
  color = "#0F172A",
}: MetricCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow:
          "0 6px 18px rgba(15,23,42,0.07)",
      }}
    >
      <CardContent>
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
            fontSize: 22,
            color,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function WorkOrderDetails({
  currentUser,
}: WorkOrderDetailsProps) {
  const { workOrderId } = useParams<{
    workOrderId: string;
  }>();

  const navigate = useNavigate();

  const initialSnapshot = useMemo(
    () =>
      workOrderId
        ? getWorkOrderDetailsSnapshot(
            decodeURIComponent(workOrderId)
          )
        : null,
    [workOrderId]
  );

  const [workOrder, setWorkOrder] =
    useState<WorkOrder | null>(
      initialSnapshot?.workOrder ?? null
    );

  const [showCloseForm, setShowCloseForm] =
    useState(false);

  const snapshot = workOrder
    ? getWorkOrderDetailsSnapshot(workOrder.id)
    : null;

  function handleUpdated(
    updatedWorkOrder: WorkOrder
  ) {
    setWorkOrder({
      ...updatedWorkOrder,
    });
  }

  function handleClosed(
    updatedWorkOrder: WorkOrder
  ) {
    setWorkOrder({
      ...updatedWorkOrder,
    });

    setShowCloseForm(false);
  }

  if (!snapshot || !workOrder) {
    return (
      <Box dir="rtl">
        <Alert severity="error" sx={{ mb: 3 }}>
          הקריאה לא נמצאה.
        </Alert>

        <Button
          variant="contained"
          onClick={() => navigate("/workorders")}
          sx={{
            fontWeight: 900,
          }}
        >
          חזרה לקריאות
        </Button>
      </Box>
    );
  }

  const priorityColor =
    getPriorityColor(workOrder.priority);

  return (
    <Box dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/workorders")}
          sx={{
            fontWeight: 900,
          }}
        >
          חזרה לקריאות
        </Button>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              `/machines/${encodeURIComponent(
                workOrder.machineDisplayNumber
              )}`
            )
          }
          sx={{
            fontWeight: 900,
          }}
        >
          פתח את המכונה
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: 5,
          mb: 3,
          borderRight: `8px solid ${priorityColor}`,
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.10)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
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
            }}
          >
            <Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 900,
                  mb: 0.5,
                }}
              >
                קריאה {workOrder.workOrderNumber}
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 18,
                  mb: 0.5,
                }}
              >
                {workOrder.machineDisplayNumber} -{" "}
                {workOrder.machineName}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                }}
              >
                {workOrder.department}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={getStatusLabel(
                  workOrder.status
                )}
                color={getStatusColor(
                  workOrder.status
                )}
                sx={{
                  fontWeight: 900,
                }}
              />

              <Chip
                label={getPriorityLabel(
                  workOrder.priority
                )}
                sx={{
                  bgcolor: priorityColor,
                  color: "white",
                  fontWeight: 900,
                }}
              />

              <Chip
                label={getTypeLabel(workOrder.type)}
                variant="outlined"
                sx={{
                  fontWeight: 900,
                }}
              />

              {workOrder.isDowntime && (
                <Chip
                  label="משביתה"
                  color="error"
                  sx={{
                    fontWeight: 900,
                  }}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label={
            snapshot.isClosed
              ? "זמן כולל עד סגירה"
              : "זמן פתוח"
          }
          value={formatMinutes(
            snapshot.openTimeMinutes
          )}
        />

        <MetricCard
          label="זמן תגובה"
          value={
            snapshot.responseTimeMinutes === null
              ? "טרם נלקחה לטיפול"
              : formatMinutes(
                  snapshot.responseTimeMinutes
                )
          }
          color={
            snapshot.responseTimeMinutes === null
              ? "#64748B"
              : "#2563EB"
          }
        />

        <MetricCard
          label="זמן טיפול"
          value={
            snapshot.repairTimeMinutes === null
              ? "הטיפול טרם התחיל"
              : formatMinutes(
                  snapshot.repairTimeMinutes
                )
          }
          color={
            snapshot.repairTimeMinutes === null
              ? "#64748B"
              : "#7C3AED"
          }
        />

        <MetricCard
          label="זמן השבתה"
          value={
            snapshot.downtimeMinutes === null
              ? "לא משביתה"
              : formatMinutes(
                  snapshot.downtimeMinutes
                )
          }
          color={
            snapshot.downtimeMinutes === null
              ? "#16A34A"
              : "#DC2626"
          }
        />
      </Box>

      <Card
        sx={{
          borderRadius: 5,
          mb: 3,
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 2,
            }}
          >
            פרטי הקריאה
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                מספר דוח
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.workOrderNumber}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                נפתחה בתאריך
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {formatDate(workOrder.openedAt)}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                נפתחה על ידי
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.openedBy}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                קוד מכונה
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.machineCode}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                תחילת טיפול
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {formatDate(workOrder.takenAt)}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                מטפל
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.takenBy ?? "-"}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                מועד סגירה
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {formatDate(workOrder.closedAt)}
              </Typography>
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                נסגרה על ידי
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.closedBy ?? "-"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            component="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
            }}
          >
            תיאור התקלה
          </Typography>

          <Typography
            component="p"
            sx={{
              whiteSpace: "pre-wrap",
            }}
          >
            {workOrder.faultDescription}
          </Typography>
        </CardContent>
      </Card>

      {workOrder.status === "closed" && (
        <Card
          sx={{
            borderRadius: 5,
            mb: 3,
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <CardContent>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 2,
              }}
            >
              סיכום טיפול
            </Typography>

            <Typography
              component="p"
              sx={{
                whiteSpace: "pre-wrap",
                mb: 3,
              }}
            >
              {workOrder.repairDescription ||
                "לא הוזן תיאור טיפול."}
            </Typography>

            <Typography
              component="h3"
              sx={{
                fontWeight: 900,
                mb: 1.5,
              }}
            >
              חלקים שהוחלפו
            </Typography>

            {workOrder.replacedParts.length === 0 ? (
              <Typography
                component="p"
                sx={{
                  color: "text.secondary",
                }}
              >
                לא נרשמו חלקים שהוחלפו.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                }}
              >
                {workOrder.replacedParts.map(
                  (part) => (
                    <Box
                      key={part.id}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "#F8FAFC",
                        border:
                          "1px solid #E2E8F0",
                      }}
                    >
                      <Typography
                        component="div"
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        {part.itemCode} -{" "}
                        {part.description}
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          color: "text.secondary",
                          fontSize: 13,
                        }}
                      >
                        כמות: {part.quantity}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Card
        sx={{
          borderRadius: 5,
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 2,
            }}
          >
            פעולות בקריאה
          </Typography>

          <WorkOrderActions
            workOrder={workOrder}
            currentUser={currentUser}
            onUpdated={handleUpdated}
            onRequestClose={() =>
              setShowCloseForm(true)
            }
          />

          {showCloseForm &&
            workOrder.status !== "closed" && (
              <CloseWorkOrderForm
                workOrder={workOrder}
                currentUser={currentUser}
                onClosed={handleClosed}
                onCancel={() =>
                  setShowCloseForm(false)
                }
              />
            )}
        </CardContent>
      </Card>
    </Box>
  );
}