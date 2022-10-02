import { createClient } from "redis";
import moment from "moment";
import chalk from "chalk";

const redisClient = createClient();

redisClient
  .connect()
  .then(() => {
    console.log(chalk.yellow("[redis] connected successfully!"));
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

export async function ormGetRoomInfo(roomId) {
  try {
    const result = await redisClient.hGetAll(`${roomId}:info`);
    // console.log(`Get room info ${roomId}`);
    return result;
  } catch (err) {
    return { err };
  }
}

export async function ormGetAllUsersInRoom(roomId) {
  try {
    const result = await redisClient.sMembers(`${roomId}:users`, 0, -1);
    // console.log(`Get all users from room ${roomId}`);
    return result;
  } catch (err) {
    return { err };
  }
}

export async function ormGetConnection(socketId) {
  try {
    const result = await redisClient.hGetAll(socketId);
    // console.log(`Get connection for socket ${socketId}`);
    return result;
  } catch (err) {
    return { err };
  }
}

export async function ormCreateRoom(roomId) {
  try {
    const result = await redisClient.hSet(`${roomId}:info`, {
      created: moment().toString(),
      updated: moment().toString(),
    });
    // console.log(`[${result}] Created ${roomId}`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormAddUsersToRoom(roomId, usernames) {
  try {
    const result = await redisClient.sAdd(`${roomId}:users`, usernames);
    // console.log(`[${result}] Added ${usernames} to room ${roomId}`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormCreateConnection(socketId, roomId, username) {
  try {
    const result = await redisClient.hSet(socketId, { roomId, username });
    // console.log(
    //   `[${result}] Created connection for socket ${socketId}: ${username} - room ${roomId}`
    // );
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormDeleteAllUsersFromRoom(roomId) {
  try {
    const result = await redisClient.del(`${roomId}:users`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormDeleteRoomInfo(roomId) {
  try {
    const result = await redisClient.del(`${roomId}:info`);
    return true;
  } catch (err) {
    return { err };
  }
}