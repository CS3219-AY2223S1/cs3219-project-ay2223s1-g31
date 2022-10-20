import { createClient } from "redis";
import moment from "moment";
import chalk from "chalk";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
const EXPIRATION = 60 * 60 * 24;

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

export async function ormGetRoomQuestion(roomId) {
  try {
    const result = await redisClient.get(`${roomId}:question`);
    console.log(result);
    return result ? JSON.parse(result) : null;
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

export async function ormCreateRoom(roomId, username1, username2) {
  try {
    const exists = await redisClient.hGetAll(`${roomId}:info`);
    if (exists && Object.keys(exists).length != 0) {
      throw "Room ID already existed!";
    }
    const result = await redisClient.hSet(`${roomId}:info`, {
      username1,
      username2,
      created: moment().toString(),
      updated: moment().toString(),
    });
    await redisClient.expire(`${roomId}:info`, EXPIRATION);
    // console.log(`[${result}] Created ${roomId}`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormCreateRoomQuestion(roomId, question) {
  try {
    console.log(question);
    const result = await redisClient.set(
      `${roomId}:question`,
      JSON.stringify(question)
    );
    await redisClient.expire(`${roomId}:question`, EXPIRATION);
    console.log(JSON.stringify(question));
    // console.log(`[${result}] Created ${roomId}`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormAddUsersToRoom(roomId, usernames) {
  try {
    const result = await redisClient.sAdd(`${roomId}:users`, usernames);
    await redisClient.expire(`${roomId}:users`, EXPIRATION);
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
    await redisClient.expire(socketId, EXPIRATION);
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

export async function ormDeleteRoomQuestion(roomId) {
  try {
    const result = await redisClient.del(`${roomId}:question`);
    return true;
  } catch (err) {
    return { err };
  }
}

export async function ormDeleteConnection(socketId) {
  try {
    const result = await redisClient.del(socketId);
    return true;
  } catch (err) {
    return { err };
  }
}
