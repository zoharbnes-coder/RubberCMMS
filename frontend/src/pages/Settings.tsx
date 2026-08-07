import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FactoryIcon from "@mui/icons-material/Factory";
import NumbersIcon from "@mui/icons-material/Numbers";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import TuneIcon from "@mui/icons-material/Tune";

import UsersSettingsPanel from "../components/settings/UsersSettingsPanel";

import {
  useState,
} from "react";

type SettingsSectionId =
  | "users"
  | "plant_structure"
  | "assets"
  | "failure_categories"
  | "work_orders"
  | "shifts"
  | "numbering"
  | "general";

type SettingsSection = {
  id:
    SettingsSectionId;

  title:
    string;

  description:
    string;

  icon:
    React.ReactNode;

  status:
    "ready"
    | "planned";
};

const SETTINGS_SECTIONS:
  SettingsSection[] = [
  {
    id:
      "users",

    title:
      "משתמשים והרשאות",

    description:
      "ניהול משתמשים, תפקידים והרשאות גישה למערכת.",

    icon: (
      <AdminPanelSettingsIcon
        fontSize="large"
      />
    ),

    status:
      "ready",
  },

  {
    id:
      "plant_structure",

    title:
      "מבנה המפעל",

    description:
      "מחלקות, אזורים, קבוצות ומבנה ארגוני של המפעל.",

    icon: (
      <ApartmentIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "assets",

    title:
      "נכסים והיררכיה",

    description:
      "הגדרות סוגי נכסים, רמות היררכיה ומבנה Asset.",

    icon: (
      <EngineeringIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "failure_categories",

    title:
      "קטגוריות תקלה",

    description:
      "Failure Modes, קטגוריות תקלה וסיווגי תקלות.",

    icon: (
      <CategoryIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "work_orders",

    title:
      "הגדרות קריאות שירות",

    description:
      "עדיפויות, סטטוסים, סוגי קריאה וכללי עבודה.",

    icon: (
      <TuneIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "shifts",

    title:
      "משמרות ושעות עבודה",

    description:
      "הגדרת שעות פעילות, משמרות וזמני עבודה מתוכננים.",

    icon: (
      <ScheduleIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "numbering",

    title:
      "מספור מערכת",

    description:
      "הגדרת פורמט מספור לקריאות, PM ורשומות מערכת.",

    icon: (
      <NumbersIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },

  {
    id:
      "general",

    title:
      "הגדרות מפעל",

    description:
      "שם מפעל, הגדרות כלליות והתנהגות מערכת.",

    icon: (
      <FactoryIcon
        fontSize="large"
      />
    ),

    status:
      "planned",
  },
];

function getSectionTitle(
  sectionId:
    SettingsSectionId,
): string {
  return (
    SETTINGS_SECTIONS.find(
      (section) =>
        section.id ===
        sectionId,
    )?.title ??
    "הגדרות"
  );
}


function getCurrentUsername():
  string | null {
  const raw =
    localStorage.getItem(
      "rubbercmms_user",
    );

  if (!raw) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(
        raw,
      ) as {
        username?: unknown;
      };

    return typeof parsed.username ===
      "string"
      ? parsed.username
      : null;
  } catch {
    return null;
  }
}

function SettingsSectionPlaceholder({
  sectionId,
  onBack,
}: {
  sectionId:
    SettingsSectionId;

  onBack:
    () => void;
}) {
  return (
    <Box>
      <Box
        sx={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

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
            {getSectionTitle(
              sectionId,
            )}
          </Typography>

          <Typography
            component="p"
            sx={{
              color:
                "text.secondary",
            }}
          >
            אזור זה ייבנה בשלב הבא של מודול ההגדרות.
          </Typography>
        </Box>

        <Typography
          component="button"
          onClick={
            onBack
          }
          sx={{
            border:
              0,

            bgcolor:
              "transparent",

            color:
              "primary.main",

            fontWeight:
              900,

            cursor:
              "pointer",

            fontFamily:
              "inherit",

            fontSize:
              14,
          }}
        >
          חזרה לכל ההגדרות
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius:
            5,

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <CardContent
          sx={{
            py:
              6,

            textAlign:
              "center",
          }}
        >
          <SettingsSuggestIcon
            sx={{
              fontSize:
                56,

              color:
                "text.secondary",

              mb:
                1.5,
            }}
          />

          <Typography
            component="div"
            sx={{
              fontWeight:
                900,

              fontSize:
                18,

              mb:
                0.5,
            }}
          >
            {getSectionTitle(
              sectionId,
            )}
          </Typography>

          <Typography
            component="div"
            sx={{
              color:
                "text.secondary",
            }}
          >
            התשתית מוכנה. נחבר את הנתונים והפעולות בקובץ הבא.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function Settings() {
  const [
    selectedSection,
    setSelectedSection,
  ] =
    useState<SettingsSectionId | null>(
      null,
    );

  if (
    selectedSection
  ) {
    return (
      <Box dir="rtl">
        <Box
          sx={{
            mb:
              2,
          }}
        >
          <Typography
            component="button"
            onClick={() =>
              setSelectedSection(
                null,
              )
            }
            sx={{
              border:
                0,

              bgcolor:
                "transparent",

              color:
                "primary.main",

              fontWeight:
                900,

              cursor:
                "pointer",

              fontFamily:
                "inherit",

              fontSize:
                14,

              p:
                0,
            }}
          >
            חזרה לכל ההגדרות
          </Typography>
        </Box>

        {selectedSection ===
        "users" ? (
          <UsersSettingsPanel
            currentUsername={
              getCurrentUsername()
            }
          />
        ) : (
          <SettingsSectionPlaceholder
            sectionId={
              selectedSection
            }
            onBack={() =>
              setSelectedSection(
                null,
              )
            }
          />
        )}
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Box
        sx={{
          mb:
            3,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight:
              900,

            mb:
              0.5,
          }}
        >
          הגדרות
        </Typography>

        <Typography
          component="p"
          sx={{
            color:
              "text.secondary",

            mb:
              0.75,
          }}
        >
          מרכז ניהול והגדרת RubberMIP
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
          הגדרות מערכת, משתמשים, מבנה מפעל, נכסים וכללי עבודה
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius:
            5,

          mb:
            3,

          bgcolor:
            "#0F172A",

          color:
            "white",

          boxShadow:
            "0 8px 24px rgba(15,23,42,0.12)",
        }}
      >
        <CardContent
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

            py:
              3,
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight:
                  900,

                mb:
                  0.5,
              }}
            >
              System Administration
            </Typography>

            <Typography
              component="p"
              sx={{
                color:
                  "#CBD5E1",
              }}
            >
              שינויים באזור זה משפיעים על תפעול המערכת כולה.
            </Typography>
          </Box>

          <Chip
            label="Management"
            sx={{
              bgcolor:
                "#2563EB",

              color:
                "white",

              fontWeight:
                900,
            }}
          />
        </CardContent>
      </Card>

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",

            lg:
              "repeat(3, minmax(0, 1fr))",

            xl:
              "repeat(4, minmax(0, 1fr))",
          },

          gap:
            2,
        }}
      >
        {SETTINGS_SECTIONS.map(
          (section) => (
            <Card
              key={
                section.id
              }
              sx={{
                borderRadius:
                  4,

                overflow:
                  "hidden",

                boxShadow:
                  "0 8px 24px rgba(15,23,42,0.08)",
              }}
            >
              <CardActionArea
                onClick={() =>
                  setSelectedSection(
                    section.id,
                  )
                }
                sx={{
                  height:
                    "100%",

                  alignItems:
                    "stretch",
                }}
              >
                <CardContent
                  sx={{
                    minHeight:
                      190,

                    display:
                      "flex",

                    flexDirection:
                      "column",
                  }}
                >
                  <Box
                    sx={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "flex-start",

                      gap:
                        1,

                      mb:
                        2,
                    }}
                  >
                    <Box
                      sx={{
                        width:
                          52,

                        height:
                          52,

                        display:
                          "grid",

                        placeItems:
                          "center",

                        borderRadius:
                          3,

                        bgcolor:
                          "#EFF6FF",

                        color:
                          "#2563EB",
                      }}
                    >
                      {
                        section.icon
                      }
                    </Box>

                    <Chip
                      label={
                        section.status ===
                        "ready"
                          ? "השלב הבא"
                          : "מתוכנן"
                      }
                      size="small"
                      color={
                        section.status ===
                        "ready"
                          ? "primary"
                          : "default"
                      }
                      sx={{
                        fontWeight:
                          800,
                      }}
                    />
                  </Box>

                  <Typography
                    component="h2"
                    sx={{
                      fontWeight:
                        900,

                      fontSize:
                        17,

                      mb:
                        0.75,
                    }}
                  >
                    {
                      section.title
                    }
                  </Typography>

                  <Typography
                    component="p"
                    sx={{
                      color:
                        "text.secondary",

                      fontSize:
                        13,

                      lineHeight:
                        1.7,

                      flex:
                        1,
                    }}
                  >
                    {
                      section.description
                    }
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      color:
                        "primary.main",

                      fontWeight:
                        900,

                      fontSize:
                        12,

                      mt:
                        2,
                    }}
                  >
                    פתח הגדרות ←
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ),
        )}
      </Box>
    </Box>
  );
}