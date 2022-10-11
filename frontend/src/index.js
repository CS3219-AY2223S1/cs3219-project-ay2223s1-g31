import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { AuthContextProvider } from "./utils/AuthContext";
import ThemeContextProvider from "./theme/ThemeContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeContextProvider>
    <ConfirmProvider
      defaultOptions={{ confirmationButtonProps: { color: "error" } }}
    >
      <SnackbarProvider autoHideDuration={3000} preventDuplicate>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SnackbarProvider>
    </ConfirmProvider>
  </ThemeContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
