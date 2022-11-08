import { Button, Typography, Box } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        height: "100vh",
        width: "100vw",
        overflowY: "hidden",
        background: "url(1228014.webp)",
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#000000aa" : "#ffffffcc",
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
        <Box display={"flex"} flexWrap={"wrap"} gap={4} mt={8}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/signup")}
            disableRipple
            sx={{
              width: 200,
              height: 54,
              fontSize: 20,
              borderWidth: 3,
              fontWeight: 600,
              "&:hover svg": {
                transform: "translateX(16px)",
              },
            }}
            color={"inherit"}
          >
            Sign up
            <KeyboardDoubleArrowRightIcon
              fontSize="medium"
              sx={{ ml: 1, transition: "all 0.5s ease" }}
            />
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/login")}
            disableRipple
            sx={{
              width: 200,
              height: 54,
              fontSize: 20,
              borderWidth: 3,
              fontWeight: 600,
              "&:hover svg": {
                transform: "translateX(16px)",
              },
            }}
            color={"inherit"}
          >
            Login
            <KeyboardDoubleArrowRightIcon
              fontSize="medium"
              sx={{ ml: 1, transition: "all 0.5s ease" }}
            />
          </Button>
        </Box>{" "}
      </Box>
    </Box>
  );
}

export default HomePage;
