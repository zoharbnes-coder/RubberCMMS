import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import KpiCard from "../components/cards/KpiCard";
import {
  getDashboardSnapshot,
  type DashboardSnapshot,
  type MachineLiveStatus,
} from "../services/dashboardService";
import { formatMinutes } from "../utils/workOrderMetrics";

function getPriorityLabel(
  priority: "high" | "medium" | "low"
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
  priority: "high" | "medium" | "low"
) {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#F59E0B";
}

function getMachineStatusLabel(
  status: MachineLiveStatus
) {
  if (status === "alarm") {
    return "מושבתת";
  }

  if (status === "warning") {
    return "קריאה פתוחה";
  }

  return "תקינה";
}

function getMachineStatusColor(
  status: MachineLiveStatus
) {
  if (status === "alarm") {
    return "#DC2626";
  }

  if (status === "warning") {
    return "#F59E0B";
  }

  return "#16A34A";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [snapshot, setSnapshot] =
    useState<DashboardSnapshot>(
      getDashboardSnapshot()
    );

  function refreshDashboard() {
    setSnapshot(getDashboardSnapshot());
  }

  function openWorkOrder(
    workOrderId: string
  ) {
    navigate(
      `/workorders/${encodeURIComponent(
        workOrderId
      )}`
    );
  }

  function openMachine(
    assetNumber: string
  ) {
    navigate(
      `/machines/${encodeURIComponent(
        assetNumber
      )}`
    );
  }

  useEffect(() => {
    const refreshInterval =
      window.setInterval(() => {
        refreshDashboard();
      }, 10000);

    return () => {
      window.clearInterval(
        refreshInterval
      );
    };
  }, []);

  const machinesByDepartment =
    useMemo(() => {
      const grouped = new Map<
        string,
        DashboardSnapshot["machineStatuses"]
      >();

      snapshot.machineStatuses.forEach(
        (machine) => {
          const departmentMachines =
            grouped.get(
              machine.department
            ) ?? [];

          departmentMachines.push(
            machine
          );

          grouped.set(
            machine.department,
            departmentMachines
          );
        }
      );

      return Array.from(
        grouped.entries()
      );
    }, [snapshot.machineStatuses]);

  const stats = [
    {
      title: "קריאות פתוחות",
      value: String(
        snapshot.openWorkOrders
      ),
      color: "#2563EB",
      icon: (
        <BuildIcon fontSize="large" />
      ),
      subtitle:
        "כל הקריאות שטרם נסגרו",
    },
    {
      title: "מכונות מושבתות",
      value: String(
        snapshot.downtimeMachines
      ),
      color: "#DC2626",
      icon: (
        <WarningAmberIcon fontSize="large" />
      ),
      subtitle:
        "מכונות עם קריאה משביתה",
    },
    {
      title: "זמינות היום",
      value: `${snapshot.availabilityToday.toFixed(
        1
      )}%`,
      color: "#16A34A",
      icon: (
        <TrendingUpIcon fontSize="large" />
      ),
      subtitle: `השבתה היום: ${formatMinutes(
        snapshot.downtimeMinutesToday
      )}`,
    },
    {
      title: "נסגרו היום",
      value: String(
        snapshot.closedToday
      ),
      color: "#16A34A",
      icon: (
        <CheckCircleIcon fontSize="large" />
      ),
      subtitle:
        "קריאות שנסגרו מאז חצות",
    },
    {
      title: "קריאות מושהות",
      value: String(
        snapshot.pausedWorkOrders
      ),
      color: "#F59E0B",
      icon: (
        <PauseCircleIcon fontSize="large" />
      ),
      subtitle:
        "ממתינות להמשך טיפול",
    },
  ];

  return (
    <Box dir="rtl">
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
          gap: 2,
          mb: 3,
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
            Maintenance Control Center
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
            }}
          >
            תמונת מצב אחזקה חיה על
            בסיס קריאות המערכת
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              mt: 0.5,
            }}
          >
            עדכון אחרון:{" "}
            {formatDateTime(
              snapshot.generatedAt
            )}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshDashboard}
          sx={{
            minHeight: 46,
            fontWeight: 900,
          }}
        >
          רענן עכשיו
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((item) => (
          <KpiCard
            key={item.title}
            {...item}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "2fr 1fr",
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
              קריאות פתוחות ודחופות
            </Typography>

            {snapshot.urgentOpenCalls
              .length === 0 ? (
              <Typography
                component="p"
                sx={{
                  color:
                    "text.secondary",
                  textAlign: "center",
                  py: 4,
                }}
              >
                אין כרגע קריאות פתוחות.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 1.5,
                }}
              >
                {snapshot.urgentOpenCalls.map(
                  (call) => {
                    const priorityColor =
                      getPriorityColor(
                        call.priority
                      );

                    return (
                      <Box
                        key={call.id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          openWorkOrder(
                            call.id
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            openWorkOrder(
                              call.id
                            );
                          }
                        }}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1.2fr 2fr auto auto",
                          },
                          gap: 2,
                          alignItems:
                            "center",
                          p: 2,
                          borderRadius: 3,
                          bgcolor:
                            "#F8FAFC",
                          borderRight: `6px solid ${priorityColor}`,
                          cursor:
                            "pointer",
                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",
                          "&:hover": {
                            bgcolor:
                              "#EEF2F7",
                            transform:
                              "translateY(-2px)",
                            boxShadow:
                              "0 6px 16px rgba(15,23,42,0.10)",
                          },
                          "&:focus-visible": {
                            outline:
                              "3px solid #2563EB",
                            outlineOffset:
                              "2px",
                          },
                        }}
                      >
                        <Box>
                          <Typography
                            component="div"
                            sx={{
                              fontWeight: 900,
                            }}
                          >
                            {
                              call.machineDisplayNumber
                            }{" "}
                            - {call.machineName}
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              color:
                                "text.secondary",
                              fontSize: 12,
                            }}
                          >
                            {
                              call.workOrderNumber
                            }
                          </Typography>
                        </Box>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {
                            call.faultDescription
                          }
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Chip
                            label={getPriorityLabel(
                              call.priority
                            )}
                            size="small"
                            sx={{
                              bgcolor:
                                priorityColor,
                              color: "white",
                              fontWeight: 900,
                            }}
                          />

                          {call.isDowntime && (
                            <Chip
                              label="משביתה"
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                            color:
                              priorityColor,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatMinutes(
                            call.openMinutes
                          )}
                        </Typography>
                      </Box>
                    );
                  }
                )}
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
              TOP 5 זמן השבתה
            </Typography>

            {snapshot.topDowntimeMachines
              .length === 0 ? (
              <Typography
                component="p"
                sx={{
                  color:
                    "text.secondary",
                  textAlign: "center",
                  py: 4,
                }}
              >
                עדיין אין נתוני השבתה.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 1.5,
                }}
              >
                {snapshot.topDowntimeMachines.map(
                  (
                    machine,
                    index
                  ) => (
                    <Box
                      key={
                        machine.machineCode
                      }
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        openMachine(
                          machine.machineDisplayNumber
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key === " "
                        ) {
                          openMachine(
                            machine.machineDisplayNumber
                          );
                        }
                      }}
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 2,
                        bgcolor:
                          "#F8FAFC",
                        borderRadius: 3,
                        p: 1.5,
                        borderRight:
                          "6px solid #DC2626",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor:
                            "#EEF2F7",
                        },
                      }}
                    >
                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {index + 1}.{" "}
                          {
                            machine.machineDisplayNumber
                          }{" "}
                          -{" "}
                          {
                            machine.machineName
                          }
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 12,
                          }}
                        >
                          {
                            machine.department
                          }
                        </Typography>
                      </Box>

                      <Typography
                        component="div"
                        sx={{
                          fontWeight: 900,
                          color:
                            "#DC2626",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatMinutes(
                          machine.downtimeMinutes
                        )}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

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
              mb: 3,
            }}
          >
            מצב המכונות במפעל
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
            }}
          >
            {machinesByDepartment.map(
              ([
                department,
                departmentMachines,
              ]) => (
                <Box key={department}>
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                    }}
                  >
                    {department}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                        xl: "repeat(4, minmax(0, 1fr))",
                      },
                      gap: 1.5,
                    }}
                  >
                    {departmentMachines.map(
                      (machine) => {
                        const statusColor =
                          getMachineStatusColor(
                            machine.status
                          );

                        return (
                          <Box
                            key={
                              machine.machineCode
                            }
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              openMachine(
                                machine.machineDisplayNumber
                              )
                            }
                            onKeyDown={(event) => {
                              if (
                                event.key ===
                                  "Enter" ||
                                event.key === " "
                              ) {
                                openMachine(
                                  machine.machineDisplayNumber
                                );
                              }
                            }}
                            sx={{
                              bgcolor:
                                "#0F172A",
                              color: "white",
                              borderRadius: 3,
                              p: 2,
                              borderRight: `8px solid ${statusColor}`,
                              cursor:
                                "pointer",
                              transition:
                                "transform 0.15s ease, box-shadow 0.15s ease",
                              "&:hover": {
                                transform:
                                  "translateY(-2px)",
                                boxShadow:
                                  "0 8px 20px rgba(15,23,42,0.20)",
                              },
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                fontWeight: 900,
                                mb: 0.5,
                              }}
                            >
                              {
                                machine.machineDisplayNumber
                              }{" "}
                              -{" "}
                              {
                                machine.machineName
                              }
                            </Typography>

                            <Typography
                              component="div"
                              sx={{
                                color:
                                  statusColor,
                                fontWeight: 900,
                                fontSize: 13,
                              }}
                            >
                              {getMachineStatusLabel(
                                machine.status
                              )}
                            </Typography>

                            <Typography
                              component="div"
                              sx={{
                                color:
                                  "#CBD5E1",
                                fontSize: 12,
                                mt: 0.5,
                              }}
                            >
                              קריאות פתוחות:{" "}
                              {
                                machine.openWorkOrders
                              }
                            </Typography>
                          </Box>
                        );
                      }
                    )}
                  </Box>
                </Box>
              )
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}