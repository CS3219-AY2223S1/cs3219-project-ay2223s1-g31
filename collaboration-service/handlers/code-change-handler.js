import { ormGetConnection } from "../models/room-orm.js";

export function codeChangeHandler(io, socket) {
  return async (code) => {
    const { roomId } = await ormGetConnection(socket.id);
    console.log("room " + roomId);
    const roomName = `ROOM:${roomId}`;
    socket.to(roomName).emit("code-changed", code);
  };
}
