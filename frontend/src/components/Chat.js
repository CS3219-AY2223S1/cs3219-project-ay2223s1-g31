import {
  Avatar,
  Box,
  Button,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { maxHeight } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { URI_COMM_SVC } from "../configs";
import { useAuth } from "../utils/AuthContext";
import { stringAvatar } from "../utils/avatar-utils";

function Chat() {
  const { auth } = useAuth();
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage) return

    let message = { 
      user: auth.username, 
      text: inputMessage
    };

    appendMessage(message)
    socket.emit("send-message", { roomId, message });
    setInputMessage('')
  };

  const appendMessage = (message) => {
    setMessages((currMessages) => [...currMessages, message]);
  };

  useEffect(() => {
    const socket = io(URI_COMM_SVC, {
      transports: ["websocket"],
    })
    
    setSocket(socket)

    socket.emit("join-room", { roomId, user: auth.username }, setMessages);

    socket.on("receive-message", (message) => {
      appendMessage(message);
    });

  }, []);

  const getChatMessages = () => {
    return messages.map((msg, id) => (
      <ListItem
        disablePadding
        sx={{m:1}}
        key={id}
      >
        <ListItemAvatar>
          <Avatar
            {...stringAvatar(msg.user)}
            sx={{ width: 36, height: 36, fontSize: 24 }}
          />
        </ListItemAvatar>
        <ListItemText
          sx={{
            overflowWrap:"break-word",
            p:2,
            bgcolor:"grey.100",
            borderRadius:2,
          }}
          primary={msg.text} 
          secondary={msg.user} 
        />
      </ListItem>
    ));
  };

  return (
    <Box
      sx={{
        minHeight:"300px",
        maxWidth:"300px",
      }}
    >
      <List
        sx={{
          maxHeight:"300px",
          overflowY:"scroll"
        }}
      >{getChatMessages()}</List>
      <form onSubmit={sendMessage} autoComplete="off">
        <FormControl
          sx={{
            display:"flex", 
            flexDirection:"row",
          }}
        >
          <TextField
            label="Message"
            variant="outlined"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            />
          <Button variant="contained" type="submit">
            SEND
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default Chat;
