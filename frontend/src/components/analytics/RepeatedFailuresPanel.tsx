import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type {
  RepeatedFailureItem,
} from "../../services/reliabilityAnalyticsService";

type RepeatedFailuresPanelProps = {
  items:
    RepeatedFailureItem[];

  onOpenAsset:
    (
      assetNumber:
        string,
    ) => void;
};

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "he-IL",
    {
      dateStyle:
        "short",

      timeStyle:
        "short",
    },
  ).format(
    date,
  );
}

function getOccurrenceColor(
  occurrences:
    number,
): string {
  if (
    occurrences >=
    5
  ) {
    return "#DC2626";
  }

  if (
    occurrences >=
    3
  ) {
    return "#D97706";
  }

  return "#2563EB";
}

export default function RepeatedFailuresPanel({
  items,
  onOpenAsset,
}: RepeatedFailuresPanelProps) {
  return (
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
        <Box
          sx={{
            mb:
              2,
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight:
                900,

              mb:
                0.25,
            }}
          >
            תקלות חוזרות – TOP 10
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
            תקלות שחזרו לפחות פעמיים באותו נכס בתקופה שנבחרה
          </Typography>
        </Box>

        {items.length ===
        0 ? (
          <Typography
            component="p"
            sx={{
              color:
                "text.secondary",

              textAlign:
                "center",

              py:
                5,
            }}
          >
            לא נמצאו תקלות חוזרות בתקופה שנבחרה.
          </Typography>
        ) : (
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
            {items.map(
              (
                item,
                index,
              ) => {
                const occurrenceColor =
                  getOccurrenceColor(
                    item.occurrences,
                  );

                return (
                  <Box
                    key={
                      item.key
                    }
                    role="button"
                    tabIndex={
                      0
                    }
                    onClick={() =>
                      onOpenAsset(
                        item.assetNumber,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        onOpenAsset(
                          item.assetNumber,
                        );
                      }
                    }}
                    sx={{
                      display:
                        "grid",

                      gridTemplateColumns:
                        {
                          xs:
                            "1fr",

                          md:
                            "56px 1.5fr 2fr 100px 120px 150px",
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
                        "#F8FAFC",

                      borderRight:
                        `6px solid ${occurrenceColor}`,

                      cursor:
                        "pointer",

                      transition:
                        "background-color 0.15s ease, transform 0.15s ease",

                      "&:hover":
                        {
                          bgcolor:
                            "#EEF2F7",

                          transform:
                            "translateY(-1px)",
                        },

                      "&:focus-visible":
                        {
                          outline:
                            "3px solid #2563EB",

                          outlineOffset:
                            "2px",
                        },
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontWeight:
                          900,

                        fontSize:
                          18,

                        color:
                          occurrenceColor,
                      }}
                    >
                      #{index +
                        1}
                    </Typography>

                    <Box
                      sx={{
                        minWidth:
                          0,
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
                          item.assetNumber
                        }{" "}
                        -{" "}
                        {
                          item.assetName
                        }
                      </Typography>

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
                          item.department
                        }
                        {item.area
                          ? ` • ${item.area}`
                          : ""}
                      </Typography>
                    </Box>

                    <Typography
                      component="div"
                      sx={{
                        fontWeight:
                          800,

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        item.description
                      }
                    </Typography>

                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color:
                            "text.secondary",

                          fontSize:
                            11,
                        }}
                      >
                        מופעים
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          fontWeight:
                            900,

                          color:
                            occurrenceColor,
                        }}
                      >
                        {
                          item.occurrences
                        }
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color:
                            "text.secondary",

                          fontSize:
                            11,
                        }}
                      >
                        זמן השבתה
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          fontWeight:
                            900,
                        }}
                      >
                        {Math.round(
                          item.downtimeMinutes,
                        )}{" "}
                        דק׳
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        component="div"
                        sx={{
                          color:
                            "text.secondary",

                          fontSize:
                            11,
                        }}
                      >
                        מופע אחרון
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          fontWeight:
                            800,

                          fontSize:
                            12,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {formatDateTime(
                          item.lastOccurrenceAt,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                );
              },
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}