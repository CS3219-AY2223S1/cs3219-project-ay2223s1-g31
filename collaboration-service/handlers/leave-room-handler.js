import { ormGetConnection } from "../models/room-orm.js";

export function leaveRoomHandler(io, socket) {
  return async () => {
    const { roomId } = await ormGetConnection(socket.id);
    const roomName = `ROOM:${roomId}`;
    socket.to(roomName).emit("leave-room");
  };
}
