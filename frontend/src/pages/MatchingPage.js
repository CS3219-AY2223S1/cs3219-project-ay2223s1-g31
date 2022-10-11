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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../api/axios";
import { URL_COLLAB_SVC, URL_QUESTION_SVC } from "../configs";
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
  const [difficulty, setDifficulty] = useState(Difficulty.NONE);
  const [isFinding, setIsFinding] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // useEffect(() => {
  //   setWaitingTime(0);
  //   const clearInterval = setInterval(() => {
  //     setWaitingTime((t) => t + 1);
  //   }, 1000);
  //   return () => {
  //     clearInterval();
  //   };
  // }, [isFinding]);

  const handleFindMatch = (e) => {
    e.preventDefault();

    if (difficulty === Difficulty.NONE) {
      enqueueSnackbar("Please choose the difficulty!", { variant: "warning" });
      return;
    }

    setIsFinding(true);
    setWaitingTime(0);
    const intervalId = setInterval(() => {
      setWaitingTime((t) => t + 1);
    }, 1000);
    setIntervalId(intervalId);
  };

  const handleCancelFindMatch = () => {
    setIsFinding(false);
    intervalId && clearInterval(intervalId);
    setIntervalId(null);
  };

  return (
    <Box>
      <Typography variant="h3">Choose your difficulty</Typography>
      <form onSubmit={handleFindMatch}>
        <FormControl disabled={isFinding}>
          <DifficultyOptions
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ maxWidth: 200 }}
            disabled={isFinding}
          >
            Find Match
          </Button>
        </FormControl>
      </form>
      <CollabRoomTest difficulty={difficulty} />
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
