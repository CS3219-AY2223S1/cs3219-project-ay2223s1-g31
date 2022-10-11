import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useEffect, useState } from "react";
import socket from "../socket.js"
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../api/axios";
import { URI_MATCH_SVC, URL_MATCH_SVC, URL_COLLAB_SVC, URL_QUESTION_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import CircularProgressLabelled from "../components/CircularProgressLabelled";

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  NONE: "",
};

function MatchingPage() {
  const MAX_WAITING_TIME = 30;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const {auth} = useAuth();
  const location = useLocation()
  let username = ""

  // const [socket, setSocket] = useState(null)
  const [difficulty, setDifficulty] = useState(Difficulty.NONE)
  const [matchFound, setMatchFound] = useState(false)
  const [timer, setTimer] = useState(-1)
  const [waitingTime, setWaitingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }
  
  const handleCreateMatch = async (e) => {
    e.preventDefault()
    setTimer(MAX_WAITING_TIME)
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

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000)
    } else if (timer == 0) {
      socket.get().emit('disconnet-match')
      setMatchFound(false)
    }
    setWaitingTime(0);
    const intervalId = setInterval(() => {
      setWaitingTime((t) => t + 1);
    }, 1000);
    setIntervalId(intervalId);
  })

  const handleCancelFindMatch = () => {
    setIsFinding(false);
    intervalId && clearInterval(intervalId);
    setIntervalId(null);
  }

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

function DifficultyOptions({ difficulty, setDifficulty }) {
  const optionTitles = ["easy", "medium", "hard"];
  const optionIcons = ["👶", "🧑‍🦱", "👴"];
  const optionContent = [
    "Really easy questions for beginners.",
    "It's getting a bit harder but not too hard.",
    "Wow, so you are professional right?",
  ];
  return (
    <Stack
      direction={"row"}
      justifyContent="space-evenly"
      alignItems="center"
      gap={1}
      pt={2}
      pb={2}
      mt={4}
    >
      {optionTitles.map((title, idx) => {
        return (
          <Card
            variant="outlined"
            sx={(theme) => ({
              flexBasis: "300px",
              flexShrink: 1,
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              transition: "all ease 300ms",
              borderWidth: title === difficulty && "2px",
              borderColor: title === difficulty && theme.palette.primary.main,
              color: title === difficulty && theme.palette.primary.main,
              transform: title === difficulty && "translateY(-10px)",
            })}
            key={title}
          >
            <CardActionArea
              disableRipple
              onClick={() => setDifficulty(title)}
              sx={{
                height: "100%",
              }}
            >
              <CardHeader
                title={optionIcons[idx] + " " + title.toUpperCase()}
                titleTypographyProps={{ variant: "h4" }}
              />
              <CardContent>
                <Typography>{optionContent[idx]}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
}

function CollabRoomTest({ difficulty }) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const { auth } = useAuth();
  const handleCreateRoom = async () => {
    try {
      if (!difficulty) {
        console.error("No difficulty!");
        return;
      }
      const response1 = await axios.get(URL_QUESTION_SVC + "/" + difficulty);
      const question = response1.data;
      const response = await axios.post(URL_COLLAB_SVC + "/room", {
        username: auth.username,
        question,
      });
      const roomId = response.data.roomId;
      navigate(`/room/${roomId}`, { replace: true });
    } catch (err) {
      console.error(err);
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
