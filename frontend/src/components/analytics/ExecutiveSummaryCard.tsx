import {
  Alert,
  Typography,
} from "@mui/material";

import type {
  AnalyticsExecutiveSummary,
} from "../../services/analyticsService";

type ExecutiveSummaryCardProps = {
  summary:
    AnalyticsExecutiveSummary;
};

function getSummaryColor(
  severity:
    AnalyticsExecutiveSummary[
      "severity"
    ],
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

function getAlertSeverity(
  severity:
    AnalyticsExecutiveSummary[
      "severity"
    ],
):
  | "error"
  | "warning"
  | "success"
  | "info" {
  if (
    severity ===
    "danger"
  ) {
    return "error";
  }

  if (
    severity ===
    "warning"
  ) {
    return "warning";
  }

  if (
    severity ===
    "positive"
  ) {
    return "success";
  }

  return "info";
}

export default function ExecutiveSummaryCard({
  summary,
}: ExecutiveSummaryCardProps) {
  const summaryColor =
    getSummaryColor(
      summary.severity,
    );

  return (
    <Alert
      severity={getAlertSeverity(
        summary.severity,
      )}
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
          summary.title
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
          summary.text
        }
      </Typography>
    </Alert>
  );
}