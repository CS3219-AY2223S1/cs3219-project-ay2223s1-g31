import {
  Box,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "../api/axios";
import React, { useState } from "react";
import { URL_USER_SVC } from "../configs";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

// backend routes
const LOGIN_API = URL_USER_SVC + "/login";

// frontend routes
const REDIRECT_URL = "/matching";

function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || REDIRECT_URL;
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
  });

  const handleLogin = async () => {
    setIsLoginSuccess(false);
    const res = await axios.post(LOGIN_API, formValue).catch((err) => {
      if (err.response.status === STATUS_CODE_BAD_REQUEST) {
        setErrorDialog(err.response.data.message);
      } else if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
        setErrorDialog("Incorrect password!");
      } else {
        setErrorDialog("Please try again later");
      }
    });

    if (res && res.status === STATUS_CODE_OK) {
      setAuth(res.data);
      setSuccessDialog("Login successfully");
      setIsLoginSuccess(true);
    }
  };

  const setSuccessDialog = (msg) => {
    setDialog({
      open: true,
      title: "Success",
      content: msg,
    });
  };

  const setErrorDialog = (msg) => {
    setDialog({
      open: true,
      title: "Error",
      content: msg,
    });
  };

  const closeDialog = () => setDialog((dialog) => ({ ...dialog, open: false }));

  return (
    <Box display={"flex"} flexDirection={"column"} width={"30%"}>
      <Typography variant="h3" mb={"2rem"}>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="standard"
        required
        value={formValue.username}
        onChange={(e) =>
          setFormValue((formValue) => ({
            ...formValue,
            username: e.target.value,
          }))
        }
        sx={{ marginBottom: "1rem" }}
        autoFocus
      />
      <TextField
        label="Password"
        variant="standard"
        required
        value={formValue.password}
        onChange={(e) =>
          setFormValue((formValue) => ({
            ...formValue,
            password: e.target.value,
          }))
        }
        type="password"
        sx={{ marginBottom: "2rem" }}
      />
      <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
        <Button variant={"outlined"} onClick={handleLogin}>
          Login
        </Button>
      </Box>

      <Dialog
        open={dialog.open}
        onClose={() => {
          closeDialog();
          isLoginSuccess && navigate(REDIRECT_URL);
        }}
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoginSuccess ? (
            <Button component={Link} to={from}>
              Log in
            </Button>
          ) : (
            <Button onClick={closeDialog}>Done</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LoginPage;
