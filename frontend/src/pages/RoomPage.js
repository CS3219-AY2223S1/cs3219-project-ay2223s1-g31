import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import {
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { marked } from "marked";
import htmlParse from "html-react-parser";
import { URI_COLLAB_SVC, URL_COLLAB_SVC } from "../configs";
import { stringToColor } from "../utils/avatar-utils";
import RealtimeEditor from "../components/RealtimeEditor";
import { useAuth } from "../utils/AuthContext";
import axios from "../api/axios";
import { useSnackbar } from "notistack";
import { useDarkTheme } from "../theme/ThemeContextProvider";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const initialCode = "";
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState({
    title: "",
    difficulty: "",
    question: "",
    template: "",
    tags: [],
    createdAt: "",
    updatedAt: "",
  });
  const [code, setCode] = useState(question.template);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [roomFound, setRoomFound] = useState(false);

  const emitCodeChange = (socket, value) => {
    socket.emit("code-changed", value);
  };
  const emitCodeChangeDebounced = useCallback(debounce(emitCodeChange, 100), [
    socket,
  ]);

  const handleOnEditorChange = (value, viewUpdate) => {
    setCode(value);
    if (!viewUpdate.state.values[0].prevUserEvent) return;
    emitCodeChangeDebounced(socket, value);
  };

  const leaveRoom = async () => {
    try {
      const res = await axios.delete(URL_COLLAB_SVC + "/room/" + roomId);
      socket.emit("leave-room", { roomId, username: auth.username });
      navigate("/matching", { replace: true });
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
      console.log(err);
    }
  };

  const handleLeaveRoom = () => {
    confirm({
      title: "Leave room?",
      description: "Are you sure you want to leave room?",
      confirmationText: "Leave",
    })
      .then(() => {
        leaveRoom();
      })
      .catch(() => {});
  };

  const fetchRoomInfo = async () => {
    try {
      const response = await axios.get(URL_COLLAB_SVC + "/room/" + roomId);
      if (!response.data.exists) {
        setRoomFound(false);
        return;
      }
      setRoomFound(true);
    } catch (err) {
      setRoomFound(false);
      console.error(err);
    }
  };
  const fetchRoomQuestion = async () => {
    try {
      const response = await axios.get(
        URL_COLLAB_SVC + "/roomQuestion/" + roomId
      );
      console.log(response.data);
      setQuestion(response.data);
      setCode(response.data.template);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoomInfo();
    fetchRoomQuestion();
  }, []);

  useEffect(() => {
    const socket = io(URI_COLLAB_SVC, {
      transports: ["websocket"],
    });
    setSocket(socket);
    socket.on("connect", () => {
      socket.emit("connected-to-room", { roomId, username: auth.username });
    });
    socket.on("room:connection", (users) => {
      setUsersInRoom(users);
    });
    socket.on("disconnect", () => {
      socket.emit("disconnect-from-room", { roomId });
    });
    socket.on("code-changed", (code) => {
      setCode(code);
    });
    socket.on("leave-room", () => {
      enqueueSnackbar("Your peer left the session");
      navigate("/matching", { replace: true });
    });
    return () => {
      socket.emit("disconnect-from-room", { roomId });
      socket.close();
    };
  }, []);

  return roomFound ? (
    <Box
      width={"100%"}
      position={"absolute"}
      top={"90px"}
      paddingRight={4}
      paddingLeft={4}
      display={"flex"}
      height={"80vh"}
      gap={2}
    >
      <Paper
        variant="outlined"
        sx={(theme) => ({
          padding: "20px 20px",
          flex: 2,
          overflow: "scroll",
          borderColor: theme.palette.grey[600],
        })}
      >
        <QuestionDisplay question={question} />
      </Paper>
      <Box flex={3} display={"flex"} flexDirection={"column"} gap={2}>
        <Paper
          variant="outlined"
          sx={(theme) => ({
            overflow: "scroll",
            borderColor: theme.palette.grey[600],
            flex: 3,
          })}
        >
          <RealtimeEditor value={code} onChange={handleOnEditorChange} />
        </Paper>
        <Paper
          variant="outlined"
          sx={(theme) => ({
            overflow: "scroll",
            borderColor: theme.palette.grey[600],
            flex: 1,
          })}
        >
          <Typography variant="h4">Here goes the chat</Typography>
        </Paper>
      </Box>
      <Fab
        color="error"
        onClick={handleLeaveRoom}
        sx={{ position: "fixed", right: 30, bottom: 30 }}
      >
        <ExitToAppIcon />
      </Fab>
    </Box>
  ) : (
    <RoomNotFound />
  );
}

function RoomNotFound() {
  return (
    <Box>
      <Typography>Room not found!</Typography>
    </Box>
  );
}

function QuestionDisplay({ question }) {
  const { isDarkTheme } = useDarkTheme();
  const difficultyChipColor =
    question.difficulty === "easy"
      ? "success"
      : question.difficulty === "medium"
      ? "warning"
      : "error";
  return (
    <>
      <Typography variant="h4">{question.title}</Typography>
      <Divider />
      <Stack direction={"row"} gap={1} alignItems={"center"} paddingTop={2}>
        <Chip
          label={question.difficulty}
          size={"small"}
          color={difficultyChipColor}
        />
        {question.tags.map((t) => (
          <Chip
            key={t}
            label={t}
            // variant={"outlined"}
            size={"small"}
            sx={(theme) => ({
              color: theme.palette.getContrastText(stringToColor(t)),
              borderColor: stringToColor(t),
              backgroundColor: stringToColor(t),
            })}
          />
        ))}
      </Stack>
      {/* <Typography>Users in room: {usersInRoom.join(", ")}</Typography> */}
      <div className={isDarkTheme ? "markdown-dark" : "markdorm-light"}>
        {htmlParse(marked(question.question))}
      </div>
    </>
  );
}

export default RoomPage;
