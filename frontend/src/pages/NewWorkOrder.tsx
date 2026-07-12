import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { machines } from "../data/machines";
import type { AppUser } from "../data/users";
import {
  createWorkOrder,
  getWorkOrders,
} from "../services/workOrderService";
import type {
  WorkOrderPriority,
  WorkOrderType,
} from "../types/workOrder";

type NewWorkOrderProps = {
  currentUser: AppUser;
};

const workOrderTypes: {
  value: WorkOrderType;
  label: string;
}[] = [
  { value: "fault", label: "תקלה" },
  { value: "preventive", label: "טיפול מונע" },
  { value: "safety", label: "בטיחות" },
  { value: "improvement", label: "שיפור" },
];

const priorityOptions: {
  value: WorkOrderPriority;
  label: string;
  color: string;
}[] = [
  { value: "high", label: "גבוהה", color: "#DC2626" },
  { value: "medium", label: "בינונית", color: "#F59E0B" },
  { value: "low", label: "נמוכה", color: "#16A34A" },
];

export default function NewWorkOrder({
  currentUser,
}: NewWorkOrderProps) {
  const [department, setDepartment] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [type, setType] = useState<WorkOrderType>("fault");
  const [isDowntime, setIsDowntime] = useState(false);
  const [priority, setPriority] =
    useState<WorkOrderPriority>("medium");
  const [faultDescription, setFaultDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          machines
            .filter((machine) => machine.active)
            .map((machine) => machine.department)
        )
      ).sort(),
    []
  );

  const departmentMachines = useMemo(
    () =>
      machines
        .filter(
          (machine) =>
            machine.active &&
            machine.department === department
        )
        .sort((a, b) =>
          a.displayNumber.localeCompare(
            b.displayNumber,
            undefined,
            { numeric: true }
          )
        ),
    [department]
  );

  const selectedMachine = machines.find(
    (machine) => machine.code === machineCode
  );

  function chooseDowntime(value: boolean) {
    setIsDowntime(value);

    if (value) {
      setPriority("high");
    } else if (priority === "high") {
      setPriority("medium");
    }
  }

  function resetForm() {
    setDepartment("");
    setMachineCode("");
    setType("fault");
    setIsDowntime(false);
    setPriority("medium");
    setFaultDescription("");
  }

  function handleSubmit() {
    setSuccessMessage("");
    setErrorMessage("");

    if (!department) {
      setErrorMessage("יש לבחור מחלקה.");
      return;
    }

    if (!selectedMachine) {
      setErrorMessage("יש לבחור מכונה.");
      return;
    }

    if (!faultDescription.trim()) {
      setErrorMessage("יש להזין תיאור תקלה.");
      return;
    }

    const existingOpenCall = getWorkOrders().some(
      (workOrder) =>
        workOrder.machineCode === selectedMachine.code &&
        workOrder.status !== "closed"
    );

    if (existingOpenCall) {
      const shouldContinue = window.confirm(
        "קיימת כבר תקלה פתוחה על מכונה זו.\n\nהאם זו תקלה נוספת וברצונך להמשיך?"
      );

      if (!shouldContinue) {
        return;
      }
    }

    const created = createWorkOrder({
      machineCode: selectedMachine.code,
      machineDisplayNumber:
        selectedMachine.displayNumber,
      machineName: selectedMachine.name,
      department: selectedMachine.department,
      type,
      priority,
      isDowntime,
      faultDescription: faultDescription.trim(),
      openedBy: currentUser.username,
    });

    setSuccessMessage(
      `הקריאה נפתחה בהצלחה. מספר דוח: ${created.workOrderNumber}`
    );

    resetForm();
  }

  return (
    <Box
      dir="rtl"
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{
          fontWeight: 900,
          mb: 1,
        }}
      >
        פתיחת תקלה חדשה
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          mb: 3,
        }}
      >
        בחר מחלקה, מכונה ותאר בקצרה את התקלה.
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: 5,
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.10)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 2,
            }}
          >
            1. בחירת מחלקה
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 1.5,
              mb: 4,
            }}
          >
            {departments.map((item) => (
              <Button
                key={item}
                variant={
                  department === item
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  setDepartment(item);
                  setMachineCode("");
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                sx={{
                  minHeight: 58,
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 2,
            }}
          >
            2. בחירת מכונה
          </Typography>

          {!department ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              תחילה יש לבחור מחלקה.
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 1.5,
                mb: 4,
                maxHeight: 330,
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {departmentMachines.map((machine) => (
                <Button
                  key={machine.code}
                  variant={
                    machineCode === machine.code
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    setMachineCode(machine.code);
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                  sx={{
                    minHeight: 62,
                    justifyContent: "flex-start",
                    textAlign: "right",
                    fontWeight: 900,
                    px: 2,
                  }}
                >
                  {machine.displayNumber} - {machine.name}
                </Button>
              ))}
            </Box>
          )}

          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 2,
            }}
          >
            3. פרטי התקלה
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              select
              fullWidth
              label="סוג קריאה"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as WorkOrderType
                )
              }
            >
              {workOrderTypes.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="רמת דחיפות"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target
                    .value as WorkOrderPriority
                )
              }
            >
              {priorityOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  <Box
                    component="span"
                    sx={{
                      color: option.color,
                      fontWeight: 900,
                    }}
                  >
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              mb: 1.5,
            }}
          >
            האם המכונה מושבתת?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 180px))",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Button
              variant={
                isDowntime ? "contained" : "outlined"
              }
              color="error"
              onClick={() => chooseDowntime(true)}
              sx={{
                minHeight: 54,
                fontWeight: 900,
              }}
            >
              כן — משביתה
            </Button>

            <Button
              variant={
                !isDowntime ? "contained" : "outlined"
              }
              color="success"
              onClick={() => chooseDowntime(false)}
              sx={{
                minHeight: 54,
                fontWeight: 900,
              }}
            >
              לא משביתה
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="תיאור התקלה"
            placeholder="כתוב בקצרה מה קרה ומה רואה המפעיל..."
            value={faultDescription}
            onChange={(event) => {
              setFaultDescription(event.target.value);
              setErrorMessage("");
            }}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              minHeight: 60,
              fontSize: 18,
              fontWeight: 900,
            }}
          >
            פתח קריאה
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
