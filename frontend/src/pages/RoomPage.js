import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import {
  Box,
  Divider,
  Fab,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { marked } from "marked";
import htmlParse from "html-react-parser";
import { URI_COLLAB_SVC, URL_COLLAB_SVC } from "../configs";
import RealtimeEditor from "../components/RealtimeEditor";
import { useAuth } from "../utils/AuthContext";
import axios from "../api/axios";
import { useSnackbar } from "notistack";
import { useDarkTheme } from "../theme/ThemeContextProvider";
import DifficultyChip from "../components/DifficultyChip";
import TagChip from "../components/TagChip";

export const CODE_CACHE_KEY = "code-cache";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
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
  const [output, setOutput] = useState([]);
  const [outputError, setOutputError] = useState("");

  const emitCodeChange = (socket, value) => {
    socket.emit("code-changed", value);
  };
  const emitCodeChangeDebounced = useCallback(debounce(emitCodeChange, 50), [
    socket,
  ]);

  const handleOnEditorChange = (value, viewUpdate) => {
    setCode(value);
    window.localStorage.setItem(CODE_CACHE_KEY, value);
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
    window.localStorage.removeItem(CODE_CACHE_KEY);
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

  const handleExecCode = async () => {
    try {
      setOutput(["Executing..."]);
      setOutputError("");
      const response = await axios.post(URL_COLLAB_SVC + "/code", {
        code,
      });
      console.log(response.data);
      if (response.data.error) {
        setOutputError(response.data.error);
      } else if (response.data.output) {
        setOutputError("");
        setOutput(response.data.output);
      } else {
        setOutputError("");
        setOutput([]);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Error executing code!", { variant: "error" });
      setOutput([]);
      setOutputError("");
      return;
    }
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
      if (typeof window.localStorage.getItem(CODE_CACHE_KEY) !== "string") {
        setCode(response.data.template);
      }
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

  useEffect(() => {
    const codeCache = window.localStorage.getItem(CODE_CACHE_KEY);
    console.log("REFRESH");
    console.log(codeCache);
    if (codeCache) {
      console.log("SET CODE");
      console.log(codeCache);
      setCode(codeCache);
      // emitCodeChange(socket, codeCache);
    }
  }, []);

  return roomFound ? (
    <Box width={"100%"} maxWidth={"1200px"} position={"absolute"} top={"90px"}>
      <Box
        paddingRight={4}
        paddingLeft={4}
        display={"flex"}
        height={"600px"}
        gap={1}
      >
        <Box flexShrink={2} display={"flex"} flexDirection={"column"} gap={1}>
          <Paper
            variant="outlined"
            sx={(theme) => ({
              padding: "20px 20px",
              overflow: "scroll",
              borderColor: theme.palette.grey[600],
              flex: 3,
            })}
          >
            <QuestionDisplay question={question} />
          </Paper>
          <Paper
            variant="outlined"
            sx={(theme) => ({
              overflow: "scroll",
              borderColor: theme.palette.grey[600],
              flex: 2,
            })}
          >
            <Typography variant="h4">Here goes the chat</Typography>
          </Paper>
        </Box>
        <Box
          flexBasis={"720px"}
          flexShrink={3}
          display={"flex"}
          flexDirection={"column"}
          gap={1}
        >
          <Paper
            variant="outlined"
            sx={(theme) => ({
              overflow: "scroll",
              maxWidth: "720px",
              borderColor: theme.palette.grey[600],
              flex: 3,
            })}
          >
            <RealtimeEditor value={code} onChange={handleOnEditorChange} />
          </Paper>
          <Paper
            variant="outlined"
            sx={(theme) => ({
              whiteSpace: "pre",
              maxWidth: "720px",
              overflow: "scroll",
              borderColor: theme.palette.grey[600],
              flex: 1,
              padding: 2,
            })}
          >
            {outputError ? (
              <Typography fontFamily={"Fira Code"} color={"error"}>
                {outputError}
              </Typography>
            ) : (
              output.map((o, id) => (
                <Typography fontFamily={"Fira Code"} key={id}>
                  {o}
                </Typography>
              ))
            )}
          </Paper>
        </Box>
        <Box position={"fixed"} right={30} bottom={30} display={"flex"} gap={2}>
          <Tooltip title="Execute code">
            <Fab color="info" onClick={handleExecCode}>
              <PlayArrowIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Leave room">
            <Fab color="error" onClick={handleLeaveRoom}>
              <ExitToAppIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
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
  return (
    <>
      <Typography variant="h4">{question.title}</Typography>
      <Divider />
      <Stack direction={"row"} gap={1} alignItems={"center"} paddingTop={2}>
        <DifficultyChip difficulty={question.difficulty} size={"small"} />
        {question.tags.map((t) => (
          <TagChip key={t} tag={t} size={"small"} />
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
