import { Alert, Box, Button } from "@mui/material";
import { useState } from "react";

import type { AppUser } from "../../data/users";
import {
  pauseWorkOrder,
  startWorkOrder,
} from "../../services/workOrderService";
import type { WorkOrder } from "../../types/workOrder";

type WorkOrderActionsProps = {
  workOrder: WorkOrder;
  currentUser: AppUser;
  onUpdated: (updatedWorkOrder: WorkOrder) => void;
  onRequestClose: () => void;
};

export default function WorkOrderActions({
  workOrder,
  currentUser,
  onUpdated,
  onRequestClose,
}: WorkOrderActionsProps) {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleStart() {
    try {
      const updatedWorkOrder = startWorkOrder(
        workOrder.id,
        currentUser.username
      );

      onUpdated({ ...updatedWorkOrder });
      setMessage("הטיפול התחיל בהצלחה.");
      setErrorMessage("");
    } catch (error) {
      setMessage("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "לא ניתן להתחיל טיפול."
      );
    }
  }

  function handlePause() {
    try {
      const updatedWorkOrder = pauseWorkOrder(workOrder.id);

      onUpdated({ ...updatedWorkOrder });
      setMessage("הקריאה הושהתה.");
      setErrorMessage("");
    } catch (error) {
      setMessage("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "לא ניתן להשהות את הקריאה."
      );
    }
  }

  if (workOrder.status === "closed") {
    return (
      <Alert severity="success">
        הקריאה סגורה ולא ניתן לבצע בה פעולות נוספות.
      </Alert>
    );
  }

  return (
    <Box>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          onClick={handleStart}
          disabled={Boolean(workOrder.takenAt)}
          sx={{
            minHeight: 48,
            fontWeight: 900,
          }}
        >
          {workOrder.takenAt
            ? "הטיפול כבר התחיל"
            : "התחל טיפול"}
        </Button>

        <Button
          variant="outlined"
          color="warning"
          onClick={handlePause}
          sx={{
            minHeight: 48,
            fontWeight: 900,
          }}
        >
          השהה
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={onRequestClose}
          sx={{
            minHeight: 48,
            fontWeight: 900,
          }}
        >
          סגור קריאה
        </Button>
      </Box>
    </Box>
  );
}
