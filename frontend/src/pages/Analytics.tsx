import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAnalyticsExecutiveSnapshot,
  getDefaultAnalyticsFilters,
  type AnalyticsExecutiveKpi,
  type AnalyticsExecutiveSnapshot,
  type AnalyticsFilters,
  type AnalyticsPeriodPreset,
} from "../services/analyticsService";

import {
  formatMinutes,
} from "../utils/workOrderMetrics";

/* -------------------------------- */
/* Labels                           */
/* -------------------------------- */

function getPeriodLabel(
  period:
    AnalyticsPeriodPreset,
): string {
  if (
    period ===
    "last_7_days"
  ) {
    return "7 ימים אחרונים";
  }

  if (
    period ===
    "last_90_days"
  ) {
    return "90 ימים אחרונים";
  }

  if (
    period ===
    "current_year"
  ) {
    return "השנה הנוכחית";
  }

  if (
    period ===
    "custom"
  ) {
    return "טווח מותאם";
  }

  return "30 ימים אחרונים";
}

function getKpiColor(
  kpi:
    AnalyticsExecutiveKpi,
): string {
  if (
    kpi.id ===
    "open_work_orders"
  ) {
    return "#2563EB";
  }

  if (
    kpi.id ===
    "closed_work_orders"
  ) {
    return "#16A34A";
  }

  if (
    kpi.id ===
    "mttr"
  ) {
    return "#7C3AED";
  }

  if (
    kpi.id ===
    "mtbf"
  ) {
    return "#F59E0B";
  }

  if (
    kpi.id ===
    "availability"
  ) {
    return "#0891B2";
  }

  return "#DC2626";
}

function getSummaryColor(
  severity:
    AnalyticsExecutiveSnapshot[
      "executiveSummary"
    ]["severity"],
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
    "positive"
  ) {
    return "#16A34A";
  }

  return "#2563EB";
}

function formatDate(
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
    },
  ).format(
    date,
  );
}

/* -------------------------------- */
/* KPI Card                         */
/* -------------------------------- */

type ExecutiveKpiCardProps = {
  kpi:
    AnalyticsExecutiveKpi;
};

