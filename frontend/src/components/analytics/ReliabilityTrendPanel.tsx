import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import type {
  ReliabilityTrendGranularity,
  ReliabilityTrendPoint,
} from "../../services/reliabilityAnalyticsService";

type ReliabilityTrendPanelProps = {
  trend:
    ReliabilityTrendPoint[];

  granularity:
    ReliabilityTrendGranularity;
};

type MetricKey =
  | "availabilityPercent"
  | "downtimeMinutes"
  | "mttrMinutes"
  | "mtbfHours";

type MetricDefinition = {
  key:
    MetricKey;

  title:
    string;

  unit:
    string;

  color:
    string;

  format:
    (
      value:
        number,
    ) => string;
};

const METRICS:
  MetricDefinition[] = [
  {
    key:
      "availabilityPercent",

    title:
      "מגמת זמינות",

    unit:
      "%",

    color:
      "#0891B2",

    format:
      (value) =>
        `${value.toFixed(
          1,
        )}%`,
  },

  {
    key:
      "downtimeMinutes",

    title:
      "מגמת זמן השבתה",

    unit:
      "דק׳",

    color:
      "#DC2626",

    format:
      (value) =>
        `${Math.round(
          value,
        )} דק׳`,
  },

  {
    key:
      "mttrMinutes",

    title:
      "מגמת MTTR",

    unit:
      "דק׳",

    color:
      "#7C3AED",

    format:
      (value) =>
        `${Math.round(
          value,
        )} דק׳`,
  },

  {
    key:
      "mtbfHours",

    title:
      "מגמת MTBF",

    unit:
      "שעות",

    color:
      "#F59E0B",

    format:
      (value) =>
        `${Math.round(
          value *
            10,
        ) /
          10} שעות`,
  },
];

function getGranularityLabel(
  granularity:
    ReliabilityTrendGranularity,
): string {
  if (
    granularity ===
    "day"
  ) {
    return "תצוגה יומית";
  }

  if (
    granularity ===
    "week"
  ) {
    return "תצוגה שבועית";
  }

  return "תצוגה חודשית";
}

function getMetricValue(
  point:
    ReliabilityTrendPoint,
  metric:
    MetricKey,
): number {
  return point[
    metric
  ];
}

function getMaximumValue(
  trend:
    ReliabilityTrendPoint[],
  metric:
    MetricKey,
): number {
  const maximum =
    trend.reduce(
      (
        currentMaximum,
        point,
      ) =>
        Math.max(
          currentMaximum,
          getMetricValue(
            point,
            metric,
          ),
        ),
      0,
    );

  if (
    metric ===
    "availabilityPercent"
  ) {
    return 100;
  }

  return Math.max(
    1,
    maximum,
  );
}

function getAverageValue(
  trend:
    ReliabilityTrendPoint[],
  metric:
    MetricKey,
): number {
  if (
    trend.length ===
    0
  ) {
    return 0;
  }

  return (
    trend.reduce(
      (
        total,
        point,
      ) =>
        total +
        getMetricValue(
          point,
          metric,
        ),
      0,
    ) /
    trend.length
  );
}

function MetricTrendCard({
  trend,
  metric,
}: {
  trend:
    ReliabilityTrendPoint[];

  metric:
    MetricDefinition;
}) {
  const maximumValue =
    getMaximumValue(
      trend,
      metric.key,
    );

  const averageValue =
    getAverageValue(
      trend,
      metric.key,
    );

  const latestValue =
    trend.length >
    0
      ? getMetricValue(
          trend[
            trend.length -
              1
          ],
          metric.key,
        )
      : 0;

  return (
    <Card
      sx={{
        borderRadius:
          4,

        boxShadow:
          "0 8px 24px rgba(15,23,42,0.08)",

        overflow:
          "hidden",
      }}
    >
      <Box
        sx={{
          height:
            5,

          bgcolor:
            metric.color,
        }}
      />

      <CardContent>
        <Box
          sx={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "flex-start",

            gap:
              2,

            mb:
              2,
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                fontWeight:
                  900,

                mb:
                  0.25,
              }}
            >
              {
                metric.title
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
              ממוצע:{" "}
              {
                metric.format(
                  averageValue,
                )
              }
            </Typography>
          </Box>

          <Typography
            component="div"
            sx={{
              color:
                metric.color,

              fontWeight:
                900,

              fontSize:
                20,

              whiteSpace:
                "nowrap",
            }}
          >
            {
              metric.format(
                latestValue,
              )
            }
          </Typography>
        </Box>

        {trend.length ===
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
            אין נתונים להצגה.
          </Typography>
        ) : (
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "flex-end",

              gap:
                0.75,

              minHeight:
                190,

              overflowX:
                "auto",

              pb:
                1,
            }}
          >
            {trend.map(
              (point) => {
                const value =
                  getMetricValue(
                    point,
                    metric.key,
                  );

                const heightPercent =
                  maximumValue >
                  0
                    ? Math.max(
                        3,
                        (
                          value /
                          maximumValue
                        ) *
                          100,
                      )
                    : 3;

                return (
                  <Box
                    key={
                      point.key
                    }
                    sx={{
                      display:
                        "flex",

                      flexDirection:
                        "column",

                      alignItems:
                        "center",

                      justifyContent:
                        "flex-end",

                      minWidth:
                        34,

                      flex:
                        1,

                      height:
                        190,
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontSize:
                          10,

                        fontWeight:
                          800,

                        color:
                          "text.secondary",

                        mb:
                          0.5,

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        metric.format(
                          value,
                        )
                      }
                    </Typography>

                    <Box
                      title={`${point.label}: ${metric.format(
                        value,
                      )}`}
                      sx={{
                        width:
                          "100%",

                        maxWidth:
                          34,

                        height:
                          `${heightPercent}%`,

                        minHeight:
                          4,

                        bgcolor:
                          metric.color,

                        borderRadius:
                          "8px 8px 3px 3px",

                        opacity:
                          0.88,

                        transition:
                          "opacity 0.15s ease, transform 0.15s ease",

                        "&:hover":
                          {
                            opacity:
                              1,

                            transform:
                              "translateY(-2px)",
                          },
                      }}
                    />

                    <Typography
                      component="div"
                      sx={{
                        fontSize:
                          10,

                        color:
                          "text.secondary",

                        mt:
                          0.75,

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        point.label
                      }
                    </Typography>
                  </Box>
                );
              },
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReliabilityTrendPanel({
  trend,
  granularity,
}: ReliabilityTrendPanelProps) {
  return (
    <Box
      sx={{
        mb:
          3,
      }}
    >
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
            Reliability Analytics
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
            מגמות אמינות, זמינות והשבתה בתקופה שנבחרה
          </Typography>
        </Box>

        <Chip
          label={getGranularityLabel(
            granularity,
          )}
          variant="outlined"
          sx={{
            fontWeight:
              900,
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

            xl:
              "repeat(2, minmax(0, 1fr))",
          },

          gap:
            2,
        }}
      >
        {METRICS.map(
          (metric) => (
            <MetricTrendCard
              key={
                metric.key
              }
              trend={
                trend
              }
              metric={
                metric
              }
            />
          ),
        )}
      </Box>
    </Box>
  );
}