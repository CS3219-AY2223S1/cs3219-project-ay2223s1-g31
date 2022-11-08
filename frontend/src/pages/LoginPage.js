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
  Paper,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import axios from "../api/axios";
import React, { useState } from "react";
import { URL_USER_SVC } from "../configs";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import { useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import Link from "../components/Link";

// backend routes
const LOGIN_API = URL_USER_SVC + "/login";

// frontend routes
const REDIRECT_URL = "/matching";
const SIGNUP_URL = "/signup";

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

  const handleLogin = async (e) => {
    e.preventDefault();
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
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      maxWidth={"400px"}
      marginTop={4}
    >
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Typography variant="h3" mb={"2rem"}>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%", paddingTop: 14 }}>
          <TextField
            label="Username"
            variant="outlined"
            required
            value={formValue.username}
            onChange={(e) =>
              setFormValue((formValue) => ({
                ...formValue,
                username: e.target.value,
              }))
            }
            sx={{ marginBottom: "1rem" }}
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            variant="outlined"
            required
            value={formValue.password}
            onChange={(e) =>
              setFormValue((formValue) => ({
                ...formValue,
                password: e.target.value,
              }))
            }
            type="password"
            sx={{ marginBottom: 2 }}
            fullWidth
          />
          <Box
            display={"flex"}
            gap={"20px"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Button variant={"contained"} type="submit" fullWidth>
              Login <LoginIcon fontSize="small" sx={{ ml: 1 }} />
            </Button>
            <Typography mt={2}>
              New user? <Link to={SIGNUP_URL}>Sign up</Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={dialog.open}
        onClose={() => {
          closeDialog();
          isLoginSuccess && navigate(from);
        }}
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoginSuccess ? (
            <Button onClick={() => navigate(from)}>Log in</Button>
          ) : (
            <Button onClick={closeDialog}>Done</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LoginPage;
