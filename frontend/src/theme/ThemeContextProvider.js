import React, { useContext, useState } from "react";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { customDarkTheme, customLightTheme } from "./theme";

const lightTheme = responsiveFontSizes(createTheme(customLightTheme));
const darkTheme = responsiveFontSizes(createTheme(customDarkTheme));

export const ThemeContext = React.createContext(false);

function ThemeContextProvider({ children }) {
  const isDarkThemeCache = window.localStorage.getItem("isDarkThemeCache");
  const [isDarkTheme, setIsDarkTheme] = useState(
    isDarkThemeCache
      ? isDarkThemeCache === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const changeToDarkTheme = (newTheme) => {
    setIsDarkTheme(newTheme);
    window.localStorage.setItem("isDarkThemeCache", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, changeToDarkTheme }}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useDarkTheme() {
  return useContext(ThemeContext);
}

export default ThemeContextProvider;
