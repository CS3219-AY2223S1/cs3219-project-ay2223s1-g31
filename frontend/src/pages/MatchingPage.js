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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../api/axios";
import io from "../utils/socket";
import {
  URI_MATCH_SVC,
  URL_COLLAB_SVC,
  URL_QUESTION_SVC,
  URL_HISTORY_SVC,
} from "../configs";
import { useAuth } from "../utils/AuthContext";
import CircularProgressLabelled from "../components/CircularProgressLabelled";
import { CODE_CACHE_KEY } from "./RoomPage";

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  NONE: "",
};

function MatchingPage() {
  const MAX_WAITING_TIME = 30;
  const { auth } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(Difficulty.NONE);
  const [isFinding, setIsFinding] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [waitingTime, setWaitingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    io.init(URI_MATCH_SVC);
    const socket = io.get(); // io is just the "socket" imported from socket.js
    setSocket(socket);
    socket.on("connect", () => {
      console.log("connection is listened.");
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    // if there is a match
    if (!socket) return;
    socket.on("match-success", async (data) => {
      try {
        const { room_id, username1, username2 } = data;
        console.log("Matched, room id is: " + room_id);
        localStorage.setItem("room_id", room_id);
        console.log("RESET match-success " + intervalId);
        if (auth.username === username1) {
          const res = await createRoom(room_id, username1, username2);
          console.log(res);
          console.log(!res);
        }
        resetLoading();
        setRoomId(room_id);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Cannot send matching request!", { variant: "error" });
        resetLoading();
      }
    });

    socket.on("match-failure", () => {
      enqueueSnackbar("Cannot find match!", { variant: "error" });
      resetLoading();
    });
  }, [intervalId, socket]);

  useEffect(() => {
    if (waitingTime >= MAX_WAITING_TIME) {
      handleCancelFindMatch();
      return;
    }
  }, [waitingTime]);

  const handleFindMatch = (e) => {
    e.preventDefault();

    if (difficulty === Difficulty.NONE) {
      enqueueSnackbar("Please choose the difficulty!", { variant: "warning" });
      return;
    }

    setIsFinding(true);
    setWaitingTime(0);
    const currIntervalId = setInterval(() => {
      setWaitingTime((t) => t + 1);
    }, 1000);
    console.log("Interval " + currIntervalId);
    setIntervalId(currIntervalId);

    // find match
    socket.emit("find-match", {
      username: auth.username,
      difficulty,
      start_time: new Date().getTime(),
      socket_id: socket.id,
    });
  };

  const handleCancelFindMatch = () => {
    resetLoading();
    const socket_id = socket.id;
    socket.emit("cancel-match", { username: auth.username, socket_id });
  };

  const resetLoading = () => {
    setIsFinding(false);
    setWaitingTime(0);
    clearInterval(intervalId);
    console.log("Clear " + intervalId);
    setIntervalId(null);
  };

  const createRoom = async (roomId, username1, username2) => {
    try {
      if (!difficulty) {
        console.error("No difficulty!");
        return;
      }
      const response1 = await axios.get(URL_QUESTION_SVC + "/" + difficulty);
      const question = response1.data;
      const response2 = await axios.post(URL_COLLAB_SVC + "/room", {
        roomId,
        username1,
        username2,
        question,
      });
      const response3 = await axios.post(URL_HISTORY_SVC, {
        username1,
        username2,
        roomId,
        question,
      });
      console.log(response2);
      return { ...response2.data };
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.response.data.message);
    }
  };

  const handleJoinRoom = async () => {
    try {
      window.localStorage.removeItem(CODE_CACHE_KEY);
      navigate(`/room/${roomId}`, { replace: true });
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Error recording history entry", { variant: "error" });
    }
  };

  return (
    <Box width={"100%"} maxWidth={1000}>
      <Typography variant="h3">Choose your difficulty</Typography>
      <form onSubmit={handleFindMatch}>
        <FormControl
          disabled={isFinding}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <DifficultyOptions
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "100%", maxWidth: 400 }}
            disabled={isFinding}
          >
            Find Match
          </Button>
        </FormControl>
      </form>
      <Dialog
        open={isFinding}
        onClose={handleCancelFindMatch}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle mb={4}>Finding match...</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            // paddingTop: 4,
            // paddingBottom: 4,
          }}
        >
          {/* <CircularProgress size={60} /> */}
          <CircularProgressLabelled
            value={waitingTime}
            maxValue={MAX_WAITING_TIME}
            size={80}
          />
          <Typography>Matching you with a peer...</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCancelFindMatch}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!roomId} onClose={handleJoinRoom} maxWidth={"xs"}>
        <DialogTitle>Match Found</DialogTitle>
        <DialogContent>
          Click join or close dialog to proceed to room
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoinRoom}>Join</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DifficultyOptions({ difficulty, setDifficulty }) {
  const optionTitles = ["easy", "medium", "hard"];
  const optionIcons = ["👶", "🧑‍🦱", "👴"];
  const optionContent = [
    "Really easy questions for baby beginners 🥳🥳",
    "The questions are getting a bit harder but not too hard, you can still do it 💪💪",
    "Match with professional competitive programmers all around the globe 🌏🌍🌎",
  ];
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-evenly"}
      alignItems="center"
      flexWrap={"wrap"}
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
              height: 260,
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
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <CardHeader
                title={optionIcons[idx] + " " + title.toUpperCase()}
                titleTypographyProps={{ variant: "h4", fontWeight: 500 }}
              />
              <CardContent>
                <Typography fontSize={18}>{optionContent[idx]}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
}

export default MatchingPage;
