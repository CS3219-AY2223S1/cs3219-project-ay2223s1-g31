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
import socket from "../socket.js"
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { URI_MATCH_SVC, URL_MATCH_SVC, URL_COLLAB_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  NONE: "",
};

function MatchingPage() {
  const navigate = useNavigate()
  const {auth} = useAuth();
  const location = useLocation()
  const match_timeout = 30
  let username = ""

  // const [socket, setSocket] = useState(null)
  const [difficulty, setDifficulty] = useState(Difficulty.NONE)
  const [matchFound, setMatchFound] = useState(false)
  const [timer, setTimer] = useState(-1)

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
    // socket.emit('find-match', difficulty, username)
    setTimer(match_timeout)
  }
  
  const handleCreateMatch = async (e) => {
    e.preventDefault()
    username = auth.username;
    try {
      console.log("here in handle create match")

      // init socket
      socket.init(URI_MATCH_SVC)

      // find match
      socket.get().on("connect", async () => {
        const res = await axios.post(URL_MATCH_SVC, {
          username: username,
          difficulty: difficulty,
          start_time: new Date().getTime(),
          socket_id: socket.get().id,
        })
        console.log(res)
      })

      // if there is a match
      socket.get().on("matchSuccess", async (data) => {
        console.log("Matched, room id is: " + data.room_id)
        localStorage.setItem("room_id", data.room_id)
        // navigate("/collab")
      })

      // if there is no match
      socket.get().on("matchUnavai", () => {
        console.log("Unable to find a match!")
      })
      
      setMatchFound(true);
    } catch (err) {
      console.err(err);
    }
  }

  useEffect(() => {
    if (location.state != null && location.state.username != null) {
      username = location.state.username
    }
  })

  // useEffect(() => {
  //   const socket = io(URI_MATCH_SVC, {
  //     transport: ["websocket"],
  //   })
  //   setSocket(socket)
  // })

  // useEffect(() => {
  //   handleCreateMatch()
  // })

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000)
    } else if (timer == 0) {
      socket.get().emit('disconnet-match')
      setMatchFound(false)
    }
  })

  return (
    <Box>
      <form onSubmit={handleCreateMatch}>
        <FormControl>
          <FormLabel>Difficulty</FormLabel>
          <RadioGroup
            name="difficulty-selector-group"
            value={difficulty}
            onChange={handleDifficultyChange}>
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
