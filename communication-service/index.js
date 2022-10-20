import express from "express";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { joinRoomHandler } from "./handlers/join-room-handler.js";
import { leaveRoomHandler } from "./handlers/leave-room-handler.js";
import { sendMessageHandler } from "./handlers/send-message-handler.js";

const PORT = process.env.PORT || 8002;

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

  socket.on("join-room", joinRoomHandler(io, socket));
  socket.on("send-message", sendMessageHandler(io, socket));
  socket.on("leave-room", leaveRoomHandler(io, socket));
});

server.listen(PORT, () => {
  console.log(`communication-service listening on port ${PORT}`);
});
