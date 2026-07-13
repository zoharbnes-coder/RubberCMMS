import { Grid } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function KpiGrid({
  children,
}: Props) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 3,
      }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                xl: 2,
              }}
            >
              {child}
            </Grid>
          ))
        : (
          <Grid
            size={{
              xs: 12,
            }}
          >
            {children}
          </Grid>
        )}
    </Grid>
  );
}