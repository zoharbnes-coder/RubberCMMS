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
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";

import {
  useMemo,
  useState,
} from "react";

import type {
  AppUser,
  UserRole,
} from "../../data/users";

import {
  getPermissionsForRole,
  getPermissionDefinition,
  getRoleDefinition,
  roleDefinitions,
} from "../../auth/permissions";

import {
  createManagedUser,
  deleteManagedUser,
  getManagedUsers,
  updateManagedUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "../../services/userManagementService";

type UsersSettingsPanelProps = {
  currentUsername:
    string | null;
};

type UserFormState = {
  username: string;

  password: string;

  fullName: string;

  role:
    UserRole;
};

const EMPTY_FORM:
  UserFormState = {
  username:
    "",

  password:
    "",

  fullName:
    "",

  role:
    "operator",
};

function getRoleColor(
  role:
    UserRole,
):
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error" {
  if (
    role ===
    "admin"
  ) {
    return "error";
  }

  if (
    role ===
    "manager"
  ) {
    return "secondary";
  }

  if (
    role ===
    "electrician"
  ) {
    return "warning";
  }

  if (
    role ===
    "technician"
  ) {
    return "primary";
  }

  return "default";
}

function getRoleLabel(
  role:
    UserRole,
): string {
  return (
    getRoleDefinition(
      role,
    )?.label ??
    role
  );
}

function buildFormFromUser(
  user:
    AppUser,
): UserFormState {
  return {
    username:
      user.username,

    password:
      user.password,

    fullName:
      user.fullName,

    role:
      user.role,
  };
}

