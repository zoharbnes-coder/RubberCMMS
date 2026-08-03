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
  getMieAssetSnapshot,
} from "../engine/mie/mieService";

import {
  getAssetDetailsSnapshot,
} from "../services/assetDetailsService";

import {
  getAssetMaintenanceSummary,
} from "../services/preventiveMaintenanceService";

import {
  getAssetTimelineSnapshot,
} from "../services/assetTimelineService";

import {
  assetToMachine,
} from "../types/machine";

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
          הנכס לא נמצא
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            mb: 2,
          }}
        >
          לא נמצא נכס עם מספר:{" "}
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
          חזרה למרכז הנכסים
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
   * רכיבי התצוגה הקיימים עדיין מקבלים
   * את טיפוס Machine.
   *
   * מקור הנתונים בפועל הוא Asset.
   * שכבת התצוגה תוסב בהמשך בנפרד.
   */
  const assetDisplayModel =
    assetToMachine(
      asset,
    );

  /*
   * Preventive Maintenance is linked
   * through the immutable Asset ID.
   */
  const maintenanceSummary =
    getAssetMaintenanceSummary(
      asset.id,
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
        machine={
          assetDisplayModel
        }
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

      {maintenanceSummary && (
        <MachineMaintenancePanel
          summary={
            maintenanceSummary
          }
        />
      )}

      <MachineKpiPanel
        machine={
          assetDisplayModel
        }
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