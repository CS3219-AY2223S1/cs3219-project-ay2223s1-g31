import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_CONFLICT,
  STATUS_CODE_CREATED,
} from "../constants";
import Link from "../components/Link";

const LOGIN_URL = "/login";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    const res = await axios
      .post(URL_USER_SVC, { username, password })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog("This username already exists");
        } else if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          setErrorDialog("Username and/or Password are missing!");
        } else {
          setErrorDialog("Please try again later");
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog("Account successfully created");
      setIsSignupSuccess(true);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  return (
    <Box
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
        <Typography variant={"h3"} marginBottom={"2rem"}>
          Sign Up
        </Typography>
        <form onSubmit={handleSignup} style={{ width: "100%", paddingTop: 14 }}>
          <TextField
            label="Username"
            variant="standard"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            variant="standard"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
            fullWidth
          />
          <Box
            display={"flex"}
            gap={"20px"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Button variant={"contained"} fullWidth type="submit">
              Sign up <PersonAddAlt1Icon fontSize="small" sx={{ ml: 1 }} />
            </Button>
            <Typography mt={2}>
              Already have an account? <Link to={LOGIN_URL}>Login</Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isSignupSuccess ? (
            <Button component={Link} to="/login">
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

export default SignupPage;
