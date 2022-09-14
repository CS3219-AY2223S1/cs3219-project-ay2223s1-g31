import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "./utils/AuthContext";
import { SnackbarProvider } from "notistack";

const theme = responsiveFontSizes(createTheme());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <AuthContextProvider autoHideDuration={3000} preventDuplicate>
        <App />
      </AuthContextProvider>
    </SnackbarProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
