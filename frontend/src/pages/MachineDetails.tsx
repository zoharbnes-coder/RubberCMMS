import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MachineHeader from "../components/machines/MachineHeader";
import MachineKpiPanel from "../components/machines/MachineKpiPanel";
import MachineMaintenancePanel from "../components/machines/MachineMaintenancePanel";
import MachineMiePanel from "../components/machines/MachineMiePanel";
import MachineTimeline from "../components/machines/MachineTimeline";
import MachineWorkOrdersPanel from "../components/machines/MachineWorkOrdersPanel";

import {
  assetToMachine,
} from "../types/machine";

import {
  getMieAssetSnapshot,
} from "../engine/mie/mieService";

import {
  getAssetDetailsSnapshot,
} from "../services/assetDetailsService";

import {
  getMachineMaintenanceSummary,
} from "../services/preventiveMaintenanceService";

import {
  getAssetTimelineSnapshot,
} from "../services/assetTimelineService";

export default function MachineDetails() {
  const {
    machineCode: routeAssetNumber,
  } = useParams<{
    machineCode: string;
  }>();

  const navigate =
    useNavigate();

  const assetNumber =
    routeAssetNumber
      ? decodeURIComponent(
          routeAssetNumber,
        )
      : "";

  /*
   * The route still uses the historical
   * "machineCode" parameter name for
   * compatibility with the existing UI.
   *
   * Internally, the value represents
   * the assetNumber.
   */
  const assetSnapshot =
    assetNumber
      ? getAssetDetailsSnapshot(
          assetNumber,
        )
      : null;

  if (!assetSnapshot) {
    return (
      <Box dir="rtl">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 900,

            mb: 1,
          }}
        >
          המכונה לא נמצאה
        </Typography>

        <Typography
          component="p"
          sx={{
            color:
              "text.secondary",

            mb: 2,
          }}
        >
          לא נמצאה מכונה עם מספר:{" "}
          {assetNumber || "-"}
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/machines",
            )
          }
          sx={{
            fontWeight: 900,
          }}
        >
          חזרה למרכז המכונות
        </Button>
      </Box>
    );
  }

  const {
    asset,

    openWorkOrders,

    closedWorkOrders,

    workOrderSummary,

    timeSummary,
  } = assetSnapshot;

  /*
   * Existing UI components still expect
   * Machine.
   *
   * Asset is now the source of truth.
   * This adapter keeps the current UI
   * fully compatible during migration.
   */
  const machine =
    assetToMachine(asset);

  const maintenanceSummary =
    getMachineMaintenanceSummary(
      asset.assetNumber,
    );

  const timelineSnapshot =
    getAssetTimelineSnapshot(
      asset.assetNumber,
    );

  const mieSnapshot =
    getMieAssetSnapshot(
      asset.assetNumber,
    );

  return (
    <Box dir="rtl">
      <MachineHeader
        machine={machine}
        onBack={() =>
          navigate(
            "/machines",
          )
        }
      />

      {mieSnapshot && (
        <MachineMiePanel
          snapshot={
            mieSnapshot
          }
        />
      )}

      <MachineMaintenancePanel
        summary={
          maintenanceSummary
        }
      />

      <MachineKpiPanel
        machine={machine}
        workOrderSummary={
          workOrderSummary
        }
        timeSummary={
          timeSummary
        }
      />

      <MachineWorkOrdersPanel
        openWorkOrders={
          openWorkOrders
        }
        closedWorkOrders={
          closedWorkOrders
        }
      />

      {timelineSnapshot && (
        <MachineTimeline
          snapshot={
            timelineSnapshot
          }
        />
      )}
    </Box>
  );
}