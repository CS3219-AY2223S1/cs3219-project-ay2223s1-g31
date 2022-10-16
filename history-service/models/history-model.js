import mongoose from "mongoose";
var Schema = mongoose.Schema;
let HistorySchema = new Schema({
  username1: {
    type: String,
    required: true,
  },
  username2: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export default mongoose.model("HistoryModel", HistorySchema);
