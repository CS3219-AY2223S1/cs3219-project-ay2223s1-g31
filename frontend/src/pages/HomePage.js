import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
// import backgroundURL from "../../public/";

function HomePage() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        height: "100vh",
        width: "100vw",
        overflowY: "hidden",
        background: "url(http://localhost:3000/1228014.png)",
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#000000cc" : "#ffffffcc",
          position: "absolute",
          top: 60,
          height: "100vh",
          width: "100vw",
          padding: "10%",
          paddingRight: "20%",
        })}
      >
        <Typography variant={"h1"} fontWeight={"bold"} fontFamily={"Fira Code"}>
          PeerPrep31
          <Box
            component={"span"}
            sx={{ animation: "1s blink step-end infinite", color: "inherit" }}
          >
            _
          </Box>
        </Typography>
        <Typography variant={"h3"} fontWeight={500} fontFamily={"Fira Code"}>
          An interview preparation platform and peer matching system
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
