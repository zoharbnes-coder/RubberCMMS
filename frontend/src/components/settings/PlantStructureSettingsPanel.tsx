import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  useMemo,
  useState,
} from "react";

import type {
  Asset,
  AssetLifecycleStatus,
} from "../../types/asset";

import {
  archiveAsset,
  reactivateAsset,
  suspendAsset,
} from "../../services/assetRepository";

import {
  createArea,
  createDepartment,
  deleteArea,
  deleteDepartment,
  getPlantStructureData,
  getPlantStructureSnapshot,
  moveAssetInStructure,
  setAreaActive,
  setDepartmentActive,
  updateArea,
  updateDepartment,
  updatePlantName,
  type PlantArea,
  type PlantDepartment,
  type PlantStructureAssetNode,
  type PlantStructureSnapshot,
} from "../../services/plantStructureService";

type MessageState = {
  type:
    | "success"
    | "error";

  text:
    string;
};

type DepartmentFormState = {
  id:
    string | null;

  name:
    string;

  description:
    string;
};

type AreaFormState = {
  id:
    string | null;

  departmentId:
    string;

  name:
    string;

  description:
    string;
};

type MoveAssetFormState = {
  assetId:
    string;

  departmentId:
    string;

  areaId:
    string;

  parentAssetId:
    string;
};

const EMPTY_DEPARTMENT_FORM:
  DepartmentFormState = {
  id:
    null,

  name:
    "",

  description:
    "",
};

const EMPTY_AREA_FORM:
  AreaFormState = {
  id:
    null,

  departmentId:
    "",

  name:
    "",

  description:
    "",
};

const EMPTY_MOVE_FORM:
  MoveAssetFormState = {
  assetId:
    "",

  departmentId:
    "",

  areaId:
    "",

  parentAssetId:
    "",
};

function getLifecycleStatus(
  asset:
    Asset,
): AssetLifecycleStatus {
  return (
    asset.lifecycleStatus ??
    (
      asset.active
        ? "active"
        : "suspended"
    )
  );
}

function getLifecycleLabel(
  lifecycleStatus:
    AssetLifecycleStatus,
): string {
  if (
    lifecycleStatus ===
    "active"
  ) {
    return "פעיל";
  }

  if (
    lifecycleStatus ===
    "suspended"
  ) {
    return "מושהה";
  }

  return "ארכיון";
}

function getLifecycleColor(
  lifecycleStatus:
    AssetLifecycleStatus,
):
  | "success"
  | "warning"
  | "default" {
  if (
    lifecycleStatus ===
    "active"
  ) {
    return "success";
  }

  if (
    lifecycleStatus ===
    "suspended"
  ) {
    return "warning";
  }

  return "default";
}

function getAssetLabel(
  asset:
    Asset,
): string {
  return `${asset.assetNumber} - ${asset.displayName}`;
}

function flattenNodes(
  nodes:
    PlantStructureAssetNode[],
): Asset[] {
  const result:
    Asset[] = [];

  function collect(
    node:
      PlantStructureAssetNode,
  ): void {
    result.push(
      node.asset,
    );

    node.children.forEach(
      collect,
    );
  }

  nodes.forEach(
    collect,
  );

  return result;
}

