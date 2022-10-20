import {
  ormCreateHistoryEntry,
  ormGetHistoryOfUser,
} from "../models/history-orm.js";

export async function createHistoryEntry(req, res) {
  try {
    const { username1, username2, roomId, question } = req.body;
    if (!username1 || !username2 || !roomId || !question) {
      return res.status(400).json({ message: "Missing values!" });
    }

    const entry = await ormCreateHistoryEntry(
      username1,
      username2,
      roomId,
      question
    );
    if (entry.err) {
      return res.status(400).json({ message: "Cannot create history entry" });
    }
    return res.status(201).json({ username1, username2, roomId, question });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating new history entry!" });
  }
}

export async function getHistoryEntry(req, res) {
  try {
    const { username } = req.user;
    if (!username) {
      return res.status(400).json({ message: "Missing username!" });
    }

    const entries = await ormGetHistoryOfUser(username);
    if (!entries || entries.err) {
      return res.status(400).json({ message: "Cannot get history entries" });
    }
    const resultEntries = entries.map((e) => {
      return {
        id: e.createdAt,
        dateTime: e.createdAt,
        peer: e.peer,
        roomId: e.roomId,
        difficulty: e.question.difficulty,
        question: e.question.title,
        tags: e.question.tags,
      };
    });
    return res.status(200).json(resultEntries);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving history entries!" });
  }
}
