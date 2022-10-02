import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { URI_COLLAB_SVC, URL_COLLAB_SVC } from "../configs";
import RealtimeEditor from "../components/RealtimeEditor";
import { useAuth } from "../utils/AuthContext";
import axios from "../api/axios";

function RoomPage() {
  const { roomId } = useParams();
  const { auth } = useAuth();
  const initialCode = "def add(a, b):\n    return a + b\n\nprint(add(2, 3))";
  const [socket, setSocket] = useState(null);
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

  useEffect(() => {
    (async () => {
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
    })();
  });

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
  }, []);

  return roomFound ? (
    <Box width={"100%"}>
      <Typography variant="h2">Room</Typography>
      <Typography>Hello {auth.username}</Typography>
      <Typography>Users in room: {usersInRoom.join(", ")}</Typography>
      <RealtimeEditor value={code} onChange={handleOnEditorChange} />
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
