import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import RealtimeEditor from "../components/RealtimeEditor";
import { useAuth } from "../utils/AuthContext";

function RoomPage() {
  const { auth } = useAuth();
  const initialCode = "def add(a, b):\n    return a + b\n\nprint(add(2, 3))";
  const [code, setCode] = useState(initialCode);

  const handleOnEditorChange = (value) => {
    setCode(value);
  };

  return (
    <Box width={"100%"}>
      <Typography variant="h2">Room</Typography>
      <Typography>Hello {auth.username}</Typography>
      <RealtimeEditor value={code} onChange={handleOnEditorChange} />
    </Box>
  );
}

export default RoomPage;
