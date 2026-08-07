import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import type {
  AnalyticsAvailableArea,
  AnalyticsAvailableAsset,
  AnalyticsFilters,
  AnalyticsPeriodPreset,
} from "../../services/analyticsService";

type AnalyticsFiltersProps = {
  filters: AnalyticsFilters;
  availableDepartments: string[];
  availableAreas: AnalyticsAvailableArea[];
  availableAssets: AnalyticsAvailableAsset[];
  onChange: (filters: AnalyticsFilters) => void;
  onApply: () => void;
  onReset: () => void;
};

function getPeriodLabel(period: AnalyticsPeriodPreset): string {
  if (period === "last_7_days") return "7 ימים אחרונים";
  if (period === "last_90_days") return "90 ימים אחרונים";
  if (period === "current_year") return "השנה הנוכחית";
  if (period === "custom") return "טווח מותאם";
  return "30 ימים אחרונים";
}

export default function AnalyticsFilters({
  filters,
  availableDepartments,
  availableAreas,
  availableAssets,
  onChange,
  onApply,
  onReset,
}: AnalyticsFiltersProps) {
  const filteredAreas = availableAreas.filter(
    (item) =>
      !filters.department ||
      item.department === filters.department,
  );

  const filteredAssets = availableAssets.filter((asset) => {
    if (
      filters.department &&
      asset.department !== filters.department
    ) {
      return false;
    }

    if (
      filters.area &&
      asset.area !== filters.area
    ) {
      return false;
    }

    return true;
  });

  function updatePeriod(
    periodPreset: AnalyticsPeriodPreset,
  ): void {
    onChange({
      ...filters,
      periodPreset,
      startDate:
        periodPreset === "custom"
          ? filters.startDate
          : null,
      endDate:
        periodPreset === "custom"
          ? filters.endDate
          : null,
    });
  }

  function updateDepartment(
    department: string | null,
  ): void {
    onChange({
      ...filters,
      department,
      area: null,
      assetId: null,
    });
  }

  function updateArea(
    area: string | null,
  ): void {
    onChange({
      ...filters,
      area,
      assetId: null,
    });
  }

  return (
    <Card
      sx={{
        borderRadius: 5,
        mb: 3,
        boxShadow:
          "0 8px 24px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent>
        <Typography
          component="h2"
          variant="h6"
          sx={{ fontWeight: 900, mb: 2 }}
        >
          סינון הדוח
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(6, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "end",
          }}
        >
          <TextField
            select
            fullWidth
            label="תקופה"
            value={filters.periodPreset}
            onChange={(event) =>
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
            ).map((period) => (
              <MenuItem
                key={period}
                value={period}
              >
                {getPeriodLabel(period)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="מחלקה"
            value={filters.department ?? ""}
            onChange={(event) =>
              updateDepartment(
                event.target.value || null,
              )
            }
          >
            <MenuItem value="">
              כל המחלקות
            </MenuItem>

            {availableDepartments.map(
              (department) => (
                <MenuItem
                  key={department}
                  value={department}
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
            value={filters.area ?? ""}
            onChange={(event) =>
              updateArea(
                event.target.value || null,
              )
            }
          >
            <MenuItem value="">
              כל הקבוצות והאזורים
            </MenuItem>

            {filteredAreas.map((item) => (
              <MenuItem
                key={`${item.department}::${item.area}`}
                value={item.area}
              >
                {item.area}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="נכס"
            value={filters.assetId ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                assetId:
                  event.target.value || null,
              })
            }
          >
            <MenuItem value="">
              כל הנכסים
            </MenuItem>

            {filteredAssets.map((asset) => (
              <MenuItem
                key={asset.assetId}
                value={asset.assetId}
              >
                {asset.assetNumber} -{" "}
                {asset.assetName}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            onClick={onApply}
            sx={{
              minHeight: 56,
              fontWeight: 900,
            }}
          >
            החל סינון
          </Button>

          <Button
            variant="outlined"
            onClick={onReset}
            sx={{
              minHeight: 56,
              fontWeight: 900,
            }}
          >
            נקה סינון
          </Button>
        </Box>

        {filters.periodPreset === "custom" && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 260px))",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="מתאריך"
              value={filters.startDate ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  startDate:
                    event.target.value || null,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              fullWidth
              type="date"
              label="עד תאריך"
              value={filters.endDate ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  endDate:
                    event.target.value || null,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}