import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import type {
  AnalyticsExecutiveKpi,
} from "../../services/analyticsService";

type AnalyticsKpiGridProps = {
  kpis:
    AnalyticsExecutiveKpi[];
};

type ExecutiveKpiCardProps = {
  kpi:
    AnalyticsExecutiveKpi;
};

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
          {
            kpi.title
          }
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
          {
            kpi.subtitle
          }
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

export default function AnalyticsKpiGrid({
  kpis,
}: AnalyticsKpiGridProps) {
  return (
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
      {kpis.map(
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
  );
}