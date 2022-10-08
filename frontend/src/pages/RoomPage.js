import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { Box, Button, Typography } from "@mui/material";
import { URI_COLLAB_SVC, URL_COLLAB_SVC } from "../configs";
import RealtimeEditor from "../components/RealtimeEditor";
import { useAuth } from "../utils/AuthContext";
import axios from "../api/axios";
import { useSnackbar } from "notistack";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const initialCode = "def add(a, b):\n    return a + b\n\nprint(add(2, 3))";
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(initialCode);
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
    console.log("user input");
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

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(URL_COLLAB_SVC + "/room/" + roomId);
        if (!response.data.exists) {
          setRoomFound(false);
          return;
        }
        setQuestion(response.data.question);
        setCode(response.data.question.template);
        console.log(response.data.question);
        setRoomFound(true);
      } catch (err) {
        setRoomFound(false);
        console.error(err);
      }
    })();
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
    socket.on("code-changed", (code) => {
      setCode(code);
    });
    socket.on("leave-room", () => {
      enqueueSnackbar("Your peer left the session");
      navigate("/matching", { replace: true });
    });
  }, []);

  return roomFound ? (
    <Box width={"100%"}>
      <Typography variant="h2">Room</Typography>
      <Typography>Hello {auth.username}</Typography>
      <Typography>Users in room: {usersInRoom.join(", ")}</Typography>
      <Typography>
        Question: {question.title} ({question.difficulty}) - Tags:{" "}
        {question.tags.join(", ")}
      </Typography>
      <Typography>{question.question}</Typography>
      <RealtimeEditor value={code} onChange={handleOnEditorChange} />
      <Button color="error" onClick={handleLeaveRoom}>
        Leave room
      </Button>
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

export default RoomPage;
