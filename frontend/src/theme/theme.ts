import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  direction: "rtl",

  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
      light: "#DBEAFE",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#475569",
      dark: "#334155",
      light: "#E2E8F0",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#16A34A",
      dark: "#15803D",
      light: "#DCFCE7",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#D97706",
      dark: "#B45309",
      light: "#FEF3C7",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#DC2626",
      dark: "#B91C1C",
      light: "#FEE2E2",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#0284C7",
      dark: "#0369A1",
      light: "#E0F2FE",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F4F7FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily:
      '"Heebo", "Arial", "Segoe UI", sans-serif',

    htmlFontSize: 16,
    fontSize: 13,

    h1: {
      fontSize: "1.8rem",
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },

    h2: {
      fontSize: "1.45rem",
      fontWeight: 900,
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
    },

    h3: {
      fontSize: "1.2rem",
      fontWeight: 800,
      lineHeight: 1.3,
    },

    h4: {
      fontSize: "1.55rem",
      fontWeight: 900,
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
    },

    h5: {
      fontSize: "1.2rem",
      fontWeight: 900,
      lineHeight: 1.3,
    },

    h6: {
      fontSize: "1rem",
      fontWeight: 800,
      lineHeight: 1.35,
    },

    subtitle1: {
      fontSize: "0.9rem",
      fontWeight: 700,
      lineHeight: 1.45,
    },

    subtitle2: {
      fontSize: "0.8rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },

    body1: {
      fontSize: "0.84rem",
      lineHeight: 1.55,
    },

    body2: {
      fontSize: "0.76rem",
      lineHeight: 1.5,
    },

    button: {
      fontSize: "0.78rem",
      fontWeight: 800,
      lineHeight: 1.2,
      textTransform: "none",
    },

    caption: {
      fontSize: "0.7rem",
      lineHeight: 1.4,
    },

    overline: {
      fontSize: "0.66rem",
      fontWeight: 800,
      lineHeight: 1.5,
      letterSpacing: "0.04em",
    },
  },

  shape: {
    borderRadius: 10,
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },

        html: {
          width: "100%",
          minHeight: "100%",
          backgroundColor: "#F4F7FB",
        },

        body: {
          width: "100%",
          minHeight: "100%",
          margin: 0,
          overflowX: "hidden",
          backgroundColor: "#F4F7FB",
          color: "#0F172A",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },

        "#root": {
          width: "100%",
          minHeight: "100vh",
        },

        "::-webkit-scrollbar": {
          width: 9,
          height: 9,
        },

        "::-webkit-scrollbar-track": {
          background: "#EEF2F7",
        },

        "::-webkit-scrollbar-thumb": {
          background: "#CBD5E1",
          borderRadius: 10,
          border: "2px solid #EEF2F7",
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: "#94A3B8",
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          backgroundImage: "none",
          boxShadow:
            "0 3px 12px rgba(15, 23, 42, 0.055)",
          transition:
            "box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,

          "&:last-child": {
            paddingBottom: 16,
          },

          "@media (min-width: 1536px)": {
            padding: 18,

            "&:last-child": {
              paddingBottom: 18,
            },
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 38,
          borderRadius: 9,
          paddingInline: 15,
          paddingBlock: 8,
          whiteSpace: "nowrap",
        },

        sizeSmall: {
          minHeight: 32,
          paddingInline: 11,
          paddingBlock: 6,
          fontSize: "0.72rem",
        },

        sizeLarge: {
          minHeight: 44,
          paddingInline: 18,
          paddingBlock: 10,
          fontSize: "0.84rem",
        },

        contained: {
          boxShadow: "none",

          "&:hover": {
            boxShadow:
              "0 5px 14px rgba(37, 99, 235, 0.2)",
          },
        },

        outlined: {
          borderColor: "#CBD5E1",

          "&:hover": {
            borderColor: "#94A3B8",
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 38,
          height: 38,
          borderRadius: 9,
        },

        sizeSmall: {
          width: 32,
          height: 32,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          height: 28,
          borderRadius: 8,
          fontSize: "0.72rem",
          fontWeight: 800,
        },

        sizeSmall: {
          height: 24,
          fontSize: "0.68rem",
        },

        label: {
          paddingInline: 9,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 9,
          backgroundColor: "#FFFFFF",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1.5,
          },

          "& textarea": {
            lineHeight: 1.5,
            fontSize: "0.8rem",
          },
        },

        input: {
          paddingBlock: 10,
          paddingInline: 12,
          fontSize: "0.8rem",
        },

        notchedOutline: {
          borderColor: "#CBD5E1",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.78rem",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 38,
          fontSize: "0.8rem",
          borderRadius: 7,
          marginInline: 5,
          marginBlock: 2,
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: "0.8rem",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingBlock: 7,
          paddingInline: 12,
          fontSize: "0.78rem",
          alignItems: "center",
        },

        message: {
          paddingBlock: 2,
          width: "100%",
        },

        icon: {
          paddingBlock: 2,
          marginLeft: 8,
          marginRight: 0,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E2E8F0",
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 999,
          backgroundColor: "#E2E8F0",
        },

        bar: {
          borderRadius: 999,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingBlock: 9,
          paddingInline: 12,
          borderColor: "#E2E8F0",
          fontSize: "0.77rem",
        },

        head: {
          fontWeight: 900,
          color: "#334155",
          backgroundColor: "#F8FAFC",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 24px 70px rgba(15, 23, 42, 0.2)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "16px 20px 10px",
          fontSize: "1.1rem",
          fontWeight: 900,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "12px 20px 18px",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "10px 20px 18px",
          gap: 8,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 7,
          fontSize: "0.7rem",
          backgroundColor: "#0F172A",
        },
      },
    },
  },
});