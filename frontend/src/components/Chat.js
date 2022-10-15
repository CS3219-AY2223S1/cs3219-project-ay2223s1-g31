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
import SendIcon from "@mui/icons-material/Send";
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
  const inputMessageRef = useRef('');
  const bottomRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessageRef.current.value) return

    let message = { 
      user: auth.username, 
      text: inputMessageRef.current.value
    };

    appendMessage(message)
    socket.emit("send-message", { roomId, message });
    e.target.reset()
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  },[messages])

  const getChatMessages = () => {
    return messages.map((msg, id) => (
      <ListItem
        sx={{}}
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
          secondaryTypographyProps={{color:"primary"}}
        />
      </ListItem>
    ));
  };

  return (
    <Box sx={{height:"500px", width:"600px"}}>
    <Box
      sx={{
        height:"100%",
        width:"100%",
        display:"flex",
        flexDirection:"column",
      }}
    >
      <List
        sx={{
          flexGrow:1,
          width:"100%",
          overflowY:"scroll"
        }}
      >
        {getChatMessages()}
        <div ref={bottomRef}></div>
      </List>
      <form onSubmit={sendMessage} autoComplete="off">
        <FormControl
          sx={{
            display:"flex", 
            flexDirection:"row",
          }}
        >
          <TextField
            fullWidth
            label="Message"
            inputRef={inputMessageRef}
            variant="outlined"
            />
          <Button 
            endIcon={<SendIcon />}
            type="submit"
            variant="contained" 
          >
            Send
          </Button>
        </FormControl>
      </form>
    </Box>
    </Box>
  );
}

export default Chat;
