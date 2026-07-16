import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";

import type {
  Machine,
  MachineCriticality,
  MachineStatus,
} from "../../types/machine";

import type {
  CreateMachineInput,
  MachineRepositoryResult,
} from "../../services/machineRepository";

type AssetFormProps = {
  machine?: Machine | null;

  departments: string[];

  onSave: (
    input: CreateMachineInput
  ) => MachineRepositoryResult;

  onCancel: () => void;
};

type AssetFormState = {
  assetNumber: string;
  machineCode: string;
  displayName: string;
  shortName: string;

  department: string;
  area: string;
  location: string;

  manufacturer: string;
  model: string;
  serialNumber: string;

  installationDate: string;

  criticality: MachineCriticality;
  status: MachineStatus;

  active: boolean;
};

const emptyFormState: AssetFormState = {
  assetNumber: "",
  machineCode: "",
  displayName: "",
  shortName: "",

  department: "",
  area: "",
  location: "",

  manufacturer: "",
  model: "",
  serialNumber: "",

  installationDate: "",

  criticality: "medium",
  status: "running",

  active: true,
};

function machineToFormState(
  machine: Machine
): AssetFormState {
  return {
    assetNumber:
      machine.assetNumber,

    machineCode:
      machine.machineCode,

    displayName:
      machine.displayName,

    shortName:
      machine.shortName,

    department:
      machine.department,

    area:
      machine.area,

    location:
      machine.location,

    manufacturer:
      machine.manufacturer,

    model:
      machine.model,

    serialNumber:
      machine.serialNumber,

    installationDate:
      machine.installationDate,

    criticality:
      machine.criticality,

    status:
      machine.status,

    active:
      machine.active,
  };
}

function getCriticalityLabel(
  criticality: MachineCriticality
): string {
  if (criticality === "critical") {
    return "קריטית";
  }

  if (criticality === "high") {
    return "גבוהה";
  }

  if (criticality === "low") {
    return "נמוכה";
  }

  return "בינונית";
}

function getStatusLabel(
  status: MachineStatus
): string {
  if (status === "alarm") {
    return "מושבתת";
  }

  if (status === "warning") {
    return "אזהרה";
  }

  if (status === "maintenance") {
    return "בתחזוקה";
  }

  return "פעילה";
}

function validateForm(
  form: AssetFormState
): string | null {
  if (!form.assetNumber.trim()) {
    return "חובה להזין מספר מכונה.";
  }

  if (!form.machineCode.trim()) {
    return "חובה להזין קוד מכונה.";
  }

  if (!form.displayName.trim()) {
    return "חובה להזין שם מכונה.";
  }

  if (!form.department.trim()) {
    return "חובה לבחור או להזין מחלקה.";
  }

  return null;
}

