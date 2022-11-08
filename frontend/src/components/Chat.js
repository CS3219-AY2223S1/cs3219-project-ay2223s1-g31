import {
  Avatar,
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Tooltip,
  Container,
  AvatarGroup,
  AppBar,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { URI_COMM_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import { stringAvatar } from "../utils/avatar-utils";

function Chat({ inRoomUsers }) {
  const { auth } = useAuth();
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const inputMessageRef = useRef("");
  const bottomRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!inputMessageRef.current.value) return;

    let message = {
      userId: auth.username,
      text: inputMessageRef.current.value,
    };

    appendMessage(message);
    socket.emit("send-message", { roomId, message });
    e.target.reset();
  };

  const appendMessage = (message) => {
    setMessages((currMessages) => [...currMessages, message]);
  };

  useEffect(() => {
    const socket = io(URI_COMM_SVC, {
      transports: ["websocket"],
    });

    setSocket(socket);

    socket.emit("join-room", { roomId, userId: auth.username }, setMessages);

    socket.on("receive-message", (message) => {
      appendMessage(message);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getChatMessages = () => {
    const getAvatar = (msg, sx) => (
      <Tooltip title={msg.userId} placement={"top"}>
        <Avatar {...stringAvatar(msg.userId, { ...sx })} />
      </Tooltip>
    );
    const getMsg = (msg, sx) => (
      <Paper
        elevation={0}
        sx={(theme) => ({
          overflowWrap: "break-word",
          p: 2,
          m: 0,
          backgroundColor:
            theme.palette.mode === "dark" ? "grey.900" : "grey.100",
          borderRadius: 2,
          maxWidth: "70%",
          ...sx,
        })}
      >
        {msg.text}
      </Paper>
    );
    return messages.map((msg, id) =>
      msg.userId === auth.username ? (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          key={id}
        >
          {getAvatar(msg)} {getMsg(msg)}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          key={id}
        >
          {getMsg(msg)} {getAvatar(msg)}
        </Box>
      )
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <AppBar
        position="static"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
          p: 1,
          zIndex: 2,
        }}
      >
        <Badge
          overlap="circular"
          badgeContent={""}
          variant="dot"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              color: "#44b700",
              backgroundColor: "#44b700",
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: '""',
              },
            },
          }}
        >
          <AvatarGroup max={2} sx={{ bottom: 1 }}>
            {inRoomUsers.map((u, idx) => {
              return (
                <Avatar
                  key={idx}
                  {...stringAvatar(u, {
                    width: 24,
                    height: 24,
                    fontSize: 12,
                  })}
                />
              );
            })}
          </AvatarGroup>
        </Badge>
      </AppBar>
      <Container
        sx={{
          flexGrow: 1,
          width: "100%",
          padding: 3,
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {getChatMessages()}
        <div ref={bottomRef}></div>
      </Container>
      <form onSubmit={sendMessage} autoComplete="off">
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            fullWidth
            // label="Message"
            aria-label="Message"
            placeholder="Chat with your peer"
            inputRef={inputMessageRef}
            variant="outlined"
            size="small"
          />
          <Button type="submit" variant="contained">
            <SendIcon />
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default Chat;
