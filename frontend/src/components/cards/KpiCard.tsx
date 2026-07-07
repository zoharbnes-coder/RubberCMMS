import { Card, CardContent, Typography, Box } from "@mui/material";
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
        borderRadius: 5,
        boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
        minHeight: 130,
      }}
    >
      <CardContent>
        <Box sx={{ color, mb: 1 }}>{icon}</Box>

        <Typography component="div" sx={{ color: "text.secondary", fontWeight: 800 }}>
          {title}
        </Typography>

        <Typography component="div" variant="h3" sx={{ color, fontWeight: 900 }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography component="div" sx={{ color: "text.secondary", mt: 1, fontSize: 13 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
