import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { URI_MATCH_SVC, URL_MATCH_SVC, URL_COLLAB_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import socket from "../socket.js"

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  NONE: "",
};

function MatchingPage() {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [difficulty, setDifficulty] = useState(Difficulty.NONE)
  const [matchFound, setMatchFound] = useState(false)

  const handleCreateMatch = async () => {
    try {
      setMatchFound(true);
      socket.init(URI_MATCH_SVC);
      socket.get().on("connect", async () => {
        await axios.post(URL_MATCH_SVC, {
          username: "",
          difficulty: difficulty,
          start_time: new Date().getTime(),
          socket_id: socket.get().id,
        })
      })
      socket.get().on("matchSuccess", async (data) => {
        console.log("Matched, room id is: " + data.roomId)
        localStorage.setItem("room_id", data.roomId)
        navigate("/collab")
      })
    } catch (err) {
      console.err(err);
    }
  };

  return (
    <Box>
      <form onSubmit={handleCreateMatch}>
        <FormControl>
          <FormLabel>Difficulty</FormLabel>
          <RadioGroup
            name="difficulty-selector-group"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}>
            <FormControlLabel
              value={Difficulty.EASY}
              control={<Radio />}
              label="Easy"
            />
            <FormControlLabel
              value={Difficulty.MEDIUM}
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel
              value={Difficulty.HARD}
              control={<Radio />}
              label="Hard"
            />
          </RadioGroup>
          <Button type="submit" variant="contained">
            Find Match
          </Button>
        </FormControl>
      </form>
      {matchFound && (
        <Box>
          <Box>Finding Match ...</Box>
          <LinearProgress />
          <Button onClick={() => setMatchFound(false)}>Cancel</Button>
        </Box>
      )}
      <CollabRoomTest />
    </Box>
  );
}

function CollabRoomTest() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const { auth } = useAuth();
  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(URL_COLLAB_SVC + "/room", {
        username: auth.username,
      });
      const roomId = response.data.roomId;
      navigate(`/room/${roomId}`, { replace: true });
    } catch (err) {
      console.err(err);
    }
  };
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await axios.get(URL_COLLAB_SVC + "/room/" + roomId);
      if (!response.data.exists) {
        console.log(response);
        return;
      }
      navigate(`/room/${roomId}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Box display={"flex"} alignItems={"center"} mt={2}>
      <TextField
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        label={"Enter room id..."}
      />
      <Button
        onClick={() => (!!roomId ? handleJoinRoom(roomId) : handleCreateRoom())}
      >
        Join
      </Button>
    </Box>
  );
}

export default MatchingPage;
