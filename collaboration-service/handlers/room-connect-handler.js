import {
  ormAddUsersToRoom,
  ormCreateConnection,
  ormGetAllUsersInRoom,
} from "../models/room-orm.js";

export function roomConnectHandler(io, socket) {
  return async (data) => {
    const { roomId, username } = data;
    try {
      await ormAddUsersToRoom(roomId, username);
      await ormCreateConnection(socket.id, roomId, username);
      const users = await ormGetAllUsersInRoom(roomId);
      const roomName = `ROOM:${roomId}`;
      socket.join(roomName);
      io.in(roomName).emit("room:connection", users);
      console.log(socket.id);
    } catch (err) {
      console.error(err);
    }
  };
}
