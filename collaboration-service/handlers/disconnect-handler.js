import {
  ormAddUsersToRoom,
  ormDeleteAllUsersFromRoom,
  ormDeleteConnection,
  ormDeleteRoomInfo,
  ormGetAllUsersInRoom,
  ormGetConnection,
} from "../models/room-orm.js";

export function disconnectHandler(io, socket) {
  return async () => {
    const { roomId, username } = await ormGetConnection(socket.id);
    const users = await ormGetAllUsersInRoom(roomId);
    const newUsers = users.filter((u) => u != username);
    await ormDeleteConnection(socket.id);
    console.log("new users: " + newUsers);
    if (newUsers.length > 0) {
      await ormDeleteAllUsersFromRoom(roomId);
      await ormAddUsersToRoom(roomId, newUsers);
    } else {
      await ormDeleteAllUsersFromRoom(roomId);
    }
    const roomName = `ROOM:${roomId}`;
    io.in(roomName).emit("room:connection", newUsers);
  };
}
