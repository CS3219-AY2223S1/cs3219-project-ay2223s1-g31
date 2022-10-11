import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8002;

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    console.log(`${socket.id} joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("send-message", (message, roomId) => {
    console.log(`${message.user} sending message to room ${roomId}`);
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`communication-service listening on port ${PORT}`);
});
