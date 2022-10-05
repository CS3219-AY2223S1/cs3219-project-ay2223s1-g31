import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { AuthContextProvider } from "./utils/AuthContext";
import { customDarkTheme, customLightTheme } from "./theme/theme";

const theme = responsiveFontSizes(createTheme(customLightTheme));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <ConfirmProvider
      defaultOptions={{ confirmationButtonProps: { color: "error" } }}
    >
      <SnackbarProvider>
        <AuthContextProvider autoHideDuration={3000} preventDuplicate>
          <CssBaseline />
          <App />
        </AuthContextProvider>
      </SnackbarProvider>
    </ConfirmProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
