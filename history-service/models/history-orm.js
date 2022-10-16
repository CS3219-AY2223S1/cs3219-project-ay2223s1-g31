import mongoose from "mongoose";
import HistoryModel from "./history-model.js";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function ormCreateHistoryEntry(
  username1,
  username2,
  roomId,
  question
) {
  try {
    const newEntry = new HistoryModel({
      username1,
      username2,
      roomId,
      question,
    });
    await newEntry.save();
    return true;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetHistoryOfUser(username) {
  try {
    const entries1 = await HistoryModel.find({ username1: username });
    const entries2 = await HistoryModel.find({ username2: username });
    const result = [
      ...entries1.map((e) => ({
        createdAt: e.createdAt,
        peer: e.username2,
        roomId: e.roomId,
        question: e.question,
      })),
      ...entries2.map((e) => ({
        createdAt: e.createdAt,
        peer: e.username1,
        roomId: e.roomId,
        question: e.question,
      })),
    ];
    return result;
  } catch (err) {
    console.log(err);
    return { err };
  }
}
