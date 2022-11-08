import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

function CircularProgressLabelled(props) {
  const value = Math.min(props.value, props.maxValue);
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={(value / props.maxValue) * 100}
        size={props.size}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressLabelled;
