import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import AnalyticsKpiGrid from "../components/analytics/AnalyticsKpiGrid";
import ExecutiveSummaryCard from "../components/analytics/ExecutiveSummaryCard";
import TopDowntimeAssetsTable from "../components/analytics/TopDowntimeAssetsTable";
import ReliabilityTrendPanel from "../components/analytics/ReliabilityTrendPanel";
import FailureParetoPanel from "../components/analytics/FailureParetoPanel";
import RepeatedFailuresPanel from "../components/analytics/RepeatedFailuresPanel";

import {
  getAnalyticsExecutiveSnapshot,
  getDefaultAnalyticsFilters,
  type AnalyticsExecutiveSnapshot,
  type AnalyticsFilters as AnalyticsFiltersState,
} from "../services/analyticsService";

import {
  getReliabilityAnalyticsSnapshot,
  type ReliabilityAnalyticsSnapshot,
} from "../services/reliabilityAnalyticsService";

/* -------------------------------- */
/* Labels                           */
/* -------------------------------- */

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
/* Analytics Page                   */
/* -------------------------------- */

export default function Analytics() {
  const navigate =
    useNavigate();

  const [
    filters,
    setFilters,
  ] =
    useState<AnalyticsFiltersState>(
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

  const [
    reliabilitySnapshot,
    setReliabilitySnapshot,
  ] =
    useState<ReliabilityAnalyticsSnapshot>(
      getReliabilityAnalyticsSnapshot(
        getDefaultAnalyticsFilters(),
      ),
    );

  function applyFilters():
    void {
    setSnapshot(
      getAnalyticsExecutiveSnapshot(
        filters,
      ),
    );

    setReliabilitySnapshot(
      getReliabilityAnalyticsSnapshot(
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

    setReliabilitySnapshot(
      getReliabilityAnalyticsSnapshot(
        defaultFilters,
      ),
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

      <AnalyticsFilters
        filters={
          filters
        }
        availableDepartments={
          snapshot.availableDepartments
        }
        availableAreas={
          snapshot.availableAreas
        }
        availableAssets={
          snapshot.availableAssets
        }
        onChange={
          setFilters
        }
        onApply={
          applyFilters
        }
        onReset={
          resetFilters
        }
      />

      <ExecutiveSummaryCard
        summary={
          snapshot.executiveSummary
        }
      />

      <AnalyticsKpiGrid
        kpis={
          snapshot.kpis
        }
      />

      <ReliabilityTrendPanel
        trend={
          reliabilitySnapshot.trend
        }
        granularity={
          reliabilitySnapshot.granularity
        }
      />

      <FailureParetoPanel
        items={
          reliabilitySnapshot.pareto
        }
      />

      <RepeatedFailuresPanel
        items={
          reliabilitySnapshot.repeatedFailures
        }
        onOpenAsset={
          openAsset
        }
      />

      <TopDowntimeAssetsTable
        assets={
          snapshot.topDowntimeAssets
        }
        periodPreset={
          snapshot.filters.periodPreset
        }
        onOpenAsset={
          openAsset
        }
      />
    </Box>
  );
}