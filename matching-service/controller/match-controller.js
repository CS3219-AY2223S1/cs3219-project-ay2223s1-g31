import io from "../socket.js"

import {
  ormCreateMatch as _createMatch,
  ormListMatch as _listMatch,
} from "../model/match-orm.js"

export async function createMatch(req, res) {
  const { username, difficulty, start_time, socket_id } = req.body

  const valid_entries = await _listMatch(difficulty, start_time)

  if (valid_entries.length == 0) {
    const create_response = await _createMatch(username, difficulty, start_time, socket_id);

    if (create_response) {
      return res.status(200).json({ message: "OK" })
    }
    return res.status(200).json({ message: "NOT OK" });
  }

  console.log("MATCH FOUND")
  const first_valid_entry = { ...valid_entries[0].dataValues }
  valid_entries.destroy()

  const user1_socket_id = first_valid_entry["socket_id"]
  const user2_socket_id = socket_id
  console.log(user1_socket_id)
  console.log(user2_socket_id)

  const user1_socket = io.get().sockets.sockets.get(user1_socket_id)
  const user2_socket = io.get().sockets.sockets.get(user2_socket_id)
  const room_id = user1_socket_id + user2_socket_id; // ?

  if (!user1_socket || !user1_socket) {
    io.get().to(user1_socket).to(user2_socket).emit("MATCH FAILED")
    return res.status(200).json({ message: "NOT OK" })
  }

  user1_socket.join(room_id)
  user2_socket.join(room_id)
  console.log("ROOM CREATED WITH ID " + room_id)

  io.get().sockets.in(room_id).emit("MATCH SUCCESSFUL", { room_id })
  return res.status(200).json({ message: "OK" })
}
