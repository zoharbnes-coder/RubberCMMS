import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type {
  FailureParetoItem,
} from "../../services/reliabilityAnalyticsService";

type FailureParetoPanelProps = {
  items:
    FailureParetoItem[];
};

function getBarWidth(
  value:
    number,
  maximum:
    number,
): string {
  if (
    maximum <=
    0
  ) {
    return "0%";
  }

  return `${Math.max(
    4,
    (
      value /
      maximum
    ) *
      100,
  )}%`;
}

export default function FailureParetoPanel({
  items,
}: FailureParetoPanelProps) {
  const maximumDowntime =
    items.reduce(
      (
        maximum,
        item,
      ) =>
        Math.max(
          maximum,
          item.downtimeMinutes,
        ),
      0,
    );

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
            Pareto תקלות – TOP 10
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
            דירוג סוגי תקלות לפי זמן השבתה מצטבר
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
            לא נמצאו נתוני תקלות בתקופה שנבחרה.
          </Typography>
        ) : (
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
            {items.map(
              (
                item,
                index,
              ) => (
                <Box
                  key={
                    item.key
                  }
                  sx={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      {
                        xs:
                          "1fr",

                        md:
                          "56px 1.5fr 3fr 110px 110px",
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
                        "#DC2626",
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

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        item.label
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
                        item.failureCount
                      }{" "}
                      מופעים
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
                    }}
                  >
                    <Box
                      sx={{
                        flex:
                          1,

                        height:
                          14,

                        bgcolor:
                          "#E2E8F0",

                        borderRadius:
                          99,

                        overflow:
                          "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width:
                            getBarWidth(
                              item.downtimeMinutes,
                              maximumDowntime,
                            ),

                          height:
                            "100%",

                          bgcolor:
                            "#DC2626",

                          borderRadius:
                            99,
                        }}
                      />
                    </Box>

                    <Typography
                      component="div"
                      sx={{
                        minWidth:
                          74,

                        textAlign:
                          "left",

                        fontWeight:
                          900,

                        fontSize:
                          12,

                        color:
                          "#DC2626",
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
                      מצטבר
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        fontWeight:
                          900,

                        color:
                          item.cumulativePercent <=
                          80
                            ? "#D97706"
                            : "#64748B",
                      }}
                    >
                      {item.cumulativePercent.toFixed(
                        1,
                      )}
                      %
                    </Typography>
                  </Box>
                </Box>
              ),
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}