function AssetTreeNode({
  node,
  depth,
  onMove,
  onSuspend,
  onReactivate,
  onArchive,
}: {
  node:
    PlantStructureAssetNode;

  depth:
    number;

  onMove:
    (
      asset:
        Asset,
    ) => void;

  onSuspend:
    (
      asset:
        Asset,
    ) => void;

  onReactivate:
    (
      asset:
        Asset,
    ) => void;

  onArchive:
    (
      asset:
        Asset,
    ) => void;
}) {
  const lifecycleStatus =
    getLifecycleStatus(
      node.asset,
    );

  return (
    <Box
      sx={{
        mr:
          depth *
          2,

        mb:
          1,
      }}
    >
      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            lg:
              "minmax(220px, 1.5fr) 120px 120px minmax(280px, 1fr)",
          },

          gap:
            1.5,

          alignItems:
            "center",

          p:
            1.5,

          borderRadius:
            3,

          bgcolor:
            depth ===
            0
              ? "#F8FAFC"
              : "#FFFFFF",

          border:
            "1px solid #E2E8F0",
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontWeight:
                900,
            }}
          >
            {
              node.asset.assetNumber
            }{" "}
            -{" "}
            {
              node.asset.displayName
            }
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                "text.secondary",

              fontSize:
                12,
            }}
          >
            {
              node.asset.assetType
            }{" "}
            •{" "}
            {
              node.asset.hierarchyLevel
            }
          </Typography>
        </Box>

        <Chip
          label={
            getLifecycleLabel(
              lifecycleStatus,
            )
          }
          color={
            getLifecycleColor(
              lifecycleStatus,
            )
          }
          size="small"
          sx={{
            fontWeight:
              900,
          }}
        />

        <Typography
          component="div"
          sx={{
            color:
              "text.secondary",

            fontSize:
              12,
          }}
        >
          {
            node.children.length
          }{" "}
          נכסי משנה
        </Typography>

        <Box
          sx={{
            display:
              "flex",

            gap:
              1,

            flexWrap:
              "wrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              onMove(
                node.asset,
              )
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            העברה
          </Button>

          {lifecycleStatus ===
          "active" ? (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() =>
                onSuspend(
                  node.asset,
                )
              }
              sx={{
                fontWeight:
                  900,
              }}
            >
              השהיה
            </Button>
          ) : lifecycleStatus ===
            "suspended" ? (
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() =>
                onReactivate(
                  node.asset,
                )
              }
              sx={{
                fontWeight:
                  900,
              }}
            >
              החזרה לפעילות
            </Button>
          ) : null}

          {lifecycleStatus !==
            "archived" && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() =>
                onArchive(
                  node.asset,
                )
              }
              sx={{
                fontWeight:
                  900,
              }}
            >
              ארכוב
            </Button>
          )}
        </Box>
      </Box>

      {node.children.map(
        (child) => (
          <AssetTreeNode
            key={
              child.asset.id
            }
            node={
              child
            }
            depth={
              depth +
              1
            }
            onMove={
              onMove
            }
            onSuspend={
              onSuspend
            }
            onReactivate={
              onReactivate
            }
            onArchive={
              onArchive
            }
          />
        ),
      )}
    </Box>
  );
}

