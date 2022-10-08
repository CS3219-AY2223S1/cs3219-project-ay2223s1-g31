import { v4 } from "uuid";
import {
  ormCreateRoom,
  ormCreateRoomQuestion,
  ormGetRoomQuestion,
  ormDeleteAllUsersFromRoom,
  ormDeleteRoomInfo,
  ormGetRoomInfo,
} from "../models/room-orm.js";

export async function getRoomInfo(req, res) {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Room Id is missing!" });
    }
    const resp = await ormGetRoomInfo(roomId);
    const resp2 = await ormGetRoomQuestion(roomId);
    const exists =
      !!resp &&
      Object.keys(resp).length != 0 &&
      !!resp2 &&
      Object.keys(resp2).length != 0;
    if (resp.err || resp2.err) {
      console.error(resp.err);
      return res.status(400).json({ message: "Cannot get room info!" });
    }
    return res.status(200).json({ exists, info: resp, question: resp2 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving room info!" });
  }
}

export async function createRoom(req, res) {
  try {
    const { username, question } = req.body;
    const roomId = v4();

    const resp = await ormCreateRoom(roomId);
    const resp2 = await ormCreateRoomQuestion(roomId, question);

    if (resp.err || resp2.err) {
      console.error(resp.err);
      console.error(resp2.err);
      return res.status(400).json({ message: "Cannot create room!" });
    }

    return res.status(201).send({ roomId, question });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating room!" });
  }
}

export async function deleteRoom(req, res) {
  try {
    const { username } = req.body;
    const { roomId } = req.params;

    const resp1 = await ormDeleteRoomInfo(roomId);
    const resp2 = await ormDeleteAllUsersFromRoom(roomId);

    if (resp1.err || resp2.err) {
      console.error(resp1.err);
      console.error(resp2.err);
      return res.status(400).json({ message: "Cannot delete room!" });
    }

    return res.status(200).send({ roomId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when deleting room!" });
  }
}
