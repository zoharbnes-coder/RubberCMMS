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

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import KpiCard from "../components/cards/KpiCard";
import ManagementRiskPanel from "../components/dashboard/ManagementRiskPanel";

import {
  getDashboardActivitySnapshot,
  type DashboardActivity,
  type DashboardActivitySeverity,
  type DashboardActivitySnapshot,
} from "../services/dashboardActivityService";

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
  priority:
    | "high"
    | "medium"
    | "low",
): string {
  if (
    priority ===
    "high"
  ) {
    return "גבוהה";
  }

  if (
    priority ===
    "low"
  ) {
    return "נמוכה";
  }

  return "בינונית";
}

function getPriorityColor(
  priority:
    | "high"
    | "medium"
    | "low",
): string {
  if (
    priority ===
    "high"
  ) {
    return "#DC2626";
  }

  if (
    priority ===
    "low"
  ) {
    return "#16A34A";
  }

  return "#F59E0B";
}

function getAssetStatusLabel(
  status:
    AssetStatus,
): string {
  if (
    status ===
    "alarm"
  ) {
    return "מושבת";
  }

  if (
    status ===
    "maintenance"
  ) {
    return "בטיפול אחזקה";
  }

  if (
    status ===
    "warning"
  ) {
    return "קריאה פתוחה";
  }

  return "תקין";
}

function getAssetStatusColor(
  status:
    AssetStatus,
): string {
  if (
    status ===
    "alarm"
  ) {
    return "#DC2626";
  }

  if (
    status ===
    "maintenance"
  ) {
    return "#2563EB";
  }

  if (
    status ===
    "warning"
  ) {
    return "#F59E0B";
  }

  return "#16A34A";
}

function getActivitySeverityColor(
  severity:
    DashboardActivitySeverity,
): string {
  if (
    severity ===
    "danger"
  ) {
    return "#DC2626";
  }

  if (
    severity ===
    "warning"
  ) {
    return "#D97706";
  }

  if (
    severity ===
    "success"
  ) {
    return "#16A34A";
  }

  if (
    severity ===
    "neutral"
  ) {
    return "#64748B";
  }

  return "#2563EB";
}

function getActivityChipLabel(
  activity:
    DashboardActivity,
): string {
  if (
    activity.source ===
    "preventive_maintenance"
  ) {
    return "טיפול מונע";
  }

  if (
    activity.isDowntime
  ) {
    return "השבתה";
  }

  return "קריאת שירות";
}

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "he-IL",
    {
      dateStyle:
        "short",

      timeStyle:
        "medium",
    },
  ).format(
    date,
  );
}

