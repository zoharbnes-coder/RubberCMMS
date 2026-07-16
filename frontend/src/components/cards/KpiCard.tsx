import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  color: string;
  icon?: ReactNode;
  subtitle?: string;
};

export default function KpiCard({
  title,
  value,
  color,
  icon,
  subtitle,
}: KpiCardProps) {
  return (
    <Card
      sx={{
        minHeight: 92,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBFDFF 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          insetBlock: 0,
          insetInlineStart: 0,
          width: 4,
          bgcolor: color,
        }}
      />

      <CardContent
        sx={{
          height: "100%",
          p: {
            xs: 1.4,
            md: 1.6,
          },
          "&:last-child": {
            pb: {
              xs: 1.4,
              md: 1.6,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: icon
              ? "34px minmax(0, 1fr)"
              : "1fr",
            gap: 1.15,
            alignItems: "center",
            minHeight: 60,
          }}
        >
          {icon && (
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2.25,
                bgcolor: `${color}14`,
                color,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,

                "& svg": {
                  fontSize: 20,
                },
              }}
            >
              {icon}
            </Box>
          )}

          <Box
            sx={{
              minWidth: 0,
              display: "grid",
              alignContent: "center",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                fontWeight: 800,
                fontSize: 11.5,
                lineHeight: 1.2,
                mb: 0.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>

            <Typography
              component="div"
              sx={{
                color,
                fontWeight: 900,
                fontSize: {
                  xs: 24,
                  md: 27,
                },
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  mt: 0.55,
                  fontSize: 10.5,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}