import { v4 } from "uuid";
import { ormCreateRoom, ormGetRoomInfo } from "../models/room-orm.js";

export async function getRoomInfo(req, res) {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Room Id is missing!" });
    }
    const resp = await ormGetRoomInfo(roomId);
    const exists = !!resp && Object.keys(resp).length != 0;
    if (resp.err) {
      console.error(resp.err);
      return res.status(400).json({ message: "Cannot get room info!" });
    }
    return res.status(200).json({ exists, info: resp });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving room info!" });
  }
}

export async function createRoom(req, res) {
  try {
    const { username } = req.body;
    const roomId = v4();

    const resp = await ormCreateRoom(roomId);

    if (resp.err) {
      console.error(resp.err);
      return res.status(400).json({ message: "Cannot create room!" });
    }

    return res.status(201).send({ roomId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating room!" });
  }
}
