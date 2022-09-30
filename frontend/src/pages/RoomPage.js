import { Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../utils/AuthContext";

function RoomPage() {
  const { auth } = useAuth();
  return (
    <Box width={"96%"}>
      <Typography variant="h2">Room</Typography>
      <Typography>Hello {auth.username}</Typography>
    </Box>
  );
}

export default RoomPage;
