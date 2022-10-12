import { v4 } from "uuid";
import {
  ormCreateRoom,
  ormCreateRoomQuestion,
  ormGetRoomQuestion,
  ormDeleteAllUsersFromRoom,
  ormDeleteRoomInfo,
  ormGetRoomInfo,
  ormDeleteRoomQuestion,
} from "../models/room-orm.js";

export async function getRoomInfo(req, res) {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Room Id is missing!" });
    }
    const resp = await ormGetRoomInfo(roomId);
    console.log("GET ROOM INFO " + roomId);
    console.log(resp);
    const exists = !!resp && Object.keys(resp).length != 0;
    if (!resp) {
      return res.status(400).json({ message: "Room ID does not exist!" });
    }
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

export async function getRoomQuestion(req, res) {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Room Id is missing!" });
    }
    const resp = await ormGetRoomQuestion(roomId);
    console.log("GET ROOM QUESTION " + roomId);
    console.log(resp);
    if (!resp) {
      return res.status(400).json({ message: "Room ID does not exist!" });
    }
    if (resp.err) {
      console.error(resp.err);
      return res.status(400).json({ message: "Cannot get room's question!" });
    }
    return res.status(200).json(resp);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving room's question!" });
  }
}

export async function createRoom(req, res) {
  try {
    const { roomId, username1, username2, question } = req.body;
    if (!username1 || !username2 || !question || !roomId) {
      return res.status(400).json({ message: "Missing fields!" });
    }

    const resp = await ormCreateRoom(roomId, username1, username2);
    const resp2 = await ormCreateRoomQuestion(roomId, question);

    if (resp.err || resp2.err) {
      console.error(resp.err);
      console.error(resp2.err);
      return res.status(400).json({ message: "Cannot create room!" });
    }

    return res.status(201).send({ roomId, username1, username2, question });
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
    const resp3 = await ormDeleteRoomQuestion(roomId);

    if (resp1.err || resp2.err || resp3.err) {
      console.error(resp1.err);
      console.error(resp2.err);
      console.error(resp3.err);
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
