import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export const appTheme = createTheme({
  direction: "rtl",

  palette: {
    primary: {
      main: colors.primary,
    },

    secondary: {
      main: colors.secondary,
    },

    success: {
      main: colors.success,
    },

    warning: {
      main: colors.warning,
    },

    error: {
      main: colors.danger,
    },

    info: {
      main: colors.info,
    },

    background: {
      default: colors.background,
      paper: colors.surface,
    },

    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Heebo, Arial, sans-serif",

    h1: {
      fontWeight: 900,
    },

    h2: {
      fontWeight: 800,
    },

    h3: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
    },
  },
});
