import { ormAddMessageToRoom } from "../models/room-orm.js";

export function sendMessageHandler(io, socket) {
  return async ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", message);

    ormAddMessageToRoom(roomId, message)
  };
}
