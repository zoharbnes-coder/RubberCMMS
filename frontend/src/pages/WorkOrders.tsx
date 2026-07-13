import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AppUser } from "../data/users";
import { getWorkOrders } from "../services/workOrderService";
import type {
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
} from "../types/workOrder";

type WorkOrdersProps = {
  currentUser: AppUser;
};

type StatusFilter = "all" | WorkOrderStatus;
type PriorityFilter = "all" | WorkOrderPriority;
type DowntimeFilter = "all" | "yes" | "no";

function getStatusLabel(status: WorkOrderStatus) {
  if (status === "paused") {
    return "מושהה";
  }

  if (status === "closed") {
    return "סגור";
  }

  return "פתוח";
}

function getStatusColor(
  status: WorkOrderStatus
): "warning" | "success" | "info" {
  if (status === "paused") {
    return "warning";
  }

  if (status === "closed") {
    return "success";
  }

  return "info";
}

function getPriorityLabel(
  priority: WorkOrderPriority
) {
  if (priority === "high") {
    return "גבוהה";
  }

  if (priority === "low") {
    return "נמוכה";
  }

  return "בינונית";
}

function getPriorityColor(
  priority: WorkOrderPriority
) {
  if (priority === "high") {
    return "#DC2626";
  }

  if (priority === "low") {
    return "#16A34A";
  }

  return "#F59E0B";
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function getDuration(
  openedAt: string,
  closedAt: string | null
) {
  const startTime = new Date(openedAt).getTime();

  const endTime = closedAt
    ? new Date(closedAt).getTime()
    : Date.now();

  const totalMinutes = Math.max(
    0,
    Math.floor((endTime - startTime) / 60000)
  );

  const days = Math.floor(totalMinutes / 1440);

  const hours = Math.floor(
    (totalMinutes % 1440) / 60
  );

  const minutes = totalMinutes % 60;

  const time = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}`;

  if (days > 0) {
    return `${days} ימים ${time}`;
  }

  return time;
}

function sortWorkOrders(
  workOrders: WorkOrder[]
) {
  const priorityRank: Record<
    WorkOrderPriority,
    number
  > = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...workOrders].sort((first, second) => {
    const firstIsOpen =
      first.status !== "closed";

    const secondIsOpen =
      second.status !== "closed";

    if (firstIsOpen !== secondIsOpen) {
      return firstIsOpen ? -1 : 1;
    }

    if (
      first.isDowntime !== second.isDowntime
    ) {
      return first.isDowntime ? -1 : 1;
    }

    if (
      priorityRank[first.priority] !==
      priorityRank[second.priority]
    ) {
      return (
        priorityRank[first.priority] -
        priorityRank[second.priority]
      );
    }

    return (
      new Date(second.openedAt).getTime() -
      new Date(first.openedAt).getTime()
    );
  });
}

export default function WorkOrders({
  currentUser,
}: WorkOrdersProps) {
  const navigate = useNavigate();

  const [workOrders, setWorkOrders] = useState<
    WorkOrder[]
  >(() => sortWorkOrders(getWorkOrders()));

  const [searchText, setSearchText] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [downtimeFilter, setDowntimeFilter] =
    useState<DowntimeFilter>("all");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("all");

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          workOrders.map(
            (workOrder) =>
              workOrder.department
          )
        )
      ).sort(),
    [workOrders]
  );

  const filteredWorkOrders = useMemo(() => {
    const normalizedSearch =
      searchText.trim().toLowerCase();

    return workOrders.filter((workOrder) => {
      const matchesSearch =
        !normalizedSearch ||
        workOrder.workOrderNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        workOrder.machineCode
          .toLowerCase()
          .includes(normalizedSearch) ||
        workOrder.machineDisplayNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        workOrder.machineName
          .toLowerCase()
          .includes(normalizedSearch) ||
        workOrder.faultDescription
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        workOrder.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        workOrder.priority === priorityFilter;

      const matchesDepartment =
        departmentFilter === "all" ||
        workOrder.department ===
          departmentFilter;

      const matchesDowntime =
        downtimeFilter === "all" ||
        (downtimeFilter === "yes" &&
          workOrder.isDowntime) ||
        (downtimeFilter === "no" &&
          !workOrder.isDowntime);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDepartment &&
        matchesDowntime
      );
    });
  }, [
    departmentFilter,
    downtimeFilter,
    priorityFilter,
    searchText,
    statusFilter,
    workOrders,
  ]);

  function openWorkOrder(
    workOrder: WorkOrder
  ) {
    navigate(
      `/workorders/${encodeURIComponent(
        workOrder.id
      )}`
    );
  }

  function refreshWorkOrders() {
    setWorkOrders(
      sortWorkOrders(getWorkOrders())
    );
  }

  function resetFilters() {
    setSearchText("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDowntimeFilter("all");
    setDepartmentFilter("all");
  }

  return (
    <Box dir="rtl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 1,
            }}
          >
            קריאות מערכת
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
            }}
          >
            צפייה, חיפוש וטיפול בקריאות האחזקה.
          </Typography>

          <Typography
            component="div"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              mt: 0.5,
            }}
          >
            משתמש מחובר: {currentUser.fullName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={() =>
              navigate("/workorders/new")
            }
            sx={{
              minHeight: 46,
              fontWeight: 900,
            }}
          >
            פתיחת קריאה חדשה
          </Button>

          <Button
            variant="outlined"
            onClick={refreshWorkOrders}
            sx={{
              minHeight: 46,
              fontWeight: 900,
            }}
          >
            רענן נתונים
          </Button>
        </Box>
      </Box>

      <Card
        sx={{
          borderRadius: 5,
          mb: 3,
          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(6, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="חיפוש"
              placeholder="מספר דוח, מכונה או תיאור..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            <TextField
              select
              fullWidth
              label="סטטוס"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
            >
              <MenuItem value="all">
                הכול
              </MenuItem>

              <MenuItem value="open">
                פתוח
              </MenuItem>

              <MenuItem value="paused">
                מושהה
              </MenuItem>

              <MenuItem value="closed">
                סגור
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="דחיפות"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target
                    .value as PriorityFilter
                )
              }
            >
              <MenuItem value="all">
                הכול
              </MenuItem>

              <MenuItem value="high">
                גבוהה
              </MenuItem>

              <MenuItem value="medium">
                בינונית
              </MenuItem>

              <MenuItem value="low">
                נמוכה
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="משביתה"
              value={downtimeFilter}
              onChange={(event) =>
                setDowntimeFilter(
                  event.target
                    .value as DowntimeFilter
                )
              }
            >
              <MenuItem value="all">
                הכול
              </MenuItem>

              <MenuItem value="yes">
                כן
              </MenuItem>

              <MenuItem value="no">
                לא
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="מחלקה"
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                כל המחלקות
              </MenuItem>

              {departments.map(
                (department) => (
                  <MenuItem
                    key={department}
                    value={department}
                  >
                    {department}
                  </MenuItem>
                )
              )}
            </TextField>

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{
                minHeight: 56,
                fontWeight: 900,
              }}
            >
              נקה סינון
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography
        component="div"
        sx={{
          fontWeight: 900,
          mb: 2,
        }}
      >
        נמצאו {filteredWorkOrders.length} קריאות
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {filteredWorkOrders.length === 0 ? (
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography
                component="p"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  py: 4,
                }}
              >
                לא נמצאו קריאות מתאימות.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredWorkOrders.map(
            (workOrder) => {
              const priorityColor =
                getPriorityColor(
                  workOrder.priority
                );

              return (
                <Card
                  key={workOrder.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    openWorkOrder(workOrder)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      openWorkOrder(workOrder);
                    }
                  }}
                  sx={{
                    borderRadius: 4,
                    borderRight: `8px solid ${priorityColor}`,
                    boxShadow:
                      "0 5px 18px rgba(15,23,42,0.07)",
                    cursor: "pointer",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform:
                        "translateY(-2px)",
                      boxShadow:
                        "0 10px 24px rgba(15,23,42,0.12)",
                    },
                    "&:focus-visible": {
                      outline:
                        "3px solid #2563EB",
                      outlineOffset: "3px",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "1.1fr 1.4fr 1.5fr 1fr 0.8fr auto",
                        },
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                            fontSize: 16,
                          }}
                        >
                          {
                            workOrder.workOrderNumber
                          }
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 13,
                          }}
                        >
                          {formatDate(
                            workOrder.openedAt
                          )}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                          }}
                        >
                          {
                            workOrder.machineDisplayNumber
                          }{" "}
                          - {workOrder.machineName}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 13,
                          }}
                        >
                          {workOrder.department}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 12,
                          }}
                        >
                          תיאור התקלה
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 700,
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {
                            workOrder.faultDescription
                          }
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={getStatusLabel(
                            workOrder.status
                          )}
                          color={getStatusColor(
                            workOrder.status
                          )}
                          size="small"
                        />

                        <Chip
                          label={getPriorityLabel(
                            workOrder.priority
                          )}
                          size="small"
                          sx={{
                            bgcolor:
                              priorityColor,
                            color: "white",
                            fontWeight: 900,
                          }}
                        />

                        {workOrder.isDowntime && (
                          <Chip
                            label="משביתה"
                            color="error"
                            size="small"
                          />
                        )}
                      </Box>

                      <Box>
                        <Typography
                          component="div"
                          sx={{
                            color:
                              "text.secondary",
                            fontSize: 12,
                          }}
                        >
                          {workOrder.status ===
                          "closed"
                            ? "זמן כולל"
                            : "זמן פתוח"}
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 900,
                            fontSize: 18,
                            color:
                              workOrder.status ===
                              "closed"
                                ? "text.secondary"
                                : priorityColor,
                          }}
                        >
                          {getDuration(
                            workOrder.openedAt,
                            workOrder.closedAt
                          )}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={(event) => {
                          event.stopPropagation();
                          openWorkOrder(workOrder);
                        }}
                        sx={{
                          minHeight: 44,
                          fontWeight: 900,
                          whiteSpace: "nowrap",
                        }}
                      >
                        פרטי קריאה
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            }
          )
        )}
      </Box>
    </Box>
  );
}