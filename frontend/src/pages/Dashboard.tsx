import { Box, Card, CardContent, Typography } from "@mui/material";

const stats = [
  { title: "קריאות פתוחות", value: "14", color: "#2563EB" },
  { title: "מכונות מושבתות", value: "2", color: "#DC2626" },
  { title: "זמינות", value: "96.8%", color: "#16A34A" },
  { title: "נסגרו היום", value: "18", color: "#16A34A" },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        Maintenance Control Center
      </Typography>

      <Typography component="p" sx={{ color: "text.secondary", mb: 4 }}>
        תמונת מצב אחזקה בזמן אמת
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {stats.map((item) => (
          <Card key={item.title} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography component="div" sx={{ color: "text.secondary", mb: 1 }}>
                {item.title}
              </Typography>

              <Typography
                component="div"
                variant="h3"
                sx={{ fontWeight: 900, color: item.color }}
              >
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}