export default function AssetForm({
  machine,
  departments,
  onSave,
  onCancel,
}: AssetFormProps) {
  const [form, setForm] =
    useState<AssetFormState>(
      machine
        ? machineToFormState(machine)
        : emptyFormState
    );

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    setForm(
      machine
        ? machineToFormState(machine)
        : emptyFormState
    );

    setErrorMessage("");
    setSuccessMessage("");
  }, [machine]);

  function updateField<
    Key extends keyof AssetFormState
  >(
    field: Key,
    value: AssetFormState[Key]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError =
      validateForm(form);

    if (validationError) {
      setErrorMessage(
        validationError
      );

      return;
    }

    setIsSaving(true);

    const result = onSave({
      assetNumber:
        form.assetNumber,

      machineCode:
        form.machineCode,

      displayName:
        form.displayName,

      shortName:
        form.shortName ||
        form.displayName,

      department:
        form.department,

      area:
        form.area,

      location:
        form.location,

      manufacturer:
        form.manufacturer,

      model:
        form.model,

      serialNumber:
        form.serialNumber,

      installationDate:
        form.installationDate,

      criticality:
        form.criticality,

      active:
        form.active,

      status:
        form.status,
    });

    setIsSaving(false);

    if (!result.success) {
      setErrorMessage(
        result.message
      );

      return;
    }

    setSuccessMessage(
      result.message
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      dir="rtl"
      sx={{
        display: "grid",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          component="h2"
          sx={{
            fontWeight: 900,
            fontSize: 18,
            mb: 0.3,
          }}
        >
          {machine
            ? "עריכת מכונה"
            : "הוספת מכונה חדשה"}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: 11.5,
          }}
        >
          הגדרת פרטי זיהוי, מיקום,
          יצרן, קריטיות ומצב הנכס.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error">
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success">
          {successMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          required
          label="מספר מכונה"
          value={form.assetNumber}
          onChange={(event) =>
            updateField(
              "assetNumber",
              event.target.value
            )
          }
          placeholder="לדוגמה: 311"
        />

        <TextField
          fullWidth
          required
          label="קוד מכונה"
          value={form.machineCode}
          onChange={(event) =>
            updateField(
              "machineCode",
              event.target.value
            )
          }
          placeholder="לדוגמה: MIX-311"
        />

        <TextField
          fullWidth
          required
          label="שם המכונה"
          value={form.displayName}
          onChange={(event) =>
            updateField(
              "displayName",
              event.target.value
            )
          }
          placeholder="לדוגמה: White Mixer D9"
        />

        <TextField
          fullWidth
          label="שם קצר"
          value={form.shortName}
          onChange={(event) =>
            updateField(
              "shortName",
              event.target.value
            )
          }
          placeholder="לדוגמה: D9"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          required
          label="מחלקה"
          value={form.department}
          onChange={(event) =>
            updateField(
              "department",
              event.target.value
            )
          }
          placeholder="לדוגמה: תערובות"
          slotProps={{
            htmlInput: {
              list: "asset-departments",
            },
          }}
        />

        <datalist id="asset-departments">
          {departments.map(
            (department) => (
              <option
                key={department}
                value={department}
              />
            )
          )}
        </datalist>

        <TextField
          fullWidth
          label="אזור"
          value={form.area}
          onChange={(event) =>
            updateField(
              "area",
              event.target.value
            )
          }
          placeholder="לדוגמה: אולם ערבול"
        />

        <TextField
          fullWidth
          label="מיקום"
          value={form.location}
          onChange={(event) =>
            updateField(
              "location",
              event.target.value
            )
          }
          placeholder="לדוגמה: קו 1"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          label="יצרן"
          value={form.manufacturer}
          onChange={(event) =>
            updateField(
              "manufacturer",
              event.target.value
            )
          }
          placeholder="לדוגמה: Farrel"
        />

        <TextField
          fullWidth
          label="דגם"
          value={form.model}
          onChange={(event) =>
            updateField(
              "model",
              event.target.value
            )
          }
          placeholder="לדוגמה: 9D"
        />

        <TextField
          fullWidth
          label="מספר סידורי"
          value={form.serialNumber}
          onChange={(event) =>
            updateField(
              "serialNumber",
              event.target.value
            )
          }
        />

        <TextField
          fullWidth
          label="תאריך התקנה"
          type="date"
          value={form.installationDate}
          onChange={(event) =>
            updateField(
              "installationDate",
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <TextField
          select
          fullWidth
          label="קריטיות"
          value={form.criticality}
          onChange={(event) =>
            updateField(
              "criticality",
              event.target
                .value as MachineCriticality
            )
          }
        >
          {(
            [
              "critical",
              "high",
              "medium",
              "low",
            ] as MachineCriticality[]
          ).map((criticality) => (
            <MenuItem
              key={criticality}
              value={criticality}
            >
              {getCriticalityLabel(
                criticality
              )}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="סטטוס"
          value={form.status}
          onChange={(event) =>
            updateField(
              "status",
              event.target
                .value as MachineStatus
            )
          }
        >
          {(
            [
              "running",
              "warning",
              "alarm",
              "maintenance",
            ] as MachineStatus[]
          ).map((status) => (
            <MenuItem
              key={status}
              value={status}
            >
              {getStatusLabel(status)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 3,
          bgcolor: "#F8FAFC",
          border: "1px solid #E2E8F0",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={form.active}
              onChange={(event) =>
                updateField(
                  "active",
                  event.target.checked
                )
              }
            />
          }
          label={
            <Box>
              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: 12.5,
                }}
              >
                נכס פעיל
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: 10.5,
                }}
              >
                נכס לא פעיל יישמר
                בהיסטוריה אך לא יוצג
                ברשימות העבודה הרגילות.
              </Typography>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          flexWrap: "wrap",
          pt: 0.5,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={isSaving}
          sx={{
            fontWeight: 900,
          }}
        >
          ביטול
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{
            fontWeight: 900,
          }}
        >
          {isSaving
            ? "שומר..."
            : machine
              ? "שמור שינויים"
              : "הוסף מכונה"}
        </Button>
      </Box>
    </Box>
  );
}