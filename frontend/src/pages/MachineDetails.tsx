import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMachineDetailsSnapshot,
} from "../services/machineDetailsService";
import type {
  MachineCriticality,
  MachineStatus,
} from "../types/machine";
import type {
  WorkOrderPriority,
  WorkOrderStatus,
} from "../types/workOrder";
import { formatMinutes } from "../utils/workOrderMetrics";

function getMachineStatusLabel(status: MachineStatus) {
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

function getCriticalityLabel(
  criticality: MachineCriticality
) {
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

function getWorkOrderStatusLabel(
  status: WorkOrderStatus
) {
  if (status === "paused") {
    return "מושהה";
  }

  if (status === "closed") {
    return "סגור";
  }

  return "פתוח";
}

function getWorkOrderStatusColor(
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

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatHours(value: number) {
  if (value <= 0) {
    return "-";
  }

  return `${value.toFixed(1)} ש׳`;
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
        boxShadow: "0 6px 18px rgba(15,23,42,0.07)",
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
            fontSize: 24,
            color,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MachineDetails() {
  const { machineCode: assetNumber } = useParams<{
    machineCode: string;
  }>();

  const navigate = useNavigate();

  const snapshot = assetNumber
    ? getMachineDetailsSnapshot(
        decodeURIComponent(assetNumber)
      )
    : null;

  if (!snapshot) {
    return (
      <Box dir="rtl">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 900,
            mb: 2,
          }}
        >
          המכונה לא נמצאה
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            mb: 3,
          }}
        >
          לא נמצאה מכונה עם מספר: {assetNumber ?? "-"}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/machines")}
          sx={{
            fontWeight: 900,
          }}
        >
          חזרה למרכז המכונות
        </Button>
      </Box>
    );
  }

  const {
    machine,
    openWorkOrders,
    closedWorkOrders,
    workOrderSummary,
    timeSummary,
    lastWorkOrder,
    lastClosedWorkOrder,
  } = snapshot;

  return (
    <Box dir="rtl">
      <Button
        variant="outlined"
        onClick={() => navigate("/machines")}
        sx={{
          mb: 2,
          fontWeight: 900,
        }}
      >
        חזרה למרכז המכונות
      </Button>

      <Card
        sx={{
          borderRadius: 5,
          mb: 3,
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
                {machine.assetNumber} -{" "}
                {machine.displayName}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                {machine.department}
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                מספר מכונה: {machine.assetNumber}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={getMachineStatusLabel(
                  machine.status
                )}
                color={getMachineStatusColor(
                  machine.status
                )}
                sx={{
                  fontWeight: 900,
                }}
              />

              <Chip
                label={`קריטיות: ${getCriticalityLabel(
                  machine.criticality
                )}`}
                variant="outlined"
                sx={{
                  fontWeight: 900,
                }}
              />
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
            xl: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label="זמינות"
          value={`${machine.availability.toFixed(1)}%`}
          color="#16A34A"
        />

        <MetricCard
          label="MTTR"
          value={formatHours(machine.mttrHours)}
          color="#7C3AED"
        />

        <MetricCard
          label="MTBF"
          value={formatHours(machine.mtbfHours)}
          color="#2563EB"
        />

        <MetricCard
          label="קריאות פתוחות"
          value={String(
            workOrderSummary.openWorkOrders
          )}
          color="#2563EB"
        />

        <MetricCard
          label="קריאות משביתות פתוחות"
          value={String(
            workOrderSummary.openDowntimeWorkOrders
          )}
          color="#DC2626"
        />

        <MetricCard
          label="סה״כ קריאות"
          value={String(
            workOrderSummary.totalWorkOrders
          )}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label="זמן השבתה כולל"
          value={formatMinutes(
            timeSummary.totalDowntimeMinutes
          )}
          color="#DC2626"
        />

        <MetricCard
          label="זמן טיפול כולל"
          value={formatMinutes(
            timeSummary.totalRepairMinutes
          )}
          color="#7C3AED"
        />

        <MetricCard
          label="זמן תגובה ממוצע"
          value={
            timeSummary.averageResponseMinutes > 0
              ? formatMinutes(
                  timeSummary.averageResponseMinutes
                )
              : "-"
          }
          color="#2563EB"
        />

        <MetricCard
          label="זמן תיקון ממוצע"
          value={
            timeSummary.averageRepairMinutes > 0
              ? formatMinutes(
                  timeSummary.averageRepairMinutes
                )
              : "-"
          }
          color="#F59E0B"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
          mb: 3,
        }}
      >
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
              הקריאה האחרונה
            </Typography>

            {!lastWorkOrder ? (
              <Typography
                component="p"
                sx={{
                  color: "text.secondary",
                }}
              >
                עדיין לא נפתחו קריאות למכונה זו.
              </Typography>
            ) : (
              <Box>
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    mb: 0.5,
                  }}
                >
                  {lastWorkOrder.workOrderNumber}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 13,
                    mb: 1.5,
                  }}
                >
                  {formatDate(lastWorkOrder.openedAt)}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  {lastWorkOrder.faultDescription}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={getWorkOrderStatusLabel(
                      lastWorkOrder.status
                    )}
                    color={getWorkOrderStatusColor(
                      lastWorkOrder.status
                    )}
                    size="small"
                  />

                  <Chip
                    label={getPriorityLabel(
                      lastWorkOrder.priority
                    )}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(
                        lastWorkOrder.priority
                      ),
                      color: "white",
                      fontWeight: 900,
                    }}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

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
              הטיפול האחרון שנסגר
            </Typography>

            {!lastClosedWorkOrder ? (
              <Typography
                component="p"
                sx={{
                  color: "text.secondary",
                }}
              >
                עדיין אין טיפולים סגורים למכונה זו.
              </Typography>
            ) : (
              <Box>
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 900,
                    mb: 0.5,
                  }}
                >
                  {lastClosedWorkOrder.workOrderNumber}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    color: "text.secondary",
                    fontSize: 13,
                    mb: 1.5,
                  }}
                >
                  נסגרה:{" "}
                  {formatDate(
                    lastClosedWorkOrder.closedAt
                  )}
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {lastClosedWorkOrder.repairDescription ||
                    "לא הוזן תיאור טיפול"}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
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
            קריאות פתוחות
          </Typography>

          {openWorkOrders.length === 0 ? (
            <Typography
              component="p"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                py: 4,
              }}
            >
              אין קריאות פתוחות למכונה זו.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
              }}
            >
              {openWorkOrders.map((workOrder) => {
                const priorityColor =
                  getPriorityColor(
                    workOrder.priority
                  );

                return (
                  <Box
                    key={workOrder.id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate(
                        `/workorders/${encodeURIComponent(
                          workOrder.id
                        )}`
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        navigate(
                          `/workorders/${encodeURIComponent(
                            workOrder.id
                          )}`
                        );
                      }
                    }}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#F8FAFC",
                      border:
                        "1px solid #E2E8F0",
                      borderRight: `6px solid ${priorityColor}`,
                      cursor: "pointer",
                      transition:
                        "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        bgcolor: "#EEF2F7",
                        transform: "translateY(-2px)",
                        boxShadow:
                          "0 6px 16px rgba(15,23,42,0.10)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {workOrder.workOrderNumber}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 13,
                          }}
                        >
                          {formatDate(
                            workOrder.openedAt
                          )}
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
                          label={getWorkOrderStatusLabel(
                            workOrder.status
                          )}
                          color={getWorkOrderStatusColor(
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

                    <Typography
                      component="div"
                      sx={{
                        mt: 1.5,
                        fontWeight: 700,
                      }}
                    >
                      {workOrder.faultDescription}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

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
            היסטוריית תקלות אחרונות
          </Typography>

          {closedWorkOrders.length === 0 ? (
            <Typography
              component="p"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                py: 4,
              }}
            >
              עדיין אין היסטוריית תקלות סגורות.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
              }}
            >
              {closedWorkOrders
                .slice(0, 10)
                .map((workOrder) => (
                  <Box
                    key={workOrder.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#F8FAFC",
                      border:
                        "1px solid #E2E8F0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {workOrder.workOrderNumber}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 13,
                          }}
                        >
                          {formatDate(
                            workOrder.openedAt
                          )}
                        </Typography>
                      </Box>

                      <Chip
                        label="סגור"
                        color="success"
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      component="div"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      תקלה:{" "}
                      {workOrder.faultDescription}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      טיפול:{" "}
                      {workOrder.repairDescription ||
                        "-"}
                    </Typography>
                  </Box>
                ))}
            </Box>
          )}
        </CardContent>
      </Card>

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
            מודולים למכונה
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
            {[
              "תחזוקה מונעת",
              "חלקי חילוף",
              "מסמכים ושרטוטים",
              "תמונות",
            ].map((item) => (
              <Button
                key={item}
                variant="outlined"
                disabled
                sx={{
                  minHeight: 70,
                  fontWeight: 900,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}