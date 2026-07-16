import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type { Machine } from "../../types/machine";
import type {
  MachineTimeSummary,
  MachineWorkOrderSummary,
} from "../../services/machineDetailsService";
import { formatMinutes } from "../../utils/workOrderMetrics";

type MachineKpiPanelProps = {
  machine: Machine;
  workOrderSummary: MachineWorkOrderSummary;
  timeSummary: MachineTimeSummary;
};

type MetricItem = {
  label: string;
  value: string;
  color: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
};

function formatHours(value: number): string {
  if (value <= 0) {
    return "-";
  }

  return `${value.toFixed(1)} ש׳`;
}

function getToneBackground(
  tone: MetricItem["tone"]
): string {
  if (tone === "success") {
    return "#F0FDF4";
  }

  if (tone === "warning") {
    return "#FFFBEB";
  }

  if (tone === "danger") {
    return "#FEF2F2";
  }

  if (tone === "info") {
    return "#EFF6FF";
  }

  return "#F8FAFC";
}

function getToneBorder(
  tone: MetricItem["tone"]
): string {
  if (tone === "success") {
    return "#BBF7D0";
  }

  if (tone === "warning") {
    return "#FDE68A";
  }

  if (tone === "danger") {
    return "#FECACA";
  }

  if (tone === "info") {
    return "#BFDBFE";
  }

  return "#E2E8F0";
}

function MetricCard({
  item,
}: {
  item: MetricItem;
}) {
  return (
    <Card
      sx={{
        minHeight: 84,
        borderRadius: 3,
        bgcolor: getToneBackground(
          item.tone
        ),
        borderColor: getToneBorder(
          item.tone
        ),
        boxShadow: "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          insetBlock: 0,
          insetInlineStart: 0,
          width: 4,
          bgcolor: item.color,
        }}
      />

      <CardContent
        sx={{
          p: 1.35,
          "&:last-child": {
            pb: 1.35,
          },
        }}
      >
        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 0.45,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.label}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: item.color,
            fontWeight: 900,
            fontSize: {
              xs: 20,
              md: 23,
            },
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {item.value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MachineKpiPanel({
  machine,
  workOrderSummary,
  timeSummary,
}: MachineKpiPanelProps) {
  const availabilityColor =
    machine.availability >= 95
      ? "#16A34A"
      : machine.availability >= 85
        ? "#D97706"
        : "#DC2626";

  const availabilityTone:
    | "success"
    | "warning"
    | "danger" =
    machine.availability >= 95
      ? "success"
      : machine.availability >= 85
        ? "warning"
        : "danger";

  const metrics: MetricItem[] = [
    {
      label: "זמינות",
      value: `${machine.availability.toFixed(
        1
      )}%`,
      color: availabilityColor,
      tone: availabilityTone,
    },
    {
      label: "MTTR",
      value: formatHours(
        machine.mttrHours
      ),
      color: "#7C3AED",
      tone: "neutral",
    },
    {
      label: "MTBF",
      value: formatHours(
        machine.mtbfHours
      ),
      color: "#2563EB",
      tone: "info",
    },
    {
      label: "קריאות פתוחות",
      value: String(
        workOrderSummary.openWorkOrders
      ),
      color:
        workOrderSummary.openWorkOrders > 0
          ? "#D97706"
          : "#16A34A",
      tone:
        workOrderSummary.openWorkOrders > 0
          ? "warning"
          : "success",
    },
    {
      label: "משביתות פתוחות",
      value: String(
        workOrderSummary.openDowntimeWorkOrders
      ),
      color:
        workOrderSummary
          .openDowntimeWorkOrders > 0
          ? "#DC2626"
          : "#16A34A",
      tone:
        workOrderSummary
          .openDowntimeWorkOrders > 0
          ? "danger"
          : "success",
    },
    {
      label: "סה״כ קריאות",
      value: String(
        workOrderSummary.totalWorkOrders
      ),
      color: "#334155",
      tone: "neutral",
    },
    {
      label: "זמן השבתה כולל",
      value: formatMinutes(
        timeSummary.totalDowntimeMinutes
      ),
      color:
        timeSummary.totalDowntimeMinutes > 0
          ? "#DC2626"
          : "#16A34A",
      tone:
        timeSummary.totalDowntimeMinutes > 0
          ? "danger"
          : "success",
    },
    {
      label: "זמן טיפול כולל",
      value: formatMinutes(
        timeSummary.totalRepairMinutes
      ),
      color: "#7C3AED",
      tone: "neutral",
    },
    {
      label: "זמן תגובה ממוצע",
      value:
        timeSummary.averageResponseMinutes >
        0
          ? formatMinutes(
              timeSummary.averageResponseMinutes
            )
          : "-",
      color:
        timeSummary.averageResponseMinutes >
        60
          ? "#D97706"
          : "#2563EB",
      tone:
        timeSummary.averageResponseMinutes >
        60
          ? "warning"
          : "info",
    },
    {
      label: "זמן תיקון ממוצע",
      value:
        timeSummary.averageRepairMinutes >
        0
          ? formatMinutes(
              timeSummary.averageRepairMinutes
            )
          : "-",
      color:
        timeSummary.averageRepairMinutes >
        120
          ? "#DC2626"
          : "#D97706",
      tone:
        timeSummary.averageRepairMinutes >
        120
          ? "danger"
          : "warning",
    },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 900,
            fontSize: 15,
          }}
        >
          מדדי אחזקה
        </Typography>

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 10.5,
          }}
        >
          נתונים מחושבים מהיסטוריית הקריאות
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {metrics.map((item) => (
          <MetricCard
            key={item.label}
            item={item}
          />
        ))}
      </Box>
    </Box>
  );
}