import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type {
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
} from "../../types/workOrder";

type MachineWorkOrdersPanelProps = {
  openWorkOrders: WorkOrder[];
  closedWorkOrders: WorkOrder[];
};

function getStatusLabel(
  status: WorkOrderStatus
): string {
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
): string {
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
): string {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#D97706";
}

function formatDate(
  value: string | null
): string {
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

function WorkOrderRow({
  workOrder,
  onOpen,
}: {
  workOrder: WorkOrder;
  onOpen: () => void;
}) {
  const priorityColor =
    getPriorityColor(workOrder.priority);

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
        px: 1.5,
        py: 1.25,
        borderRadius: 3,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRight: `5px solid ${priorityColor}`,
        cursor: "pointer",
        transition:
          "background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",

        "&:hover": {
          bgcolor: "#F1F5F9",
          boxShadow:
            "0 5px 14px rgba(15,23,42,0.07)",
          transform: "translateY(-1px)",
        },

        "&:focus-visible": {
          outline: "3px solid #2563EB",
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "150px minmax(0,1fr) auto",
          },
          gap: 1.25,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 12.5,
              mb: 0.2,
            }}
          >
            {workOrder.workOrderNumber}
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 10.5,
            }}
          >
            {formatDate(workOrder.openedAt)}
          </Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: 12.5,
              lineHeight: 1.45,
              overflowWrap: "anywhere",
            }}
          >
            {workOrder.faultDescription}
          </Typography>

          {workOrder.status === "closed" &&
            workOrder.repairDescription && (
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 10.75,
                  mt: 0.35,
                  lineHeight: 1.45,
                }}
              >
                טיפול:{" "}
                {workOrder.repairDescription}
              </Typography>
            )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.6,
            justifyContent: {
              xs: "flex-start",
              md: "flex-end",
            },
          }}
        >
          <Chip
            label={getStatusLabel(
              workOrder.status
            )}
            color={getStatusColor(
              workOrder.status
            )}
            size="small"
          />

          <Chip
            label={getPriorityLabel(
              workOrder.priority
            )}
            size="small"
            sx={{
              bgcolor: priorityColor,
              color: "white",
              fontWeight: 900,
            }}
          />

          {workOrder.isDowntime && (
            <Chip
              label="משביתה"
              color="error"
              size="small"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function MachineWorkOrdersPanel({
  openWorkOrders,
  closedWorkOrders,
}: MachineWorkOrdersPanelProps) {
  const navigate = useNavigate();

  function openWorkOrder(
    workOrder: WorkOrder
  ) {
    navigate(
      `/workorders/${encodeURIComponent(
        workOrder.id
      )}`
    );
  }

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
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "repeat(2, minmax(0,1fr))",
            },
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: 15,
                    mb: 0.15,
                  }}
                >
                  קריאות פתוחות
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 10.5,
                  }}
                >
                  קריאות הדורשות טיפול או המשך מעקב
                </Typography>
              </Box>

              <Chip
                label={openWorkOrders.length}
                size="small"
                color={
                  openWorkOrders.length > 0
                    ? "warning"
                    : "success"
                }
              />
            </Box>

            {openWorkOrders.length === 0 ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 2,
                  borderRadius: 3,
                  bgcolor: "#F0FDF4",
                  border:
                    "1px solid #BBF7D0",
                  textAlign: "center",
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
                  אין קריאות פתוחות
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 0.8,
                  maxHeight: 390,
                  overflowY: "auto",
                  pl: 0.5,
                }}
              >
                {openWorkOrders.map(
                  (workOrder) => (
                    <WorkOrderRow
                      key={workOrder.id}
                      workOrder={workOrder}
                      onOpen={() =>
                        openWorkOrder(
                          workOrder
                        )
                      }
                    />
                  )
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: 15,
                    mb: 0.15,
                  }}
                >
                  היסטוריית טיפולים
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 10.5,
                  }}
                >
                  עשר הקריאות הסגורות האחרונות
                </Typography>
              </Box>

              <Chip
                label={closedWorkOrders.length}
                size="small"
                variant="outlined"
              />
            </Box>

            {closedWorkOrders.length === 0 ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 2,
                  borderRadius: 3,
                  bgcolor: "#F8FAFC",
                  border:
                    "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  עדיין אין קריאות סגורות
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 0.8,
                  maxHeight: 390,
                  overflowY: "auto",
                  pl: 0.5,
                }}
              >
                {closedWorkOrders
                  .slice(0, 10)
                  .map((workOrder) => (
                    <WorkOrderRow
                      key={workOrder.id}
                      workOrder={workOrder}
                      onOpen={() =>
                        openWorkOrder(
                          workOrder
                        )
                      }
                    />
                  ))}
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ mt: 1.5 }} />
      </CardContent>
    </Card>
  );
}