function ExecutiveKpiCard({
  kpi,
}: ExecutiveKpiCardProps) {
  const color =
    getKpiColor(
      kpi,
    );

  const trend =
    kpi.trend;

  return (
    <Card
      sx={{
        borderRadius:
          4,

        overflow:
          "hidden",

        boxShadow:
          "0 8px 24px rgba(15,23,42,0.08)",
      }}
    >
      <Box
        sx={{
          height:
            5,

          bgcolor:
            color,
        }}
      />

      <CardContent>
        <Typography
          component="div"
          sx={{
            color:
              "text.secondary",

            fontSize:
              13,

            mb:
              0.75,
          }}
        >
          {kpi.title}
        </Typography>

        <Typography
          component="div"
          sx={{
            color,

            fontWeight:
              900,

            fontSize:
              30,

            lineHeight:
              1.1,

            mb:
              1,
          }}
        >
          {
            kpi.displayValue
          }
        </Typography>

        <Typography
          component="div"
          sx={{
            color:
              "text.secondary",

            fontSize:
              12,

            minHeight:
              36,

            mb:
              1.25,
          }}
        >
          {kpi.subtitle}
        </Typography>

        {trend && (
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                0.75,

              color:
                trend.isPositive ===
                true
                  ? "#16A34A"
                  : trend.isPositive ===
                      false
                    ? "#DC2626"
                    : "#64748B",
            }}
          >
            {trend.direction ===
            "up" ? (
              <TrendingUpIcon
                fontSize="small"
              />
            ) : trend.direction ===
              "down" ? (
              <TrendingDownIcon
                fontSize="small"
              />
            ) : (
              <TrendingFlatIcon
                fontSize="small"
              />
            )}

            <Typography
              component="div"
              sx={{
                fontWeight:
                  900,

                fontSize:
                  12,
              }}
            >
              {trend.direction ===
              "stable"
                ? "ללא שינוי"
                : `${trend.displayValue} לעומת התקופה הקודמת`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------- */
/* Analytics Page                   */
/* -------------------------------- */

export default function Analytics() {
  const navigate =
    useNavigate();

  const [
    filters,
    setFilters,
  ] =
    useState<AnalyticsFilters>(
      getDefaultAnalyticsFilters(),
    );

  const [
    snapshot,
    setSnapshot,
  ] =
    useState<AnalyticsExecutiveSnapshot>(
      getAnalyticsExecutiveSnapshot(
        getDefaultAnalyticsFilters(),
      ),
    );

  const filteredAreas =
    useMemo(
      () =>
        snapshot.availableAreas.filter(
          (item) =>
            !filters.department ||
            item.department ===
              filters.department,
        ),
      [
        filters.department,
        snapshot.availableAreas,
      ],
    );

  const filteredAssets =
    useMemo(
      () =>
        snapshot.availableAssets.filter(
          (asset) => {
            if (
              filters.department &&
              asset.department !==
                filters.department
            ) {
              return false;
            }

            if (
              filters.area &&
              asset.area !==
                filters.area
            ) {
              return false;
            }

            return true;
          },
        ),
      [
        filters.area,
        filters.department,
        snapshot.availableAssets,
      ],
    );

  function applyFilters():
    void {
    setSnapshot(
      getAnalyticsExecutiveSnapshot(
        filters,
      ),
    );
  }

  function resetFilters():
    void {
    const defaultFilters =
      getDefaultAnalyticsFilters();

    setFilters(
      defaultFilters,
    );

    setSnapshot(
      getAnalyticsExecutiveSnapshot(
        defaultFilters,
      ),
    );
  }

  function updatePeriod(
    periodPreset:
      AnalyticsPeriodPreset,
  ): void {
    setFilters(
      (
        current,
      ) => ({
        ...current,

        periodPreset,

        startDate:
          periodPreset ===
          "custom"
            ? current.startDate
            : null,

        endDate:
          periodPreset ===
          "custom"
            ? current.endDate
            : null,
      }),
    );
  }

  function updateDepartment(
    department:
      string | null,
  ): void {
    setFilters(
      (
        current,
      ) => ({
        ...current,

        department,

        /*
         * Reset dependent filters when
         * the department changes.
         */
        area:
          null,

        assetId:
          null,
      }),
    );
  }

  function updateArea(
    area:
      string | null,
  ): void {
    setFilters(
      (
        current,
      ) => ({
        ...current,

        area,

        /*
         * Reset the selected Asset when
         * the Area / Group changes.
         */
        assetId:
          null,
      }),
    );
  }

  function openAsset(
    assetNumber:
      string,
  ): void {
    navigate(
      `/machines/${encodeURIComponent(
        assetNumber,
      )}`,
    );
  }

  const summaryColor =
    getSummaryColor(
      snapshot.executiveSummary
        .severity,
    );

  return (
    <Box dir="rtl">
      {/* Header */}

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
            Analytics
          </Typography>

          <Typography
            component="p"
            sx={{
              color:
                "text.secondary",
            }}
          >
            דוחות, מגמות וניתוחי ביצועים של מערך
            האחזקה
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
            תקופת הדוח:{" "}
            {formatDate(
              snapshot.periodStart,
            )}{" "}
            עד{" "}
            {formatDate(
              snapshot.periodEnd,
            )}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshIcon />
          }
          onClick={
            applyFilters
          }
          sx={{
            minHeight:
              46,

            fontWeight:
              900,
          }}
        >
          רענן נתונים
        </Button>
      </Box>

      {/* Global filters */}

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
            סינון הדוח
          </Typography>

          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "repeat(2, minmax(0, 1fr))",

                xl:
                  "repeat(6, minmax(0, 1fr))",
              },

              gap:
                2,

              alignItems:
                "end",
            }}
          >
            <TextField
              select
              fullWidth
              label="תקופה"
              value={
                filters.periodPreset
              }
              onChange={(
                event,
              ) =>
                updatePeriod(
                  event.target
                    .value as AnalyticsPeriodPreset,
                )
              }
            >
              {(
                [
                  "last_7_days",
                  "last_30_days",
                  "last_90_days",
                  "current_year",
                  "custom",
                ] as AnalyticsPeriodPreset[]
              ).map(
                (period) => (
                  <MenuItem
                    key={
                      period
                    }
                    value={
                      period
                    }
                  >
                    {getPeriodLabel(
                      period,
                    )}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              select
              fullWidth
              label="מחלקה"
              value={
                filters.department ??
                ""
              }
              onChange={(
                event,
              ) =>
                updateDepartment(
                  event.target.value ||
                    null,
                )
              }
            >
              <MenuItem value="">
                כל המחלקות
              </MenuItem>

              {snapshot.availableDepartments.map(
                (department) => (
                  <MenuItem
                    key={
                      department
                    }
                    value={
                      department
                    }
                  >
                    {department}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              select
              fullWidth
              label="קבוצה / אזור"
              value={
                filters.area ??
                ""
              }
              onChange={(
                event,
              ) =>
                updateArea(
                  event.target.value ||
                    null,
                )
              }
            >
              <MenuItem value="">
                כל הקבוצות והאזורים
              </MenuItem>

              {filteredAreas.map(
                (item) => (
                  <MenuItem
                    key={`${item.department}::${item.area}`}
                    value={
                      item.area
                    }
                  >
                    {
                      item.area
                    }
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              select
              fullWidth
              label="נכס"
              value={
                filters.assetId ??
                ""
              }
              onChange={(
                event,
              ) =>
                setFilters(
                  (
                    current,
                  ) => ({
                    ...current,

                    assetId:
                      event.target
                        .value ||
                      null,
                  }),
                )
              }
            >
              <MenuItem value="">
                כל הנכסים
              </MenuItem>

              {filteredAssets.map(
                (asset) => (
                  <MenuItem
                    key={
                      asset.assetId
                    }
                    value={
                      asset.assetId
                    }
                  >
                    {
                      asset.assetNumber
                    }{" "}
                    -{" "}
                    {
                      asset.assetName
                    }
                  </MenuItem>
                ),
              )}
            </TextField>

            <Button
              variant="contained"
              onClick={
                applyFilters
              }
              sx={{
                minHeight:
                  56,

                fontWeight:
                  900,
              }}
            >
              החל סינון
            </Button>

            <Button
              variant="outlined"
              onClick={
                resetFilters
              }
              sx={{
                minHeight:
                  56,

                fontWeight:
                  900,
              }}
            >
              נקה סינון
            </Button>
          </Box>

          {filters.periodPreset ===
            "custom" && (
            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "repeat(2, minmax(0, 260px))",
                },

                gap:
                  2,

                mt:
                  2,
              }}
            >
              <TextField
                fullWidth
                type="date"
                label="מתאריך"
                value={
                  filters.startDate ??
                  ""
                }
                onChange={(
                  event,
                ) =>
                  setFilters(
                    (
                      current,
                    ) => ({
                      ...current,

                      startDate:
                        event.target
                          .value ||
                        null,
                    }),
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink:
                      true,
                  },
                }}
              />

              <TextField
                fullWidth
                type="date"
                label="עד תאריך"
                value={
                  filters.endDate ??
                  ""
                }
                onChange={(
                  event,
                ) =>
                  setFilters(
                    (
                      current,
                    ) => ({
                      ...current,

                      endDate:
                        event.target
                          .value ||
                        null,
                    }),
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink:
                      true,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Executive summary */}

      <Alert
        severity={
          snapshot.executiveSummary
            .severity ===
          "danger"
            ? "error"
            : snapshot
                  .executiveSummary
                  .severity ===
                "warning"
              ? "warning"
              : snapshot
                    .executiveSummary
                    .severity ===
                  "positive"
                ? "success"
                : "info"
        }
        sx={{
          mb:
            3,

          borderRadius:
            4,

          borderRight:
            `8px solid ${summaryColor}`,

          alignItems:
            "flex-start",

          "& .MuiAlert-message":
            {
              width:
                "100%",
            },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight:
              900,

            fontSize:
              18,

            mb:
              0.5,
          }}
        >
          {
            snapshot.executiveSummary
              .title
          }
        </Typography>

        <Typography
          component="p"
          sx={{
            lineHeight:
              1.8,
          }}
        >
          {
            snapshot.executiveSummary
              .text
          }
        </Typography>
      </Alert>

      {/* KPI */}

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
              "repeat(3, minmax(0, 1fr))",

            xl:
              "repeat(6, minmax(0, 1fr))",
          },

          gap:
            2,

          mb:
            3,
        }}
      >
        {snapshot.kpis.map(
          (kpi) => (
            <ExecutiveKpiCard
              key={
                kpi.id
              }
              kpi={
                kpi
              }
            />
          ),
        )}
      </Box>

      {/* TOP downtime */}

      <Card
        sx={{
          borderRadius:
            5,

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
                1,

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
                TOP 10 נכסים לפי זמן השבתה
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
                דירוג נכסים בתקופה שנבחרה
              </Typography>
            </Box>

            <Chip
              label={getPeriodLabel(
                snapshot.filters
                  .periodPreset,
              )}
              variant="outlined"
              sx={{
                fontWeight:
                  900,
              }}
            />
          </Box>

          {snapshot
            .topDowntimeAssets
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
                  5,
              }}
            >
              לא נמצאו נתוני השבתה בתקופה שנבחרה.
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
                          "grid",

                        gridTemplateColumns:
                          {
                            xs:
                              "1fr",

                            md:
                              "60px 1.7fr 1fr 1fr 1fr 1fr",
                          },

                        gap:
                          1.5,

                        alignItems:
                          "center",

                        px:
                          2,

                        py:
                          1.75,

                        borderRadius:
                          3,

                        bgcolor:
                          "#F8FAFC",

                        borderRight:
                          "6px solid #DC2626",

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
                      <Typography
                        component="div"
                        sx={{
                          fontWeight:
                            900,

                          fontSize:
                            20,

                          color:
                            "#DC2626",
                        }}
                      >
                        #{index +
                          1}
                      </Typography>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,
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
                              "text.secondary",

                            fontSize:
                              12,
                          }}
                        >
                          {
                            asset.department
                          }
                          {asset.area
                            ? ` • ${asset.area}`
                            : ""}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",

                            fontSize:
                              11,
                          }}
                        >
                          זמן השבתה
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,

                            color:
                              "#DC2626",
                          }}
                        >
                          {formatMinutes(
                            Math.round(
                              asset.downtimeMinutes,
                            ),
                          )}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",

                            fontSize:
                              11,
                          }}
                        >
                          תקלות
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        >
                          {
                            asset.failureCount
                          }
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",

                            fontSize:
                              11,
                          }}
                        >
                          MTTR
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        >
                          {Math.round(
                            asset.mttrMinutes,
                          )}{" "}
                          דק׳
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",

                            fontSize:
                              11,
                          }}
                        >
                          זמינות
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight:
                              900,

                            color:
                              asset.availabilityPercent <
                              90
                                ? "#DC2626"
                                : asset.availabilityPercent <
                                    97
                                  ? "#D97706"
                                  : "#16A34A",
                          }}
                        >
                          {asset.availabilityPercent.toFixed(
                            1,
                          )}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  ),
                )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}