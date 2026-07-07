import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  icon?: ReactNode;
  color: string;
  subtitle?: string;
};

export function KpiCard({ title, value, icon, color, subtitle }: KpiCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent>
        <Box sx={{ color, mb: 1, fontSize: 28 }}>{icon}</Box>

        <Typography component="div" sx={{ color: "text.secondary", fontWeight: 800 }}>
          {title}
        </Typography>

        <Typography component="div" variant="h3" sx={{ color, fontWeight: 900 }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography component="div" sx={{ color: "text.secondary", fontSize: 13, mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