export default function PlantStructureSettingsPanel() {
  const [
    snapshot,
    setSnapshot,
  ] =
    useState<PlantStructureSnapshot>(
      getPlantStructureSnapshot(),
    );

  const [
    message,
    setMessage,
  ] =
    useState<MessageState | null>(
      null,
    );

  const [
    plantName,
    setPlantName,
  ] =
    useState(
      snapshot.plantName,
    );

  const [
    departmentDialogOpen,
    setDepartmentDialogOpen,
  ] =
    useState(
      false,
    );

  const [
    departmentForm,
    setDepartmentForm,
  ] =
    useState<DepartmentFormState>(
      EMPTY_DEPARTMENT_FORM,
    );

  const [
    areaDialogOpen,
    setAreaDialogOpen,
  ] =
    useState(
      false,
    );

  const [
    areaForm,
    setAreaForm,
  ] =
    useState<AreaFormState>(
      EMPTY_AREA_FORM,
    );

  const [
    moveDialogOpen,
    setMoveDialogOpen,
  ] =
    useState(
      false,
    );

  const [
    moveForm,
    setMoveForm,
  ] =
    useState<MoveAssetFormState>(
      EMPTY_MOVE_FORM,
    );

  const allActiveAssets =
    useMemo(
      () => {
        const assets:
          Asset[] = [];

        snapshot.departments.forEach(
          (departmentSnapshot) => {
            departmentSnapshot.areas.forEach(
              (areaSnapshot) => {
                assets.push(
                  ...flattenNodes(
                    areaSnapshot.assets,
                  ),
                );
              },
            );

            assets.push(
              ...flattenNodes(
                departmentSnapshot.unassignedAssets,
              ),
            );
          },
        );

        assets.push(
          ...snapshot.orphanAssets,
        );

        return Array.from(
          new Map(
            assets.map(
              (asset) => [
                asset.id,
                asset,
              ],
            ),
          ).values(),
        );
      },
      [
        snapshot,
      ],
    );

  const structureData =
    getPlantStructureData();

  const moveAreas =
    structureData.areas.filter(
      (area) =>
        area.departmentId ===
        moveForm.departmentId,
    );

  const possibleParents =
    allActiveAssets.filter(
      (asset) =>
        asset.id !==
          moveForm.assetId &&
        asset.department ===
          structureData.departments.find(
            (department) =>
              department.id ===
              moveForm.departmentId,
          )?.name &&
        (
          !moveForm.areaId ||
          asset.area ===
            structureData.areas.find(
              (area) =>
                area.id ===
                moveForm.areaId,
            )?.name
        ),
    );

  function refresh(
    newMessage?:
      MessageState,
  ): void {
    const nextSnapshot =
      getPlantStructureSnapshot();

    setSnapshot(
      nextSnapshot,
    );

    setPlantName(
      nextSnapshot.plantName,
    );

    if (
      newMessage
    ) {
      setMessage(
        newMessage,
      );
    }
  }

  function showResult(
    success:
      boolean,
    text:
      string,
  ): void {
    refresh({
      type:
        success
          ? "success"
          : "error",

      text,
    });
  }

  function savePlantName():
    void {
    const result =
      updatePlantName(
        plantName,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function openCreateDepartment():
    void {
    setDepartmentForm(
      EMPTY_DEPARTMENT_FORM,
    );

    setDepartmentDialogOpen(
      true,
    );
  }

  function openEditDepartment(
    department:
      PlantDepartment,
  ): void {
    setDepartmentForm({
      id:
        department.id,

      name:
        department.name,

      description:
        department.description,
    });

    setDepartmentDialogOpen(
      true,
    );
  }

  function saveDepartment():
    void {
    const result =
      departmentForm.id
        ? updateDepartment(
            departmentForm.id,
            departmentForm.name,
            departmentForm.description,
          )
        : createDepartment(
            departmentForm.name,
            departmentForm.description,
          );

    if (
      result.success
    ) {
      setDepartmentDialogOpen(
        false,
      );
    }

    showResult(
      result.success,
      result.message,
    );
  }

  function removeDepartment(
    department:
      PlantDepartment,
  ): void {
    const confirmed =
      window.confirm(
        `למחוק את המחלקה "${department.name}"?`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    const result =
      deleteDepartment(
        department.id,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function toggleDepartment(
    department:
      PlantDepartment,
  ): void {
    const result =
      setDepartmentActive(
        department.id,
        !department.active,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function openCreateArea(
    departmentId:
      string,
  ): void {
    setAreaForm({
      ...EMPTY_AREA_FORM,

      departmentId,
    });

    setAreaDialogOpen(
      true,
    );
  }

  function openEditArea(
    area:
      PlantArea,
  ): void {
    setAreaForm({
      id:
        area.id,

      departmentId:
        area.departmentId,

      name:
        area.name,

      description:
        area.description,
    });

    setAreaDialogOpen(
      true,
    );
  }

  function saveArea():
    void {
    const result =
      areaForm.id
        ? updateArea(
            areaForm.id,
            areaForm.name,
            areaForm.description,
          )
        : createArea(
            areaForm.departmentId,
            areaForm.name,
            areaForm.description,
          );

    if (
      result.success
    ) {
      setAreaDialogOpen(
        false,
      );
    }

    showResult(
      result.success,
      result.message,
    );
  }

  function removeArea(
    area:
      PlantArea,
  ): void {
    const confirmed =
      window.confirm(
        `למחוק את האזור / הקבוצה "${area.name}"?`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    const result =
      deleteArea(
        area.id,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function toggleArea(
    area:
      PlantArea,
  ): void {
    const result =
      setAreaActive(
        area.id,
        !area.active,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function openMoveAsset(
    asset:
      Asset,
  ): void {
    const department =
      structureData.departments.find(
        (item) =>
          item.name ===
          asset.department,
      );

    const area =
      structureData.areas.find(
        (item) =>
          item.departmentId ===
            department?.id &&
          item.name ===
            asset.area,
      );

    setMoveForm({
      assetId:
        asset.id,

      departmentId:
        department?.id ??
        "",

      areaId:
        area?.id ??
        "",

      parentAssetId:
        asset.parentAssetId ??
        "",
    });

    setMoveDialogOpen(
      true,
    );
  }

  function saveMove():
    void {
    const result =
      moveAssetInStructure({
        assetId:
          moveForm.assetId,

        departmentId:
          moveForm.departmentId,

        areaId:
          moveForm.areaId ||
          null,

        parentAssetId:
          moveForm.parentAssetId ||
          null,
      });

    if (
      result.success
    ) {
      setMoveDialogOpen(
        false,
      );
    }

    showResult(
      result.success,
      result.message,
    );
  }

  function suspendSelectedAsset(
    asset:
      Asset,
  ): void {
    const result =
      suspendAsset(
        asset.id,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function reactivateSelectedAsset(
    asset:
      Asset,
  ): void {
    const result =
      reactivateAsset(
        asset.id,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  function archiveSelectedAsset(
    asset:
      Asset,
  ): void {
    const confirmed =
      window.confirm(
        `לארכב את הנכס "${getAssetLabel(
          asset,
        )}"? הנכס יישמר בהיסטוריה אך לא יוצג בתפעול השוטף.`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    const result =
      archiveAsset(
        asset.id,
      );

    showResult(
      result.success,
      result.message,
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          gap:
            2,

          mb:
            3,
        }}
      >
        <Box>
          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontWeight:
                900,

              mb:
                0.5,
            }}
          >
            מבנה המפעל
          </Typography>

          <Typography
            component="p"
            sx={{
              color:
                "text.secondary",
            }}
          >
            ניהול מחלקות, אזורים, קבוצות והיררכיית הנכסים
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={
            openCreateDepartment
          }
          sx={{
            fontWeight:
              900,

            minHeight:
              46,
          }}
        >
          מחלקה חדשה
        </Button>
      </Box>

      {message && (
        <Alert
          severity={
            message.type
          }
          onClose={() =>
            setMessage(
              null,
            )
          }
          sx={{
            mb:
              2,

            borderRadius:
              3,
          }}
        >
          {
            message.text
          }
        </Alert>
      )}

      <Card
        sx={{
          borderRadius:
            5,

          mb:
            3,

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent>
          <Typography
            component="h3"
            variant="h6"
            sx={{
              fontWeight:
                900,

              mb:
                2,
            }}
          >
            פרטי מפעל
          </Typography>

          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                md:
                  "minmax(0, 1fr) 180px",
              },

              gap:
                2,
            }}
          >
            <TextField
              fullWidth
              label="שם המפעל"
              value={
                plantName
              }
              onChange={(
                event,
              ) =>
                setPlantName(
                  event.target.value,
                )
              }
            />

            <Button
              variant="outlined"
              onClick={
                savePlantName
              }
              sx={{
                fontWeight:
                  900,
              }}
            >
              שמור שם מפעל
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Stack
        spacing={
          2
        }
      >
        {snapshot.departments.map(
          (departmentSnapshot) => {
            const {
              department,
              areas,
              unassignedAssets,
            } =
              departmentSnapshot;

            return (
              <Card
                key={
                  department.id
                }
                sx={{
                  borderRadius:
                    5,

                  opacity:
                    department.active
                      ? 1
                      : 0.65,

                  boxShadow:
                    "0 8px 24px rgba(15,23,42,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems: {
                        xs:
                          "flex-start",

                        md:
                          "center",
                      },

                      flexDirection: {
                        xs:
                          "column",

                        md:
                          "row",
                      },

                      gap:
                        2,

                      mb:
                        2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display:
                            "flex",

                          gap:
                            1,

                          alignItems:
                            "center",

                          flexWrap:
                            "wrap",
                        }}
                      >
                        <Typography
                          component="h3"
                          variant="h6"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        >
                          {
                            department.name
                          }
                        </Typography>

                        <Chip
                          label={
                            department.active
                              ? "פעילה"
                              : "מושהית"
                          }
                          color={
                            department.active
                              ? "success"
                              : "warning"
                          }
                          size="small"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        />
                      </Box>

                      {department.description && (
                        <Typography
                          component="p"
                          sx={{
                            color:
                              "text.secondary",

                            fontSize:
                              12,

                            mt:
                              0.5,
                          }}
                        >
                          {
                            department.description
                          }
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display:
                          "flex",

                        gap:
                          1,

                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <AddIcon />
                        }
                        onClick={() =>
                          openCreateArea(
                            department.id,
                          )
                        }
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        אזור / קבוצה
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <EditIcon />
                        }
                        onClick={() =>
                          openEditDepartment(
                            department,
                          )
                        }
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        עריכה
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          department.active
                            ? "warning"
                            : "success"
                        }
                        onClick={() =>
                          toggleDepartment(
                            department,
                          )
                        }
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        {department.active
                          ? "השהה מחלקה"
                          : "החזר מחלקה"}
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={
                          <DeleteIcon />
                        }
                        onClick={() =>
                          removeDepartment(
                            department,
                          )
                        }
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        מחיקה
                      </Button>
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      mb:
                        2,
                    }}
                  />

                  {areas.map(
                    (areaSnapshot) => (
                      <Box
                        key={
                          areaSnapshot.area.id
                        }
                        sx={{
                          mb:
                            2,

                          p:
                            2,

                          borderRadius:
                            4,

                          bgcolor:
                            "#F8FAFC",

                          opacity:
                            areaSnapshot.area.active
                              ? 1
                              : 0.65,
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems: {
                              xs:
                                "flex-start",

                              md:
                                "center",
                            },

                            flexDirection: {
                              xs:
                                "column",

                              md:
                                "row",
                            },

                            gap:
                              1,

                            mb:
                              1.5,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display:
                                  "flex",

                                gap:
                                  1,

                                alignItems:
                                  "center",
                              }}
                            >
                              <Typography
                                component="h4"
                                sx={{
                                  fontWeight:
                                    900,
                                }}
                              >
                                {
                                  areaSnapshot.area.name
                                }
                              </Typography>

                              <Chip
                                label={
                                  areaSnapshot.area.active
                                    ? "פעיל"
                                    : "מושהה"
                                }
                                size="small"
                                color={
                                  areaSnapshot.area.active
                                    ? "success"
                                    : "warning"
                                }
                              />
                            </Box>

                            {areaSnapshot.area.description && (
                              <Typography
                                component="div"
                                sx={{
                                  color:
                                    "text.secondary",

                                  fontSize:
                                    12,

                                  mt:
                                    0.5,
                                }}
                              >
                                {
                                  areaSnapshot.area.description
                                }
                              </Typography>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display:
                                "flex",

                              gap:
                                1,

                              flexWrap:
                                "wrap",
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() =>
                                openEditArea(
                                  areaSnapshot.area,
                                )
                              }
                              sx={{
                                fontWeight:
                                  900,
                              }}
                            >
                              עריכה
                            </Button>

                            <Button
                              size="small"
                              color={
                                areaSnapshot.area.active
                                  ? "warning"
                                  : "success"
                              }
                              onClick={() =>
                                toggleArea(
                                  areaSnapshot.area,
                                )
                              }
                              sx={{
                                fontWeight:
                                  900,
                              }}
                            >
                              {areaSnapshot.area.active
                                ? "השהה"
                                : "החזר"}
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                removeArea(
                                  areaSnapshot.area,
                                )
                              }
                              sx={{
                                fontWeight:
                                  900,
                              }}
                            >
                              מחיקה
                            </Button>
                          </Box>
                        </Box>

                        {areaSnapshot.assets.length ===
                        0 ? (
                          <Typography
                            component="div"
                            sx={{
                              color:
                                "text.secondary",

                              fontSize:
                                12,
                            }}
                          >
                            אין נכסים באזור זה.
                          </Typography>
                        ) : (
                          areaSnapshot.assets.map(
                            (node) => (
                              <AssetTreeNode
                                key={
                                  node.asset.id
                                }
                                node={
                                  node
                                }
                                depth={
                                  0
                                }
                                onMove={
                                  openMoveAsset
                                }
                                onSuspend={
                                  suspendSelectedAsset
                                }
                                onReactivate={
                                  reactivateSelectedAsset
                                }
                                onArchive={
                                  archiveSelectedAsset
                                }
                              />
                            ),
                          )
                        )}
                      </Box>
                    ),
                  )}

                  {unassignedAssets.length >
                    0 && (
                    <Box
                      sx={{
                        p:
                          2,

                        borderRadius:
                          4,

                        bgcolor:
                          "#FFF7ED",
                      }}
                    >
                      <Typography
                        component="h4"
                        sx={{
                          fontWeight:
                            900,

                          mb:
                            1,
                        }}
                      >
                        נכסים ללא אזור / קבוצה
                      </Typography>

                      {unassignedAssets.map(
                        (node) => (
                          <AssetTreeNode
                            key={
                              node.asset.id
                            }
                            node={
                              node
                            }
                            depth={
                              0
                            }
                            onMove={
                              openMoveAsset
                            }
                            onSuspend={
                              suspendSelectedAsset
                            }
                            onReactivate={
                              reactivateSelectedAsset
                            }
                            onArchive={
                              archiveSelectedAsset
                            }
                          />
                        ),
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          },
        )}
      </Stack>

      {snapshot.orphanAssets.length >
        0 && (
        <Card
          sx={{
            borderRadius:
              5,

            mt:
              3,

            border:
              "1px solid #F59E0B",
          }}
        >
          <CardContent>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight:
                  900,

                mb:
                  1,
              }}
            >
              נכסים יתומים
            </Typography>

            <Typography
              component="p"
              sx={{
                color:
                  "text.secondary",

                mb:
                  2,
              }}
            >
              נכסים פעילים שמשויכים למחלקה שאינה קיימת במבנה המפעל.
            </Typography>

            {snapshot.orphanAssets.map(
              (asset) => (
                <Box
                  key={
                    asset.id
                  }
                  sx={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    gap:
                      2,

                    p:
                      1.5,

                    mb:
                      1,

                    bgcolor:
                      "#FFF7ED",

                    borderRadius:
                      3,
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontWeight:
                        900,
                    }}
                  >
                    {
                      getAssetLabel(
                        asset,
                      )
                    }
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      openMoveAsset(
                        asset,
                      )
                    }
                    sx={{
                      fontWeight:
                        900,
                    }}
                  >
                    שייך למחלקה
                  </Button>
                </Box>
              ),
            )}
          </CardContent>
        </Card>
      )}

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            lg:
              "repeat(2, minmax(0, 1fr))",
          },

          gap:
            2,

          mt:
            3,
        }}
      >
        <Card
          sx={{
            borderRadius:
              5,
          }}
        >
          <CardContent>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight:
                  900,

                mb:
                  1,
              }}
            >
              נכסים מושהים
            </Typography>

            <Typography
              component="p"
              sx={{
                color:
                  "text.secondary",

                fontSize:
                  12,

                mb:
                  2,
              }}
            >
              נשמרים בהגדרות ובהיסטוריה אך מוסתרים מהתפעול השוטף.
            </Typography>

            {snapshot.suspendedAssets.length ===
            0 ? (
              <Typography
                component="div"
                sx={{
                  color:
                    "text.secondary",
                }}
              >
                אין נכסים מושהים.
              </Typography>
            ) : (
              snapshot.suspendedAssets.map(
                (asset) => (
                  <Box
                    key={
                      asset.id
                    }
                    sx={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap:
                        1,

                      p:
                        1.25,

                      mb:
                        1,

                      bgcolor:
                        "#FFFBEB",

                      borderRadius:
                        3,
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontWeight:
                          900,
                      }}
                    >
                      {
                        getAssetLabel(
                          asset,
                        )
                      }
                    </Typography>

                    <Button
                      size="small"
                      color="success"
                      onClick={() =>
                        reactivateSelectedAsset(
                          asset,
                        )
                      }
                      sx={{
                        fontWeight:
                          900,
                      }}
                    >
                      החזר לפעילות
                    </Button>
                  </Box>
                ),
              )
            )}
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius:
              5,
          }}
        >
          <CardContent>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight:
                  900,

                mb:
                  1,
              }}
            >
              ארכיון נכסים
            </Typography>

            <Typography
              component="p"
              sx={{
                color:
                  "text.secondary",

                fontSize:
                  12,

                mb:
                  2,
              }}
            >
              נכסים שיצאו משירות אך נשמרים לצורך היסטוריה וניתוח.
            </Typography>

            {snapshot.archivedAssets.length ===
            0 ? (
              <Typography
                component="div"
                sx={{
                  color:
                    "text.secondary",
                }}
              >
                אין נכסים בארכיון.
              </Typography>
            ) : (
              snapshot.archivedAssets.map(
                (asset) => (
                  <Box
                    key={
                      asset.id
                    }
                    sx={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap:
                        1,

                      p:
                        1.25,

                      mb:
                        1,

                      bgcolor:
                        "#F8FAFC",

                      borderRadius:
                        3,
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontWeight:
                          900,
                      }}
                    >
                      {
                        getAssetLabel(
                          asset,
                        )
                      }
                    </Typography>

                    <Button
                      size="small"
                      color="success"
                      onClick={() =>
                        reactivateSelectedAsset(
                          asset,
                        )
                      }
                      sx={{
                        fontWeight:
                          900,
                      }}
                    >
                      שחזר לפעילות
                    </Button>
                  </Box>
                ),
              )
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={
          departmentDialogOpen
        }
        onClose={() =>
          setDepartmentDialogOpen(
            false,
          )
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight:
              900,
          }}
        >
          {departmentForm.id
            ? "עריכת מחלקה"
            : "מחלקה חדשה"}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={
              2
            }
            sx={{
              pt:
                1,
            }}
          >
            <TextField
              fullWidth
              label="שם מחלקה"
              value={
                departmentForm.name
              }
              onChange={(
                event,
              ) =>
                setDepartmentForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    name:
                      event.target.value,
                  }),
                )
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={
                3
              }
              label="תיאור"
              value={
                departmentForm.description
              }
              onChange={(
                event,
              ) =>
                setDepartmentForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    description:
                      event.target.value,
                  }),
                )
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDepartmentDialogOpen(
                false,
              )
            }
          >
            ביטול
          </Button>

          <Button
            variant="contained"
            onClick={
              saveDepartment
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          areaDialogOpen
        }
        onClose={() =>
          setAreaDialogOpen(
            false,
          )
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight:
              900,
          }}
        >
          {areaForm.id
            ? "עריכת אזור / קבוצה"
            : "אזור / קבוצה חדשים"}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={
              2
            }
            sx={{
              pt:
                1,
            }}
          >
            <TextField
              fullWidth
              label="שם אזור / קבוצה"
              value={
                areaForm.name
              }
              onChange={(
                event,
              ) =>
                setAreaForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    name:
                      event.target.value,
                  }),
                )
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={
                3
              }
              label="תיאור"
              value={
                areaForm.description
              }
              onChange={(
                event,
              ) =>
                setAreaForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    description:
                      event.target.value,
                  }),
                )
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setAreaDialogOpen(
                false,
              )
            }
          >
            ביטול
          </Button>

          <Button
            variant="contained"
            onClick={
              saveArea
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          moveDialogOpen
        }
        onClose={() =>
          setMoveDialogOpen(
            false,
          )
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight:
              900,
          }}
        >
          העברת נכס
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={
              2
            }
            sx={{
              pt:
                1,
            }}
          >
            <FormControl
              fullWidth
            >
              <InputLabel>
                מחלקת יעד
              </InputLabel>

              <Select
                label="מחלקת יעד"
                value={
                  moveForm.departmentId
                }
                onChange={(
                  event,
                ) =>
                  setMoveForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      departmentId:
                        event.target.value,

                      areaId:
                        "",

                      parentAssetId:
                        "",
                    }),
                  )
                }
              >
                {structureData.departments.map(
                  (department) => (
                    <MenuItem
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {
                        department.name
                      }
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
            >
              <InputLabel>
                אזור / קבוצה
              </InputLabel>

              <Select
                label="אזור / קבוצה"
                value={
                  moveForm.areaId
                }
                onChange={(
                  event,
                ) =>
                  setMoveForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      areaId:
                        event.target.value,

                      parentAssetId:
                        "",
                    }),
                  )
                }
              >
                <MenuItem value="">
                  ללא אזור / קבוצה
                </MenuItem>

                {moveAreas.map(
                  (area) => (
                    <MenuItem
                      key={
                        area.id
                      }
                      value={
                        area.id
                      }
                    >
                      {
                        area.name
                      }
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
            >
              <InputLabel>
                נכס אב
              </InputLabel>

              <Select
                label="נכס אב"
                value={
                  moveForm.parentAssetId
                }
                onChange={(
                  event,
                ) =>
                  setMoveForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      parentAssetId:
                        event.target.value,
                    }),
                  )
                }
              >
                <MenuItem value="">
                  ללא נכס אב
                </MenuItem>

                {possibleParents.map(
                  (asset) => (
                    <MenuItem
                      key={
                        asset.id
                      }
                      value={
                        asset.id
                      }
                    >
                      {
                        getAssetLabel(
                          asset,
                        )
                      }
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setMoveDialogOpen(
                false,
              )
            }
          >
            ביטול
          </Button>

          <Button
            variant="contained"
            onClick={
              saveMove
            }
            disabled={
              !moveForm.departmentId
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            העבר נכס
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}