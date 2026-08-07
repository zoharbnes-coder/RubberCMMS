import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import type {
  AnalyticsPeriodPreset,
  AnalyticsTopDowntimeAsset,
} from "../../services/analyticsService";

import {
  formatMinutes,
} from "../../utils/workOrderMetrics";

type TopDowntimeAssetsTableProps = {
  assets:
    AnalyticsTopDowntimeAsset[];

  periodPreset:
    AnalyticsPeriodPreset;

  onOpenAsset:
    (
      assetNumber:
        string,
    ) => void;
};

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

function getAvailabilityColor(
  availabilityPercent:
    number,
): string {
  if (
    availabilityPercent <
    90
  ) {
    return "#DC2626";
  }

  if (
    availabilityPercent <
    97
  ) {
    return "#D97706";
  }

  return "#16A34A";
}

export default function TopDowntimeAssetsTable({
  assets,
  periodPreset,
  onOpenAsset,
}: TopDowntimeAssetsTableProps) {
  return (
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
              periodPreset,
            )}
            variant="outlined"
            sx={{
              fontWeight:
                900,
            }}
          />
        </Box>

        {assets.length ===
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
            {assets.map(
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
                          getAvailabilityColor(
                            asset.availabilityPercent,
                          ),
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
  );
}