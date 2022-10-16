import { ormAddUserToRoom, ormCreateRoom, ormGetMessagesFromRoom } from "../models/room-orm.js";

export function joinRoomHandler(io, socket) {
  return async ({ roomId, userId }, callback) => {
    await ormCreateRoom(roomId)
    socket.join(roomId);
    ormAddUserToRoom(roomId, userId)

    const messages = await ormGetMessagesFromRoom(roomId)
    callback(messages)
  };
}
