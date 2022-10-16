import { ormDelRoom } from "../models/room-orm";

export function leaveRoomHandler(io, socket) {
  return async ({ roomId }) => {
    socket.leave(roomId);
    ormDelRoom(roomId);
  };
}
