import { Chip } from "@mui/material";
import React from "react";

function DifficultyChip({ difficulty, size, variant }) {
  const difficultyChipColor =
    difficulty === "easy"
      ? "success"
      : difficulty === "medium"
      ? "warning"
      : "error";
  return (
    <Chip
      label={difficulty}
      size={size}
      color={difficultyChipColor}
      variant={variant}
    />
  );
}

export default DifficultyChip;