export default function UsersSettingsPanel({
  currentUsername,
}: UsersSettingsPanelProps) {
  const [
    users,
    setUsers,
  ] =
    useState<AppUser[]>(
      getManagedUsers(),
    );

  const [
    dialogOpen,
    setDialogOpen,
  ] =
    useState(
      false,
    );

  const [
    editingUsername,
    setEditingUsername,
  ] =
    useState<string | null>(
      null,
    );

  const [
    form,
    setForm,
  ] =
    useState<UserFormState>(
      EMPTY_FORM,
    );

  const [
    pageMessage,
    setPageMessage,
  ] =
    useState<{
      type:
        "success" |
        "error";

      text:
        string;
    } | null>(
      null,
    );

  const [
    dialogError,
    setDialogError,
  ] =
    useState<string | null>(
      null,
    );

  const selectedPermissions =
    useMemo(
      () =>
        getPermissionsForRole(
          form.role,
        ),
      [
        form.role,
      ],
    );

  function refreshUsers():
    void {
    setUsers(
      getManagedUsers(),
    );
  }

  function openCreateDialog():
    void {
    setEditingUsername(
      null,
    );

    setForm(
      EMPTY_FORM,
    );

    setDialogError(
      null,
    );

    setDialogOpen(
      true,
    );
  }

  function openEditDialog(
    user:
      AppUser,
  ): void {
    setEditingUsername(
      user.username,
    );

    setForm(
      buildFormFromUser(
        user,
      ),
    );

    setDialogError(
      null,
    );

    setDialogOpen(
      true,
    );
  }

  function closeDialog():
    void {
    setDialogOpen(
      false,
    );

    setEditingUsername(
      null,
    );

    setForm(
      EMPTY_FORM,
    );

    setDialogError(
      null,
    );
  }

  function saveUser():
    void {
    if (
      editingUsername
    ) {
      const input:
        UpdateUserInput = {
        username:
          form.username,

        password:
          form.password,

        fullName:
          form.fullName,

        role:
          form.role,
      };

      const result =
        updateManagedUser(
          editingUsername,
          input,
        );

      if (
        !result.success
      ) {
        setDialogError(
          result.message,
        );

        return;
      }

      refreshUsers();

      setPageMessage({
        type:
          "success",

        text:
          result.message,
      });

      closeDialog();

      return;
    }

    const input:
      CreateUserInput = {
      username:
        form.username,

      password:
        form.password,

      fullName:
        form.fullName,

      role:
        form.role,
    };

    const result =
      createManagedUser(
        input,
      );

    if (
      !result.success
    ) {
      setDialogError(
        result.message,
      );

      return;
    }

    refreshUsers();

    setPageMessage({
      type:
        "success",

      text:
        result.message,
    });

    closeDialog();
  }

  function removeUser(
    user:
      AppUser,
  ): void {
    const confirmed =
      window.confirm(
        `למחוק את המשתמש ${user.fullName} (${user.username})?`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    const result =
      deleteManagedUser(
        user.username,
        currentUsername,
      );

    setPageMessage({
      type:
        result.success
          ? "success"
          : "error",

      text:
        result.message,
    });

    if (
      result.success
    ) {
      refreshUsers();
    }
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
            משתמשים והרשאות
          </Typography>

          <Typography
            component="p"
            sx={{
              color:
                "text.secondary",
            }}
          >
            ניהול משתמשים, תפקידים והרשאות גישה למערכת
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={
            openCreateDialog
          }
          sx={{
            minHeight:
              46,

            fontWeight:
              900,
          }}
        >
          משתמש חדש
        </Button>
      </Box>

      {pageMessage && (
        <Alert
          severity={
            pageMessage.type
          }
          sx={{
            mb:
              2,

            borderRadius:
              3,
          }}
          onClose={() =>
            setPageMessage(
              null,
            )
          }
        >
          {
            pageMessage.text
          }
        </Alert>
      )}

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            xl:
              "minmax(0, 1.8fr) minmax(320px, 1fr)",
          },

          gap:
            2,
        }}
      >
        <Card
          sx={{
            borderRadius:
              5,

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

                alignItems:
                  "center",

                mb:
                  2,
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
                משתמשים במערכת
              </Typography>

              <Chip
                label={`${users.length} משתמשים`}
                variant="outlined"
                sx={{
                  fontWeight:
                    900,
                }}
              />
            </Box>

            <Box
              sx={{
                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  1.25,
              }}
            >
              {users.map(
                (user) => {
                  const permissions =
                    getPermissionsForRole(
                      user.role,
                    );

                  const isCurrentUser =
                    currentUsername ===
                    user.username;

                  return (
                    <Box
                      key={
                        user.username
                      }
                      sx={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          {
                            xs:
                              "1fr",

                            md:
                              "1.5fr 1fr 130px 120px",
                          },

                        gap:
                          1.5,

                        alignItems:
                          "center",

                        p:
                          1.75,

                        borderRadius:
                          3,

                        bgcolor:
                          "#F8FAFC",

                        borderRight:
                          isCurrentUser
                            ? "6px solid #2563EB"
                            : "6px solid transparent",
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
                            user.fullName
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
                            user.username
                          }
                          {isCurrentUser
                            ? " • מחובר כעת"
                            : ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            1,

                          flexWrap:
                            "wrap",
                        }}
                      >
                        <Chip
                          label={getRoleLabel(
                            user.role,
                          )}
                          color={getRoleColor(
                            user.role,
                          )}
                          size="small"
                          sx={{
                            fontWeight:
                              900,
                          }}
                        />

                        <Chip
                          label={`${permissions.length} הרשאות`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          <EditIcon />
                        }
                        onClick={() =>
                          openEditDialog(
                            user,
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
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={
                          <DeleteIcon />
                        }
                        onClick={() =>
                          removeUser(
                            user,
                          )
                        }
                        disabled={
                          isCurrentUser
                        }
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        מחיקה
                      </Button>
                    </Box>
                  );
                },
              )}
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius:
              5,

            boxShadow:
              "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  1,

                mb:
                  1,
              }}
            >
              <SecurityIcon
                color="primary"
              />

              <Typography
                component="h3"
                variant="h6"
                sx={{
                  fontWeight:
                    900,
                }}
              >
                מטריצת תפקידים
              </Typography>
            </Box>

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
              ההרשאות נקבעות לפי תפקיד המשתמש.
            </Typography>

            <Box
              sx={{
                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  1.5,
              }}
            >
              {roleDefinitions.map(
                (roleDefinition) => {
                  const permissions =
                    getPermissionsForRole(
                      roleDefinition.role,
                    );

                  return (
                    <Box
                      key={
                        roleDefinition.role
                      }
                      sx={{
                        p:
                          1.5,

                        borderRadius:
                          3,

                        bgcolor:
                          "#F8FAFC",
                      }}
                    >
                      <Box
                        sx={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          gap:
                            1,

                          mb:
                            0.75,
                        }}
                      >
                        <Chip
                          label={
                            roleDefinition.label
                          }
                          color={getRoleColor(
                            roleDefinition.role,
                          )}
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
                              11,
                          }}
                        >
                          {
                            permissions.length
                          }{" "}
                          הרשאות
                        </Typography>
                      </Box>

                      <Typography
                        component="div"
                        sx={{
                          color:
                            "text.secondary",

                          fontSize:
                            12,

                          mb:
                            1,
                        }}
                      >
                        {
                          roleDefinition.description
                        }
                      </Typography>

                      <Box
                        sx={{
                          display:
                            "flex",

                          gap:
                            0.75,

                          flexWrap:
                            "wrap",
                        }}
                      >
                        {permissions.map(
                          (permission) => (
                            <Chip
                              key={
                                permission
                              }
                              label={
                                getPermissionDefinition(
                                  permission,
                                )?.label ??
                                permission
                              }
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize:
                                  10,

                                height:
                                  24,
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </Box>
                  );
                },
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={
          dialogOpen
        }
        onClose={
          closeDialog
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
          {editingUsername
            ? "עריכת משתמש"
            : "יצירת משתמש חדש"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display:
                "grid",

              gap:
                2,

              pt:
                1,
            }}
          >
            {dialogError && (
              <Alert
                severity="error"
              >
                {
                  dialogError
                }
              </Alert>
            )}

            <TextField
              fullWidth
              label="שם מלא"
              value={
                form.fullName
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    fullName:
                      event.target.value,
                  }),
                )
              }
            />

            <TextField
              fullWidth
              label="שם משתמש"
              value={
                form.username
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    username:
                      event.target.value,
                  }),
                )
              }
            />

            <TextField
              fullWidth
              label="סיסמה"
              type="text"
              value={
                form.password
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    password:
                      event.target.value,
                  }),
                )
              }
            />

            <FormControl
              fullWidth
            >
              <InputLabel>
                תפקיד
              </InputLabel>

              <Select
                label="תפקיד"
                value={
                  form.role
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      role:
                        event.target
                          .value as UserRole,
                    }),
                  )
                }
              >
                {roleDefinitions.map(
                  (roleDefinition) => (
                    <MenuItem
                      key={
                        roleDefinition.role
                      }
                      value={
                        roleDefinition.role
                      }
                    >
                      {
                        roleDefinition.label
                      }
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            <Divider />

            <Box>
              <Typography
                component="div"
                sx={{
                  fontWeight:
                    900,

                  mb:
                    1,
                }}
              >
                הרשאות לפי התפקיד
              </Typography>

              <Box
                sx={{
                  display:
                    "flex",

                  gap:
                    0.75,

                  flexWrap:
                    "wrap",
                }}
              >
                {selectedPermissions.map(
                  (permission) => (
                    <Chip
                      key={
                        permission
                      }
                      label={
                        getPermissionDefinition(
                          permission,
                        )?.label ??
                        permission
                      }
                      size="small"
                      variant="outlined"
                    />
                  ),
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px:
              3,

            pb:
              2,
          }}
        >
          <Button
            onClick={
              closeDialog
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            ביטול
          </Button>

          <Button
            variant="contained"
            onClick={
              saveUser
            }
            sx={{
              fontWeight:
                900,
            }}
          >
            {editingUsername
              ? "שמור שינויים"
              : "צור משתמש"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}