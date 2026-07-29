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
import ManagementRiskPanel from "../components/dashboard/ManagementRiskPanel";

import {
  getDashboardSnapshot,
  type DashboardSnapshot,
} from "../services/dashboardService";

import {
  getManagementInsightsSnapshot,
  type ManagementInsightsSnapshot,
} from "../services/managementInsightsService";

import type {
  AssetStatus,
} from "../types/asset";

import {
  formatMinutes,
} from "../utils/workOrderMetrics";

function getPriorityLabel(
  priority: "high" | "medium" | "low",
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
  priority: "high" | "medium" | "low",
) {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#F59E0B";
}

function getAssetStatusLabel(
  status: AssetStatus,
) {
  if (status === "alarm") {
    return "מושבת";
  }

  if (status === "maintenance") {
    return "בטיפול אחזקה";
  }

  if (status === "warning") {
    return "קריאה פתוחה";
  }

  return "תקין";
}

function getAssetStatusColor(
  status: AssetStatus,
) {
  if (status === "alarm") {
    return "#DC2626";
  }

  if (status === "maintenance") {
    return "#2563EB";
  }

  if (status === "warning") {
    return "#F59E0B";
  }

  return "#16A34A";
}

function formatDateTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "he-IL",
    {
      dateStyle: "short",
      timeStyle: "medium",
    },
  ).format(
    new Date(value),
  );
}