function formatRelativeTime(
  value: string,
): string {
  const eventTime =
    new Date(
      value,
    ).getTime();

  if (
    Number.isNaN(
      eventTime,
    )
  ) {
    return "-";
  }

  const differenceMinutes =
    Math.max(
      0,
      Math.floor(
        (
          Date.now() -
          eventTime
        ) /
          60000,
      ),
    );

  if (
    differenceMinutes <
    1
  ) {
    return "עכשיו";
  }

  if (
    differenceMinutes <
    60
  ) {
    return `לפני ${differenceMinutes} דקות`;
  }

  const differenceHours =
    Math.floor(
      differenceMinutes /
        60,
    );

  if (
    differenceHours <
    24
  ) {
    if (
      differenceHours ===
      1
    ) {
      return "לפני שעה";
    }

    return `לפני ${differenceHours} שעות`;
  }

  const differenceDays =
    Math.floor(
      differenceHours /
        24,
    );

  if (
    differenceDays ===
    1
  ) {
    return "אתמול";
  }

  return `לפני ${differenceDays} ימים`;
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
    activitySnapshot,
    setActivitySnapshot,
  ] =
    useState<DashboardActivitySnapshot>(
      getDashboardActivitySnapshot(),
    );

  const [
    managementSnapshot,
    setManagementSnapshot,
  ] =
    useState<ManagementInsightsSnapshot>(
      getManagementInsightsSnapshot(),
    );

  function refreshDashboard():
    void {
    setSnapshot(
      getDashboardSnapshot(),
    );

    setActivitySnapshot(
      getDashboardActivitySnapshot(),
    );

    setManagementSnapshot(
      getManagementInsightsSnapshot(),
    );
  }

  function openWorkOrder(
    workOrderId: string,
  ): void {
    navigate(
      `/workorders/${encodeURIComponent(
        workOrderId,
      )}`,
    );
  }

  function openAsset(
    assetNumber: string,
  ): void {
    navigate(
      `/machines/${encodeURIComponent(
        assetNumber,
      )}`,
    );
  }

  function openActivity(
    activity:
      DashboardActivity,
  ): void {
    if (
      activity.target ===
      "work_order"
    ) {
      navigate(
        `/workorders/${encodeURIComponent(
          activity.targetId,
        )}`,
      );

      return;
    }

    if (
      activity.target ===
      "maintenance"
    ) {
      navigate(
        `/maintenance?assetId=${encodeURIComponent(
          activity.assetId,
        )}`,
      );

      return;
    }

    openAsset(
      activity.assetNumber,
    );
  }

  useEffect(() => {
    const refreshInterval =
      window.setInterval(
        refreshDashboard,
        10000,
      );

    return () => {
      window.clearInterval(
        refreshInterval,
      );
    };
  }, []);

  const assetsByDepartment =
    useMemo(
      () => {
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
      },
      [
        snapshot.assetStatuses,
      ],
    );

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
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          gap:
            2,

          mb:
            3,
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight:
                900,

              mb:
                0.5,
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
            תמונת מצב אחזקה חיה ותובנות ניהוליות
            על בסיס נתוני המערכת
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                "text.secondary",

              fontSize:
                12,

              mt:
                0.5,
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
            minHeight:
              46,

            fontWeight:
              900,
          }}
        >
          רענן עכשיו
        </Button>
      </Box>

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",

            lg:
              "repeat(5, minmax(0, 1fr))",
          },

          gap:
            2,

          mb:
            3,
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

      <Card
        sx={{
          borderRadius:
            5,

          mb:
            3,

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight:
                900,

              mb:
                2,
            }}
          >
            קריאות פתוחות ודחופות
          </Typography>

          {snapshot
            .urgentOpenCalls
            .length ===
          0 ? (
            <Typography
              component="p"
              sx={{
                color:
                  "text.secondary",

                textAlign:
                  "center",

                py:
                  4,
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

                gap:
                  1.5,
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

                          gap:
                            2,

                          alignItems:
                            "center",

                          p:
                            2,

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

                            gap:
                              1,

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

      <ManagementRiskPanel
        snapshot={
          managementSnapshot
        }
      />

      <Card
        sx={{
          borderRadius:
            5,

          mb:
            3,

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems: {
                xs:
                  "flex-start",

                sm:
                  "center",
              },

              flexDirection: {
                xs:
                  "column",

                sm:
                  "row",
              },

              gap:
                1.5,

              mb:
                2,
            }}
          >
            <Box>
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  fontWeight:
                    900,

                  mb:
                    0.25,
                }}
              >
                פעילות אחרונה במפעל
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
                קריאות שירות וטיפולים מונעים לפי
                סדר כרונולוגי
              </Typography>
            </Box>

            <Typography
              component="div"
              sx={{
                color:
                  "text.secondary",

                fontSize:
                  12,

                fontWeight:
                  700,
              }}
            >
              {activitySnapshot.totalActivities} אירועים
              במערכת
            </Typography>
          </Box>

          {activitySnapshot
            .activities
            .length ===
          0 ? (
            <Typography
              component="p"
              sx={{
                color:
                  "text.secondary",

                textAlign:
                  "center",

                py:
                  4,
              }}
            >
              עדיין אין פעילות להצגה.
            </Typography>
          ) : (
            <Box
              sx={{
                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  1.25,
              }}
            >
              {activitySnapshot
                .activities
                .map(
                  (activity) => {
                    const severityColor =
                      getActivitySeverityColor(
                        activity.severity,
                      );

                    return (
                      <Box
                        key={
                          activity.id
                        }
                        role="button"
                        tabIndex={
                          0
                        }
                        onClick={() =>
                          openActivity(
                            activity,
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
                            openActivity(
                              activity,
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
                                "auto 1.2fr 2fr auto",
                            },

                          gap:
                            1.5,

                          alignItems:
                            "center",

                          px:
                            1.75,

                          py:
                            1.5,

                          borderRadius:
                            3,

                          bgcolor:
                            "#F8FAFC",

                          borderRight:
                            `6px solid ${severityColor}`,

                          cursor:
                            "pointer",

                          transition:
                            "background-color 0.15s ease, transform 0.15s ease",

                          "&:hover":
                            {
                              bgcolor:
                                "#EEF2F7",

                              transform:
                                "translateY(-1px)",
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
                        <Chip
                          label={getActivityChipLabel(
                            activity,
                          )}
                          size="small"
                          sx={{
                            bgcolor:
                              severityColor,

                            color:
                              "white",

                            fontWeight:
                              900,

                            justifySelf: {
                              xs:
                                "flex-start",

                              md:
                                "stretch",
                            },
                          }}
                        />

                        <Box
                          sx={{
                            minWidth:
                              0,
                          }}
                        >
                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {
                              activity.title
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
                              activity.sourceNumber
                            }
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            minWidth:
                              0,
                          }}
                        >
                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                800,
                            }}
                          >
                            {
                              activity.assetNumber
                            }{" "}
                            -{" "}
                            {
                              activity.assetName
                            }
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              color:
                                "text.secondary",

                              fontSize:
                                12,

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              activity.description
                            }
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            textAlign: {
                              xs:
                                "right",

                              md:
                                "left",
                            },

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,

                              color:
                                severityColor,

                              fontSize:
                                12,
                            }}
                          >
                            {formatRelativeTime(
                              activity.occurredAt,
                            )}
                          </Typography>

                          {activity.responsibleName && (
                            <Typography
                              component="div"
                              sx={{
                                color:
                                  "text.secondary",

                                fontSize:
                                  11,
                              }}
                            >
                              {
                                activity.responsibleName
                              }
                            </Typography>
                          )}
                        </Box>
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
          borderRadius:
            5,

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight:
                900,

              mb:
                3,
            }}
          >
            מצב הנכסים במפעל
          </Typography>

          <Box
            sx={{
              display:
                "grid",

              gap:
                3,
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

                      mb:
                        1.5,
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

                      gap:
                        1.5,
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

                              p:
                                2,

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

                                mb:
                                  0.5,
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

                                mt:
                                  0.5,
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