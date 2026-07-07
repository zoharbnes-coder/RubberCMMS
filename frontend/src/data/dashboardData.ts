import BuildIcon from "@mui/icons-material/Build";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export const dashboardStats = [
  {
    title: "קריאות פתוחות",
    value: "14",
    color: "#2563EB",
    icon: BuildIcon,
    subtitle: "▲ 3 מהבוקר",
  },
  {
    title: "מכונות מושבתות",
    value: "2",
    color: "#DC2626",
    icon: WarningAmberIcon,
    subtitle: "דורש טיפול מיידי",
  },
  {
    title: "זמינות",
    value: "96.8%",
    color: "#16A34A",
    icon: TrendingUpIcon,
    subtitle: "יעד: 98%",
  },
  {
    title: "נסגרו היום",
    value: "18",
    color: "#16A34A",
    icon: CheckCircleIcon,
    subtitle: "קצב טוב",
  },
];

export const openCalls = [
  {
    machine: "REP-539",
    fault: "אין לחץ הידראולי",
    priority: "גבוהה",
    color: "error",
  },
  {
    machine: "BatchOff-109",
    fault: "תקלה ב-WigWag",
    priority: "בינונית",
    color: "warning",
  },
  {
    machine: "Troester-315",
    fault: "חיישן טמפרטורה",
    priority: "נמוכה",
    color: "success",
  },
];

export const topDowntimeMachines = [
  { name: "REP-539", downtime: "18:30", color: "#DC2626" },
  { name: "BatchOff-109", downtime: "14:20", color: "#DC2626" },
  { name: "Banbury-101", downtime: "09:45", color: "#F59E0B" },
  { name: "Troester-315", downtime: "06:15", color: "#F59E0B" },
  { name: "Gomix-314", downtime: "04:50", color: "#16A34A" },
];

export const plantDepartments = [
  {
    name: "מחלקת תערובות",
    machines: [
      { name: "101 - Banbury", status: "תקין", color: "#16A34A", workOrder: "-" },
      { name: "109 - BatchOff VMI", status: "מושבת", color: "#DC2626", workOrder: "202607-0008" },
      { name: "9D - Mixer", status: "בטיפול", color: "#F59E0B", workOrder: "202607-0009" },
    ],
  },
  {
    name: "מחלקת פרופילים",
    machines: [
      { name: "315 - Troester 120", status: "תקין", color: "#16A34A", workOrder: "-" },
      { name: "314 - Gomix 90", status: "תקין", color: "#16A34A", workOrder: "-" },
    ],
  },
  {
    name: "מחלקת מוצרים טכניים",
    machines: [
      { name: "539 - REP", status: "מושבת", color: "#DC2626", workOrder: "202607-0011" },
      { name: "221 - Press", status: "תקין", color: "#16A34A", workOrder: "-" },
    ],
  },
];