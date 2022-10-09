import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { URL_USER_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";

function ProfilePage() {
  const { auth, clearAuth } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const [formValue, setFormValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormValue({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const deleteAccount = async () => {
    try {
      const res = await axios.delete(URL_USER_SVC);
      console.log(res);
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

  const handleDeleteAccount = () => {
    confirm({
      title: "Delete account?",
      description:
        "This action is reversible, are you sure you want to delete your account?",
      confirmationText: "Delete",
    })
      .then(() => {
        deleteAccount();
      })
      .catch(() => {});
  };

  const handleLoggingOut = async () => {
    try {
      const res = await axios.post(URL_USER_SVC + "/logout");
      console.log(res);
      clearAuth();
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

  const handleChangePassword = async () => {
    if (formValue.newPassword !== formValue.confirmNewPassword) {
      enqueueSnackbar("New password and confirm new password does not match!", {
        variant: "warning",
      });
      return;
    }
    try {
      const res = await axios.post(URL_USER_SVC + "/changePassword", formValue);
      handleLoggingOut();
      console.log(res);
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

  return (
    <div>
      <Typography variant={"h3"} mb={"2rem"}>
        Profile
      </Typography>
      <Typography mb={2}>Username: {auth.username}</Typography>
      <Button onClick={handleLoggingOut}>Logout</Button>
      <Button onClick={() => setDialogOpen(true)}>Change password</Button>
      <Button color="error" onClick={handleDeleteAccount}>
        Delete account
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle>Change password</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Old password"
            variant="standard"
            required
            value={formValue.oldPassword}
            onChange={(e) =>
              setFormValue((formValue) => ({
                ...formValue,
                oldPassword: e.target.value,
              }))
            }
            type="password"
            // sx={{ marginBottom: "1rem" }}
            autoFocus
          />
          <TextField
            label="New password"
            variant="standard"
            required
            value={formValue.newPassword}
            onChange={(e) =>
              setFormValue((formValue) => ({
                ...formValue,
                newPassword: e.target.value,
              }))
            }
            type="password"
            // sx={{ marginBottom: "2rem" }}
          />
          <TextField
            label="Confirm new password"
            variant="standard"
            required
            value={formValue.confirmNewPassword}
            onChange={(e) =>
              setFormValue((formValue) => ({
                ...formValue,
                confirmNewPassword: e.target.value,
              }))
            }
            type="password"
            // sx={{ marginBottom: "2rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleChangePassword} color={"error"}>
            Change password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
