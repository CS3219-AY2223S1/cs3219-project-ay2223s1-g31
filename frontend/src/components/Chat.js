import { Box, Button, List, ListItem, ListItemText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { useAuth } from '../utils/AuthContext';


const COMM_SVC_URL = 'http://localhost:8002'
const socket = io(COMM_SVC_URL)

function Chat() {
  const { auth } = useAuth()
  const [messages, setMessages] = useState([
    {
      user: 'admin',
      text: 'Welcome to PeerPrep chat :)'
    }
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [roomId, setRoomId] = useState(0)

  const sendMessage = () => {
    let msg = {user: auth.username, text: inputMessage}
    setMessages((old) => [...old, msg])
    
    socket.emit('send-message', msg, roomId)
    
    setInputMessage('')
  }
  
  const receiveMessage = (message) => {
    setMessages((old) => [...old, message])
  }

  useEffect(() => {
    socket.on('receive-message', (message) => {
      receiveMessage(message)
    })

    socket.emit('join-room', roomId)
  }, [])

  return (
    <Box>
      <List>
        {messages.map((msg, id) => 
          <ListItem key={id}>
            <ListItemText primary={msg.text} secondary={msg.user}/>
          </ListItem>
        )}
      </List>
      <TextField id="message-input" label="Message" variant='outlined' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
      <Button variant='contained' onClick={sendMessage}>SEND</Button>
    </Box>
  )
}

export default Chat