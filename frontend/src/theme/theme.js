import { createTheme } from "@mui/material/styles";
import { customDarkPalette, customLightPalette } from "./custom-palette";
import customTypographies from "./custom-typographies";

export const customDarkTheme = createTheme({
  palette: customDarkPalette,
  typography: customTypographies,
  //   components: {
  //     MuiButton: customButtons,
  //   },
});

export const customLightTheme = createTheme({
  palette: customLightPalette,
  typography: customTypographies,
  //   components: {
  //     MuiButton: customButtons,
  //   },
});
