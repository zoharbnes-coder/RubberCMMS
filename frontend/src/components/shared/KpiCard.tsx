import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export type KpiCardProps = {
  title: string;
  value: string | number;
  color?: string;
  subtitle?: string;
};

export default function KpiCard({
  title,
  value,
  color = "#0F172A",
  subtitle,
}: KpiCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: 13,
            color: "text.secondary",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 28,
            color,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}