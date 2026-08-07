import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import type {
  PmComplianceSnapshot,
  PmStatusBreakdownItem,
} from "../../services/pmAnalyticsService";

type PmCompliancePanelProps = {
  snapshot:
    PmComplianceSnapshot;

  onOpenAsset:
    (
      assetNumber:
        string,
    ) => void;
};

function getComplianceColor(
  compliancePercent:
    number,
): string {
  if (
    compliancePercent <
    70
  ) {
    return "#DC2626";
  }

  if (
    compliancePercent <
    90
  ) {
    return "#D97706";
  }

  return "#16A34A";
}

function getStatusColor(
  status:
    PmStatusBreakdownItem[
      "status"
    ],
): string {
  if (
    status ===
    "completed_on_time"
  ) {
    return "#16A34A";
  }

  if (
    status ===
    "completed_late"
  ) {
    return "#F59E0B";
  }

  if (
    status ===
    "overdue"
  ) {
    return "#DC2626";
  }

  if (
    status ===
    "due"
  ) {
    return "#2563EB";
  }

  if (
    status ===
    "in_progress"
  ) {
    return "#7C3AED";
  }

  return "#64748B";
}

export default function PmCompliancePanel({
  snapshot,
  onOpenAsset,
}: PmCompliancePanelProps) {
  const complianceColor =
    getComplianceColor(
      snapshot.summary
        .compliancePercent,
    );

  return (
    <Box
      sx={{
        mb:
          3,
      }}
    >
      <Card
        sx={{
          borderRadius:
            5,

          mb:
            2,

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
                2,

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
                PM Compliance
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
                עמידה בביצוע טיפולים מונעים בזמן
              </Typography>
            </Box>

            <Chip
              label={`${snapshot.summary.compliancePercent.toFixed(
                1,
              )}%`}
              sx={{
                bgcolor:
                  complianceColor,

                color:
                  "white",

                fontWeight:
                  900,

                fontSize:
                  16,

                height:
                  40,
              }}
            />
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
                  "repeat(3, minmax(0, 1fr))",

                xl:
                  "repeat(6, minmax(0, 1fr))",
              },

              gap:
                1.5,
            }}
          >
            {snapshot.statusBreakdown.map(
              (item) => {
                const color =
                  getStatusColor(
                    item.status,
                  );

                return (
                  <Box
                    key={
                      item.status
                    }
                    sx={{
                      p:
                        1.75,

                      borderRadius:
                        3,

                      bgcolor:
                        "#F8FAFC",

                      borderTop:
                        `5px solid ${color}`,
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color:
                          "text.secondary",

                        fontSize:
                          12,

                        mb:
                          0.5,
                      }}
                    >
                      {
                        item.label
                      }
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color,

                        fontWeight:
                          900,

                        fontSize:
                          24,

                        lineHeight:
                          1.1,

                        mb:
                          0.25,
                      }}
                    >
                      {
                        item.count
                      }
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color:
                          "text.secondary",

                        fontSize:
                          11,
                      }}
                    >
                      {item.percent.toFixed(
                        1,
                      )}
                      % מכלל הביצועים
                    </Typography>
                  </Box>
                );
              },
            )}
          </Box>
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
            component="h3"
            variant="h6"
            sx={{
              fontWeight:
                900,

              mb:
                0.25,
            }}
          >
            TOP 10 נכסים עם עמידת PM הנמוכה ביותר
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                "text.secondary",

              fontSize:
                12,

              mb:
                2,
            }}
          >
            דירוג לפי אחוז ביצוע טיפולים בזמן
          </Typography>

          {snapshot
            .lowestComplianceAssets
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
              אין מספיק נתוני PM להצגת דירוג.
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
                .lowestComplianceAssets
                .map(
                  (
                    asset,
                    index,
                  ) => {
                    const color =
                      getComplianceColor(
                        asset.compliancePercent,
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
                          onOpenAsset(
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
                            onOpenAsset(
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
                                "56px 1.5fr 1fr 1fr 1fr 1fr",
                            },

                          gap:
                            1.5,

                          alignItems:
                            "center",

                          p:
                            1.5,

                          borderRadius:
                            3,

                          bgcolor:
                            "#F8FAFC",

                          borderRight:
                            `6px solid ${color}`,

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
                              18,

                            color,
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
                                11,
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
                            עמידה
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              color,

                              fontWeight:
                                900,
                            }}
                          >
                            {asset.compliancePercent.toFixed(
                              1,
                            )}
                            %
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
                            בזמן
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {
                              asset.completedOnTime
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
                            באיחור
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,
                            }}
                          >
                            {
                              asset.completedLate
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
                            פתוחים באיחור
                          </Typography>

                          <Typography
                            component="div"
                            sx={{
                              fontWeight:
                                900,

                              color:
                                asset.overdueExecutions >
                                0
                                  ? "#DC2626"
                                  : "text.primary",
                            }}
                          >
                            {
                              asset.overdueExecutions
                            }
                          </Typography>
                        </Box>
                      </Box>
                    );
                  },
                )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}