export default function Dashboard() {
  const navigate =
    useNavigate();

  const [
    snapshot,
    setSnapshot,
  ] =
    useState<DashboardSnapshot>(
      getDashboardSnapshot(),
    );

  const [
    managementSnapshot,
    setManagementSnapshot,
  ] =
    useState<ManagementInsightsSnapshot>(
      getManagementInsightsSnapshot(),
    );

  function refreshDashboard() {
    setSnapshot(
      getDashboardSnapshot(),
    );

    setManagementSnapshot(
      getManagementInsightsSnapshot(),
    );
  }

  function openWorkOrder(
    workOrderId: string,
  ) {
    navigate(
      `/workorders/${encodeURIComponent(
        workOrderId,
      )}`,
    );
  }

  function openAsset(
    assetNumber: string,
  ) {
    navigate(
      `/machines/${encodeURIComponent(
        assetNumber,
      )}`,
    );
  }

  useEffect(() => {
    const refreshInterval =
      window.setInterval(
        () => {
          refreshDashboard();
        },
        10000,
      );

    return () => {
      window.clearInterval(
        refreshInterval,
      );
    };
  }, []);

  const assetsByDepartment =
    useMemo(() => {
      const grouped =
        new Map<
          string,
          DashboardSnapshot["assetStatuses"]
        >();

      snapshot.assetStatuses.forEach(
        (asset) => {
          const departmentAssets =
            grouped.get(
              asset.department,
            ) ?? [];

          departmentAssets.push(
            asset,
          );

          grouped.set(
            asset.department,
            departmentAssets,
          );
        },
      );

      return Array.from(
        grouped.entries(),
      );
    }, [
      snapshot.assetStatuses,
    ]);

  const stats = [
    {
      title:
        "קריאות פתוחות",

      value:
        String(
          snapshot.openWorkOrders,
        ),

      color:
        "#2563EB",

      icon: (
        <BuildIcon fontSize="large" />
      ),

      subtitle:
        "כל הקריאות שטרם נסגרו",
    },

    {
      title:
        "נכסים מושבתים",

      value:
        String(
          snapshot.downtimeAssets,
        ),

      color:
        "#DC2626",

      icon: (
        <WarningAmberIcon fontSize="large" />
      ),

      subtitle:
        "נכסים עם קריאה משביתה",
    },

    {
      title:
        "זמינות היום",

      value:
        `${snapshot.availabilityToday.toFixed(
          1,
        )}%`,

      color:
        "#16A34A",

      icon: (
        <TrendingUpIcon fontSize="large" />
      ),

      subtitle:
        `השבתה היום: ${formatMinutes(
          snapshot.downtimeMinutesToday,
        )}`,
    },

    {
      title:
        "נסגרו היום",

      value:
        String(
          snapshot.closedToday,
        ),

      color:
        "#16A34A",

      icon: (
        <CheckCircleIcon fontSize="large" />
      ),

      subtitle:
        "קריאות שנסגרו מאז חצות",
    },

    {
      title:
        "קריאות מושהות",

      value:
        String(
          snapshot.pausedWorkOrders,
        ),

      color:
        "#F59E0B",

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
              color:
                "text.secondary",
            }}
          >
            תמונת מצב אחזקה חיה ותובנות
            ניהוליות על בסיס נתוני המערכת
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                "text.secondary",

              fontSize: 12,

              mt: 0.5,
            }}
          >
            עדכון אחרון:{" "}
            {formatDateTime(
              snapshot.generatedAt,
            )}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshIcon />
          }
          onClick={
            refreshDashboard
          }
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

            sm:
              "repeat(2, minmax(0, 1fr))",

            lg:
              "repeat(5, minmax(0, 1fr))",
          },

          gap: 2,
          mb: 3,
        }}
      >
        {stats.map(
          (item) => (
            <KpiCard
              key={
                item.title
              }
              {...item}
            />
          ),
        )}
      </Box>

      <ManagementRiskPanel
        snapshot={
          managementSnapshot
        }
      />

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

            {snapshot
              .urgentOpenCalls
              .length === 0 ? (
              <Typography
                component="p"
                sx={{
                  color:
                    "text.secondary",

                  textAlign:
                    "center",

                  py: 4,
                }}
              >
                אין כרגע קריאות פתוחות.
              </Typography>
            ) : (
              <Box
                sx={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap: 1.5,
                }}
              >
                {snapshot
                  .urgentOpenCalls
                  .map(
                    (call) => {
                      const priorityColor =
                        getPriorityColor(
                          call.priority,
                        );

                      return (
                        <Box
                          key={
                            call.id
                          }
                          role="button"
                          tabIndex={
                            0
                          }
                          onClick={() =>
                            openWorkOrder(
                              call.id,
                            )
                          }
                          onKeyDown={(
                            event,
                          ) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              openWorkOrder(
                                call.id,
                              );
                            }
                          }}
                          sx={{
                            display:
                              "grid",

                            gridTemplateColumns:
                              {
                                xs:
                                  "1fr",

                                md:
                                  "1.2fr 2fr auto auto",
                              },

                            gap: 2,

                            alignItems:
                              "center",

                            p: 2,

                            borderRadius:
                              3,

                            bgcolor:
                              "#F8FAFC",

                            borderRight:
                              `6px solid ${priorityColor}`,

                            cursor:
                              "pointer",

                            transition:
                              "transform 0.15s ease, box-shadow 0.15s ease",

                            "&:hover":
                              {
                                bgcolor:
                                  "#EEF2F7",

                                transform:
                                  "translateY(-2px)",

                                boxShadow:
                                  "0 6px 16px rgba(15,23,42,0.10)",
                              },

                            "&:focus-visible":
                              {
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
                                fontWeight:
                                  900,
                              }}
                            >
                              {
                                call.assetNumber
                              }{" "}
                              -{" "}
                              {
                                call.assetName
                              }
                            </Typography>

                            <Typography
                              component="div"
                              sx={{
                                color:
                                  "text.secondary",

                                fontSize:
                                  12,
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
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              call.faultDescription
                            }
                          </Typography>

                          <Box
                            sx={{
                              display:
                                "flex",

                              gap: 1,

                              flexWrap:
                                "wrap",
                            }}
                          >
                            <Chip
                              label={getPriorityLabel(
                                call.priority,
                              )}
                              size="small"
                              sx={{
                                bgcolor:
                                  priorityColor,

                                color:
                                  "white",

                                fontWeight:
                                  900,
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
                              fontWeight:
                                900,

                              color:
                                priorityColor,

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatMinutes(
                              call.openMinutes,
                            )}
                          </Typography>
                        </Box>
                      );
                    },
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

            {snapshot
              .topDowntimeAssets
              .length === 0 ? (
              <Typography
                component="p"
                sx={{
                  color:
                    "text.secondary",

                  textAlign:
                    "center",

                  py: 4,
                }}
              >
                עדיין אין נתוני השבתה.
              </Typography>
            ) : (
              <Box
                sx={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap: 1.5,
                }}
              >
                {snapshot
                  .topDowntimeAssets
                  .map(
                    (
                      asset,
                      index,
                    ) => (
                      <Box
                        key={
                          asset.assetId
                        }
                        role="button"
                        tabIndex={
                          0
                        }
                        onClick={() =>
                          openAsset(
                            asset.assetNumber,
                          )
                        }
                        onKeyDown={(
                          event,
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            openAsset(
                              asset.assetNumber,
                            );
                          }
                        }}
                        sx={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          gap: 2,

                          bgcolor:
                            "#F8FAFC",

                          borderRadius:
                            3,

                          p: 1.5,

                          borderRight:
                            "6px solid #DC2626",

                          cursor:
                            "pointer",

                          "&:hover":
                            {
                              bgcolor:
                                "#EEF2F7",
                            },
                        }}
                      >
                        <Box>
                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {index +
                              1}
                            .{" "}
                            {
                              asset.assetNumber
                            }{" "}
                            -{" "}
                            {
                              asset.assetName
                            }
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              color:
                                "text.secondary",

                              fontSize:
                                12,
                            }}
                          >
                            {
                              asset.department
                            }
                          </Typography>
                        </Box>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,

                            color:
                              "#DC2626",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatMinutes(
                            asset.downtimeMinutes,
                          )}
                        </Typography>
                      </Box>
                    ),
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
            מצב הנכסים במפעל
          </Typography>

          <Box
            sx={{
              display:
                "grid",

              gap: 3,
            }}
          >
            {assetsByDepartment.map(
              ([
                department,
                departmentAssets,
              ]) => (
                <Box
                  key={
                    department
                  }
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight:
                        900,

                      mb: 1.5,
                    }}
                  >
                    {department}
                  </Typography>

                  <Box
                    sx={{
                      display:
                        "grid",

                      gridTemplateColumns:
                        {
                          xs:
                            "1fr",

                          sm:
                            "repeat(2, minmax(0, 1fr))",

                          lg:
                            "repeat(3, minmax(0, 1fr))",

                          xl:
                            "repeat(4, minmax(0, 1fr))",
                        },

                      gap: 1.5,
                    }}
                  >
                    {departmentAssets.map(
                      (asset) => {
                        const statusColor =
                          getAssetStatusColor(
                            asset.status,
                          );

                        return (
                          <Box
                            key={
                              asset.assetId
                            }
                            role="button"
                            tabIndex={
                              0
                            }
                            onClick={() =>
                              openAsset(
                                asset.assetNumber,
                              )
                            }
                            onKeyDown={(
                              event,
                            ) => {
                              if (
                                event.key ===
                                  "Enter" ||
                                event.key ===
                                  " "
                              ) {
                                openAsset(
                                  asset.assetNumber,
                                );
                              }
                            }}
                            sx={{
                              bgcolor:
                                "#0F172A",

                              color:
                                "white",

                              borderRadius:
                                3,

                              p: 2,

                              borderRight:
                                `8px solid ${statusColor}`,

                              cursor:
                                "pointer",

                              transition:
                                "transform 0.15s ease, box-shadow 0.15s ease",

                              "&:hover":
                                {
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
                                fontWeight:
                                  900,

                                mb: 0.5,
                              }}
                            >
                              {
                                asset.assetNumber
                              }{" "}
                              -{" "}
                              {
                                asset.assetName
                              }
                            </Typography>

                            <Typography
                              component="div"
                              sx={{
                                color:
                                  statusColor,

                                fontWeight:
                                  900,

                                fontSize:
                                  13,
                              }}
                            >
                              {getAssetStatusLabel(
                                asset.status,
                              )}
                            </Typography>

                            <Typography
                              component="div"
                              sx={{
                                color:
                                  "#CBD5E1",

                                fontSize:
                                  12,

                                mt: 0.5,
                              }}
                            >
                              קריאות פתוחות:{" "}
                              {
                                asset.openWorkOrders
                              }
                            </Typography>
                          </Box>
                        );
                      },
                    )}
                  </Box>
                </Box>
              ),
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}