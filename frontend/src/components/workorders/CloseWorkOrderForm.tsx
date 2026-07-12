import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import type { AppUser } from "../../data/users";
import { closeWorkOrder } from "../../services/workOrderService";
import type {
  ReplacedPart,
  WorkOrder,
} from "../../types/workOrder";

type CloseWorkOrderFormProps = {
  workOrder: WorkOrder;
  currentUser: AppUser;
  onClosed: (updatedWorkOrder: WorkOrder) => void;
  onCancel: () => void;
};

export default function CloseWorkOrderForm({
  workOrder,
  currentUser,
  onClosed,
  onCancel,
}: CloseWorkOrderFormProps) {
  const [repairDescription, setRepairDescription] = useState("");
  const [hasReplacedParts, setHasReplacedParts] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");

  function handleClose() {
    setErrorMessage("");

    if (!repairDescription.trim()) {
      setErrorMessage("יש להזין תיאור טיפול.");
      return;
    }

    let replacedParts: ReplacedPart[] = [];

    if (hasReplacedParts) {
      const parsedQuantity = Number(quantity);

      if (!itemCode.trim()) {
        setErrorMessage("יש להזין מק״ט.");
        return;
      }

      if (!partDescription.trim()) {
        setErrorMessage("יש להזין תיאור חלק.");
        return;
      }

      if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        setErrorMessage("הכמות חייבת להיות גדולה מאפס.");
        return;
      }

      replacedParts = [
        {
          id: crypto.randomUUID(),
          itemCode: itemCode.trim(),
          description: partDescription.trim(),
          quantity: parsedQuantity,
        },
      ];
    }

    try {
      const updatedWorkOrder = closeWorkOrder({
        workOrderId: workOrder.id,
        username: currentUser.username,
        repairDescription: repairDescription.trim(),
        replacedParts,
      });

      onClosed({ ...updatedWorkOrder });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "לא ניתן לסגור את הקריאה."
      );
    }
  }

  return (
    <Box
      sx={{
        mt: 3,
        p: {
          xs: 2,
          md: 3,
        },
        borderRadius: 4,
        bgcolor: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    >
      <Typography
        component="h3"
        variant="h6"
        sx={{
          fontWeight: 900,
          mb: 2,
        }}
      >
        סגירת קריאה
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        multiline
        minRows={4}
        label="תיאור הטיפול שבוצע"
        placeholder="כתוב מה נמצא, מה תוקן ומה מצב המכונה לאחר הטיפול..."
        value={repairDescription}
        onChange={(event) => {
          setRepairDescription(event.target.value);
          setErrorMessage("");
        }}
        sx={{ mb: 3 }}
      />

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          mb: 1.5,
        }}
      >
        האם הוחלפו חלקים?
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Button
          variant={hasReplacedParts ? "contained" : "outlined"}
          onClick={() => setHasReplacedParts(true)}
          sx={{ fontWeight: 900 }}
        >
          כן
        </Button>

        <Button
          variant={!hasReplacedParts ? "contained" : "outlined"}
          onClick={() => {
            setHasReplacedParts(false);
            setItemCode("");
            setPartDescription("");
            setQuantity("1");
          }}
          sx={{ fontWeight: 900 }}
        >
          לא
        </Button>
      </Box>

      {hasReplacedParts && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 2fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            label="מק״ט"
            value={itemCode}
            onChange={(event) =>
              setItemCode(event.target.value)
            }
          />

          <TextField
            fullWidth
            label="תיאור החלק"
            value={partDescription}
            onChange={(event) =>
              setPartDescription(event.target.value)
            }
          />

          <TextField
            fullWidth
            label="כמות"
            type="number"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            slotProps={{
              htmlInput: {
                min: 1,
                step: 1,
              },
            }}
          />
        </Box>
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
          color="success"
          size="large"
          onClick={handleClose}
          sx={{
            minHeight: 50,
            fontWeight: 900,
          }}
        >
          אשר וסגור קריאה
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onCancel}
          sx={{
            minHeight: 50,
            fontWeight: 900,
          }}
        >
          ביטול
        </Button>
      </Box>
    </Box>
  );
}