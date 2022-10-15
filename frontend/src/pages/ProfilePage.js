import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Stack,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "../api/axios";
import { URL_HISTORY_SVC, URL_USER_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { stringAvatar } from "../utils/avatar-utils";
import DifficultyChip from "../components/DifficultyChip";
import TagChip from "../components/TagChip";

function ProfilePage() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const [formValue, setFormValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "dateTime",
      type: "dateTime",
      headerName: "Date/Time",
      width: 140,
      valueGetter: ({ value }) => value && new Date(value),
      valueFormatter: ({ value }) =>
        value && moment(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      field: "peer",
      headerName: "Peer",
      width: 100,
    },
    {
      field: "roomId",
      headerName: "Room ID",
      width: 140,
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 100,
      renderCell: ({ value }) => (
        <DifficultyChip
          difficulty={value}
          size={"small"}
          variant={"outlined"}
        />
      ),
    },
    {
      field: "question",
      headerName: "Question",
      width: 160,
    },
    {
      field: "tags",
      headerName: "Tags",
      sortable: false,
      width: 240,
      renderCell: ({ value }) => (
        <Stack direction={"row"} gap={1}>
          {value.map((t) => (
            <TagChip tag={t} size={"small"} />
          ))}
        </Stack>
      ),
    },
  ];

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

  const handleChangePassword = async () => {
    if (formValue.newPassword !== formValue.confirmNewPassword) {
      enqueueSnackbar("New password and confirm new password does not match!", {
        variant: "warning",
      });
      return;
    }
    try {
      const res = await axios.post(URL_USER_SVC + "/changePassword", formValue);
      logout();
      console.log(res);
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(URL_HISTORY_SVC + "/" + auth.username);
        setRows(res.data);
      } catch (err) {
        console.log(err);
        enqueueSnackbar("Error fetching history information!", {
          variant: "error",
        });
      }
    })();
  }, []);

  return (
    <Box width={"100%"} maxWidth={900}>
      <Typography variant={"h3"} mb={"2rem"}>
        Profile
      </Typography>
      <Paper
        variant={"outlined"}
        sx={{
          display: "flex",
          padding: 8,
          paddingTop: 5,
          paddingBottom: 5,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          borderRadius: 2,
        }}
      >
        <Avatar
          {...stringAvatar(auth?.username)}
          sx={{ width: 160, height: 160, fontSize: 64 }}
        />
        <Box>
          <ListItem>
            <ListItemIcon>
              <PersonIcon fontSize={"large"} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant={"h6"} fontWeight={400}>
                @{auth.username}
              </Typography>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <EventIcon fontSize={"large"} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant={"h6"} fontWeight={400}>
                Joined on{" "}
                {moment(auth.createdAt).format("MMM DD YYYY").toString()}
              </Typography>
            </ListItemText>
          </ListItem>
        </Box>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {rows.length <= 0 ? (
          <Typography
            padding={2}
            variant={"subtitle1"}
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            No history yet
          </Typography>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={50}
            rowsPerPageOptions={[10, 50, 100]}
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
            components={{
              Toolbar: GridToolbar,
            }}
            onCellClick={({ value }, e) => navigator.clipboard.writeText(value)}
            sx={{ borderRadius: 2 }}
          />
        )}
      </Paper>
      <Box display={"flex"} justifyContent={"flex-end"} gap={1} mt={1}>
        <Button onClick={() => setDialogOpen(true)}>Change password</Button>
        <Button color="error" onClick={handleDeleteAccount}>
          Delete account
        </Button>
      </Box>
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
    </Box>
  );
}

export default ProfilePage;
