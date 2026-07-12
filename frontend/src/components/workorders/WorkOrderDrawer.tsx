import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

import type { AppUser } from "../../data/users";
import type {
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
} from "../../types/workOrder";
import {
  getDowntime,
  getOpenTime,
  getRepairTime,
  getResponseTime,
} from "../../utils/workOrderMetrics";

import CloseWorkOrderForm from "./CloseWorkOrderForm";
import WorkOrderActions from "./WorkOrderActions";

type WorkOrderDrawerProps = {
  open: boolean;
  workOrder: WorkOrder | null;
  currentUser: AppUser;
  onClose: () => void;
  onUpdated: (updatedWorkOrder: WorkOrder) => void;
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

function getPriorityLabel(priority: WorkOrderPriority) {
  if (priority === "high") {
    return "גבוהה";
  }

  if (priority === "low") {
    return "נמוכה";
  }

  return "בינונית";
}

function getPriorityColor(priority: WorkOrderPriority) {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#F59E0B";
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
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
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
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          fontSize: 20,
          color,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function WorkOrderDrawer({
  open,
  workOrder,
  currentUser,
  onClose,
  onUpdated,
}: WorkOrderDrawerProps) {
  const [showCloseForm, setShowCloseForm] = useState(false);

  function handleDrawerClose() {
    setShowCloseForm(false);
    onClose();
  }

  function handleUpdated(updatedWorkOrder: WorkOrder) {
    onUpdated(updatedWorkOrder);
  }

  function handleClosed(updatedWorkOrder: WorkOrder) {
    onUpdated(updatedWorkOrder);
    setShowCloseForm(false);
  }

  const responseTime = workOrder
    ? getResponseTime(workOrder)
    : null;

  const repairTime = workOrder
    ? getRepairTime(workOrder)
    : null;

  const downtime = workOrder
    ? getDowntime(workOrder)
    : null;

  const openTime = workOrder
    ? getOpenTime(workOrder)
    : null;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 560,
              md: 720,
            },
            maxWidth: "100%",
            bgcolor: "background.default",
          },
        },
      }}
    >
      {!workOrder ? null : (
        <Box
          dir="rtl"
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
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
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
                קריאה {workOrder.workOrderNumber}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                }}
              >
                {workOrder.machineDisplayNumber} -{" "}
                {workOrder.machineName}
              </Typography>
            </Box>

            <IconButton
              onClick={handleDrawerClose}
              aria-label="סגירת חלון הקריאה"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
            }}
          >
            <Chip
              label={getStatusLabel(workOrder.status)}
              color={getStatusColor(workOrder.status)}
            />

            <Chip
              label={getPriorityLabel(workOrder.priority)}
              sx={{
                bgcolor: getPriorityColor(workOrder.priority),
                color: "white",
                fontWeight: 900,
              }}
            />

            {workOrder.isDowntime && (
              <Chip label="משביתה" color="error" />
            )}

            {workOrder.openedWhileAnotherCallWasOpen && (
              <Chip
                label="נפתחה בזמן קריאה קיימת"
                color="warning"
              />
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
              mb: 3,
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
                מחלקה
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 900 }}
              >
                {workOrder.department}
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
                התחלת טיפול
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
          </Box>

          <Typography
            component="h3"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 1.5,
            }}
          >
            מדדי זמן
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.5,
              mb: 3,
            }}
          >
            <MetricCard
              label={
                workOrder.status === "closed"
                  ? "זמן כולל עד סגירה"
                  : "זמן פתוח"
              }
              value={openTime?.display ?? "00:00"}
            />

            <MetricCard
              label="זמן תגובה"
              value={
                responseTime?.display ??
                "טרם נלקחה לטיפול"
              }
              color={
                responseTime ? "#2563EB" : "#64748B"
              }
            />

            <MetricCard
              label="זמן טיפול"
              value={
                repairTime?.display ??
                "הטיפול טרם התחיל"
              }
              color={
                repairTime ? "#7C3AED" : "#64748B"
              }
            />

            <MetricCard
              label="זמן השבתה"
              value={
                workOrder.isDowntime
                  ? downtime?.display ?? "00:00"
                  : "לא משביתה"
              }
              color={
                workOrder.isDowntime
                  ? "#DC2626"
                  : "#16A34A"
              }
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            component="h3"
            variant="h6"
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
              mb: 3,
            }}
          >
            {workOrder.faultDescription}
          </Typography>

          {workOrder.status === "closed" && (
            <>
              <Divider sx={{ mb: 3 }} />

              <Typography
                component="h3"
                variant="h6"
                sx={{
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                תיאור הטיפול
              </Typography>

              <Typography
                component="p"
                sx={{
                  whiteSpace: "pre-wrap",
                  mb: 2,
                }}
              >
                {workOrder.repairDescription}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                נסגרה על ידי:{" "}
                {workOrder.closedBy ?? "-"}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                  mb: 3,
                }}
              >
                מועד סגירה:{" "}
                {formatDate(workOrder.closedAt)}
              </Typography>

              {workOrder.replacedParts.length > 0 && (
                <Box>
                  <Typography
                    component="h3"
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                    }}
                  >
                    חלקים שהוחלפו
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 1,
                    }}
                  >
                    {workOrder.replacedParts.map(
                      (part) => (
                        <Box
                          key={part.id}
                          sx={{
                            p: 1.5,
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
                              color:
                                "text.secondary",
                              fontSize: 13,
                            }}
                          >
                            כמות: {part.quantity}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}

          <Divider sx={{ my: 3 }} />

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
        </Box>
      )}
    </Drawer>
  );
}
