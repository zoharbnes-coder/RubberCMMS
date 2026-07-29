import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  AppUser,
} from "../data/users";

import {
  getLiveAssets,
} from "../services/assetService";

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

type CreatedWorkOrderInfo = {
  workOrderNumber: string;

  assetNumber: string;

  assetName: string;
};

const workOrderTypes: {
  value: WorkOrderType;
  label: string;
}[] = [
  {
    value: "fault",
    label: "תקלה",
  },
  {
    value: "preventive",
    label: "טיפול מונע",
  },
  {
    value: "safety",
    label: "בטיחות",
  },
  {
    value: "improvement",
    label: "שיפור",
  },
];

const priorityOptions: {
  value: WorkOrderPriority;
  label: string;
  color: string;
}[] = [
  {
    value: "high",
    label: "גבוהה",
    color: "#DC2626",
  },
  {
    value: "medium",
    label: "בינונית",
    color: "#F59E0B",
  },
  {
    value: "low",
    label: "נמוכה",
    color: "#16A34A",
  },
];

export default function NewWorkOrder({
  currentUser,
}: NewWorkOrderProps) {
  const navigate =
    useNavigate();

  const [
    department,
    setDepartment,
  ] = useState("");

  const [
    assetId,
    setAssetId,
  ] = useState("");

  const [
    type,
    setType,
  ] =
    useState<WorkOrderType>(
      "fault",
    );

  const [
    isDowntime,
    setIsDowntime,
  ] = useState(false);

  const [
    priority,
    setPriority,
  ] =
    useState<WorkOrderPriority>(
      "medium",
    );

  const [
    faultDescription,
    setFaultDescription,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    createdWorkOrderInfo,
    setCreatedWorkOrderInfo,
  ] =
    useState<CreatedWorkOrderInfo | null>(
      null,
    );

  const assets =
    useMemo(
      () =>
        getLiveAssets(),
      [],
    );

  const departments =
    useMemo(
      () =>
        Array.from(
          new Set(
            assets
              .filter(
                (asset) =>
                  asset.active,
              )
              .map(
                (asset) =>
                  asset.department,
              )
              .filter(
                (value) =>
                  Boolean(value),
              ),
          ),
        ).sort(),
      [assets],
    );

  const departmentAssets =
    useMemo(
      () =>
        assets
          .filter(
            (asset) =>
              asset.active &&
              asset.department ===
                department,
          )
          .sort(
            (
              first,
              second,
            ) =>
              first.assetNumber.localeCompare(
                second.assetNumber,
                undefined,
                {
                  numeric: true,
                },
              ),
          ),
      [
        assets,
        department,
      ],
    );

  const selectedAsset =
    assets.find(
      (asset) =>
        asset.id ===
        assetId,
    );

  function chooseDowntime(
    value: boolean,
  ) {
    setIsDowntime(
      value,
    );

    if (value) {
      setPriority(
        "high",
      );

      return;
    }

    if (
      priority ===
      "high"
    ) {
      setPriority(
        "medium",
      );
    }
  }

  function resetForm() {
    setDepartment(
      "",
    );

    setAssetId(
      "",
    );

    setType(
      "fault",
    );

    setIsDowntime(
      false,
    );

    setPriority(
      "medium",
    );

    setFaultDescription(
      "",
    );

    setErrorMessage(
      "",
    );
  }

  function handleSubmit() {
    setErrorMessage(
      "",
    );

    if (
      !department
    ) {
      setErrorMessage(
        "יש לבחור מחלקה.",
      );

      return;
    }

    if (
      !selectedAsset
    ) {
      setErrorMessage(
        "יש לבחור נכס.",
      );

      return;
    }

    if (
      !faultDescription.trim()
    ) {
      setErrorMessage(
        "יש להזין תיאור תקלה.",
      );

      return;
    }

    const existingOpenCall =
      getWorkOrders().some(
        (workOrder) =>
          workOrder.assetId ===
            selectedAsset.id &&
          workOrder.status !==
            "closed",
      );

    if (
      existingOpenCall
    ) {
      const shouldContinue =
        window.confirm(
          "קיימת כבר קריאה פתוחה על נכס זה.\n\nהאם זו קריאה נוספת וברצונך להמשיך?",
        );

      if (
        !shouldContinue
      ) {
        return;
      }
    }

    const created =
      createWorkOrder({
        assetId:
          selectedAsset.id,

        assetCode:
          selectedAsset.assetCode,

        assetNumber:
          selectedAsset.assetNumber,

        assetName:
          selectedAsset.displayName,

        department:
          selectedAsset.department,

        type,

        priority,

        isDowntime,

        faultDescription:
          faultDescription.trim(),

        openedBy:
          currentUser.username,
      });

    setCreatedWorkOrderInfo({
      workOrderNumber:
        created.workOrderNumber,

      assetNumber:
        created.assetNumber,

      assetName:
        created.assetName,
    });

    resetForm();
  }

  function handleCreateAnother() {
    setCreatedWorkOrderInfo(
      null,
    );
  }

  function handleGoToWorkOrders() {
    setCreatedWorkOrderInfo(
      null,
    );

    navigate(
      "/workorders",
    );
  }

  return (
    <>
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
            color:
              "text.secondary",
            mb: 3,
          }}
        >
          בחר מחלקה, נכס ותאר בקצרה את התקלה.
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
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
          <CardContent
            sx={{
              p: {
                xs: 2,
                md: 4,
              },
            }}
          >
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

                  sm:
                    "repeat(2, 1fr)",

                  lg:
                    "repeat(3, 1fr)",
                },

                gap: 1.5,
                mb: 4,
              }}
            >
              {departments.map(
                (item) => (
                  <Button
                    key={
                      item
                    }
                    variant={
                      department ===
                      item
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      setDepartment(
                        item,
                      );

                      setAssetId(
                        "",
                      );

                      setErrorMessage(
                        "",
                      );
                    }}
                    sx={{
                      minHeight: 58,

                      fontWeight: 900,

                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Button>
                ),
              )}
            </Box>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 2,
              }}
            >
              2. בחירת נכס
            </Typography>

            {!department ? (
              <Alert
                severity="info"
                sx={{
                  mb: 4,
                }}
              >
                תחילה יש לבחור מחלקה.
              </Alert>
            ) : (
              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    sm:
                      "repeat(2, 1fr)",

                    lg:
                      "repeat(3, 1fr)",
                  },

                  gap: 1.5,

                  mb: 4,

                  maxHeight:
                    330,

                  overflowY:
                    "auto",

                  pr: 0.5,
                }}
              >
                {departmentAssets.map(
                  (asset) => (
                    <Button
                      key={
                        asset.id
                      }
                      variant={
                        assetId ===
                        asset.id
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        setAssetId(
                          asset.id,
                        );

                        setErrorMessage(
                          "",
                        );
                      }}
                      sx={{
                        minHeight:
                          62,

                        justifyContent:
                          "flex-start",

                        textAlign:
                          "right",

                        fontWeight:
                          900,

                        px: 2,
                      }}
                    >
                      {
                        asset.assetNumber
                      }
                      {" - "}
                      {
                        asset.displayName
                      }
                    </Button>
                  ),
                )}
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

                  md:
                    "repeat(2, 1fr)",
                },

                gap: 2,

                mb: 3,
              }}
            >
              <TextField
                select
                fullWidth
                label="סוג קריאה"
                value={
                  type
                }
                onChange={(
                  event,
                ) =>
                  setType(
                    event.target
                      .value as WorkOrderType,
                  )
                }
              >
                {workOrderTypes.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </MenuItem>
                  ),
                )}
              </TextField>

              <TextField
                select
                fullWidth
                label="רמת דחיפות"
                value={
                  priority
                }
                onChange={(
                  event,
                ) =>
                  setPriority(
                    event.target
                      .value as WorkOrderPriority,
                  )
                }
              >
                {priorityOptions.map(
                  (option) => (
                    <MenuItem
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      <Box
                        component="span"
                        sx={{
                          color:
                            option.color,

                          fontWeight:
                            900,
                        }}
                      >
                        {
                          option.label
                        }
                      </Box>
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Box>

            <Typography
              component="div"
              sx={{
                fontWeight: 900,
                mb: 1.5,
              }}
            >
              האם הנכס מושבת?
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
                  isDowntime
                    ? "contained"
                    : "outlined"
                }
                color="error"
                onClick={() =>
                  chooseDowntime(
                    true,
                  )
                }
                sx={{
                  minHeight:
                    54,

                  fontWeight:
                    900,
                }}
              >
                כן — משביתה
              </Button>

              <Button
                variant={
                  !isDowntime
                    ? "contained"
                    : "outlined"
                }
                color="success"
                onClick={() =>
                  chooseDowntime(
                    false,
                  )
                }
                sx={{
                  minHeight:
                    54,

                  fontWeight:
                    900,
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
              value={
                faultDescription
              }
              onChange={(
                event,
              ) => {
                setFaultDescription(
                  event.target
                    .value,
                );

                setErrorMessage(
                  "",
                );
              }}
              sx={{
                mb: 3,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={
                handleSubmit
              }
              sx={{
                minHeight:
                  60,

                fontSize:
                  18,

                fontWeight:
                  900,
              }}
            >
              פתח קריאה
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={
          createdWorkOrderInfo !==
          null
        }
        onClose={
          handleCreateAnother
        }
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius:
                5,
            },
          },
        }}
      >
        <DialogTitle
          component="div"
          dir="rtl"
          sx={{
            textAlign:
              "center",

            pt: 4,

            pb: 1,
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize:
                72,

              color:
                "#16A34A",

              mb: 1,
            }}
          />

          <Typography
            component="div"
            variant="h4"
            sx={{
              fontWeight:
                900,
            }}
          >
            הקריאה נפתחה בהצלחה
          </Typography>
        </DialogTitle>

        <DialogContent
          dir="rtl"
          sx={{
            textAlign:
              "center",

            py: 3,
          }}
        >
          {createdWorkOrderInfo && (
            <>
              <Typography
                component="div"
                sx={{
                  color:
                    "text.secondary",

                  mb: 1,
                }}
              >
                מספר הקריאה
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontSize:
                    30,

                  fontWeight:
                    900,

                  color:
                    "#2563EB",

                  mb: 3,
                }}
              >
                {
                  createdWorkOrderInfo.workOrderNumber
                }
              </Typography>

              <Box
                sx={{
                  bgcolor:
                    "#F8FAFC",

                  border:
                    "1px solid #E2E8F0",

                  borderRadius:
                    3,

                  p: 2,
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      13,
                  }}
                >
                  נכס
                </Typography>

                <Typography
                  component="div"
                  sx={{
                    fontWeight:
                      900,

                    fontSize:
                      18,
                  }}
                >
                  {
                    createdWorkOrderInfo.assetNumber
                  }{" "}
                  -{" "}
                  {
                    createdWorkOrderInfo.assetName
                  }
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          dir="rtl"
          sx={{
            justifyContent:
              "center",

            gap:
              1.5,

            px:
              3,

            pb:
              4,

            flexWrap:
              "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={
              handleGoToWorkOrders
            }
            sx={{
              minHeight:
                50,

              minWidth:
                180,

              fontWeight:
                900,
            }}
          >
            מעבר לקריאות
          </Button>

          <Button
            variant="outlined"
            onClick={
              handleCreateAnother
            }
            sx={{
              minHeight:
                50,

              minWidth:
                180,

              fontWeight:
                900,
            }}
          >
            פתח קריאה נוספת
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}