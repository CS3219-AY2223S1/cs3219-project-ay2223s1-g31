import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "1d",
    default: Date.now,
  },
});

export default mongoose.model("SessionModel", SessionSchema);
