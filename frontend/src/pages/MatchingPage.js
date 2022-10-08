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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../api/axios";
import { URL_COLLAB_SVC, URL_QUESTION_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  NONE: "",
};

function MatchingPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [difficulty, setDifficulty] = useState(Difficulty.NONE);
  const [isFinding, setIsFinding] = useState(false);

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleFindMatch = (e) => {
    e.preventDefault();

    if (difficulty === Difficulty.NONE) {
      enqueueSnackbar("Please choose the difficulty!", { variant: "warning" });
      return;
    }

    setIsFinding(true);
  };

  return (
    <Box>
      <form onSubmit={handleFindMatch}>
        <FormControl>
          <FormLabel>Difficulty</FormLabel>
          <RadioGroup
            name="difficulty-selector-group"
            value={difficulty}
            onChange={handleDifficultyChange}
          >
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
      {isFinding && (
        <Box>
          <Box>Finding Match ...</Box>
          <LinearProgress />
          <Button onClick={() => setIsFinding(false)}>Cancel</Button>
        </Box>
      )}
      <CollabRoomTest difficulty={difficulty} />
    </Box>
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
