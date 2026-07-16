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
  getMachineDetailsSnapshot,
} from "../services/machineDetailsService";

import {
  getMachineMaintenanceSummary,
} from "../services/preventiveMaintenanceService";

import {
  getMachineTimelineSnapshot,
} from "../services/machineTimelineService";

export default function MachineDetails() {
  const {
    machineCode: routeAssetNumber,
  } = useParams<{
    machineCode: string;
  }>();

  const navigate = useNavigate();

  const assetNumber =
    routeAssetNumber
      ? decodeURIComponent(
          routeAssetNumber
        )
      : "";

  const machineSnapshot =
    assetNumber
      ? getMachineDetailsSnapshot(
          assetNumber
        )
      : null;

  if (!machineSnapshot) {
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
            color: "text.secondary",
            mb: 2,
          }}
        >
          לא נמצאה מכונה עם מספר:{" "}
          {assetNumber || "-"}
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate("/machines")
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
    machine,
    openWorkOrders,
    closedWorkOrders,
    workOrderSummary,
    timeSummary,
  } = machineSnapshot;

  const maintenanceSummary =
    getMachineMaintenanceSummary(
      machine.assetNumber
    );

  const timelineSnapshot =
    getMachineTimelineSnapshot(
      machine.assetNumber,
      machine.machineCode
    );

  const mieSnapshot =
    getMieAssetSnapshot(
      machine.assetNumber
    );

  return (
    <Box dir="rtl">
      <MachineHeader
        machine={machine}
        onBack={() =>
          navigate("/machines")
        }
      />

      {mieSnapshot && (
        <MachineMiePanel
          snapshot={mieSnapshot}
        />
      )}

      <MachineMaintenancePanel
        summary={maintenanceSummary}
      />

      <MachineKpiPanel
        machine={machine}
        workOrderSummary={
          workOrderSummary
        }
        timeSummary={timeSummary}
      />

      <MachineWorkOrdersPanel
        openWorkOrders={
          openWorkOrders
        }
        closedWorkOrders={
          closedWorkOrders
        }
      />

      <MachineTimeline
        snapshot={timelineSnapshot}
      />
    </Box>
  );
}