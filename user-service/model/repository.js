import UserModel from "./user-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";
import SessionModel from "./session-model.js";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// User logic

export async function createUser(params) {
  return new UserModel(params);
}

export async function userExists(params) {
  return await UserModel.exists(params);
}

export async function findOneUser(filter, projection) {
  return await UserModel.findOne(filter, projection);
}

export async function findAllUsers(filter, projection) {
  return await UserModel.find(filter, projection);
}

export async function updateUser(filter, update) {
  return await UserModel.updateOne(filter, update);
}

export async function deleteUser(filter) {
  return await UserModel.findOneAndRemove(filter);
}

// Session logic

export async function createSession(params) {
  return new SessionModel(params);
}

export async function findOneSession(filter, projection) {
  return await SessionModel.findOne(filter, projection);
}

export async function findAllSessions(filter, projection) {
  return await SessionModel.find(filter, projection);
}
