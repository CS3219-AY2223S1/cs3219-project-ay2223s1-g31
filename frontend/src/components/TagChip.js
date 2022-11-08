import React from "react";
import { Chip } from "@mui/material";
import { stringToColor } from "../utils/avatar-utils";

function TagChip({ tag, size }) {
  return (
    <Chip
      label={tag}
      size={size}
      sx={(theme) => ({
        color: theme.palette.getContrastText(stringToColor(tag)),
        borderColor: stringToColor(tag),
        backgroundColor: stringToColor(tag),
      })}
    />
  );
}

export default TagChip;
