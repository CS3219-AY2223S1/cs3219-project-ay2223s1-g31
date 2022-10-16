import * as dotenv from "dotenv";
dotenv.config()

import { createClient } from "redis";

const redisClient = createClient();
const EXPIRATION = 60 * 60 * 24;

redisClient
  .connect()
  .then(() => {
    console.log("redis connected successfully!");
  })
  .catch((err) => {
    console.error(err);
  });

export async function ormCreateRoom(roomId) {
  try {
    const result = await redisClient.hSetNX(`room:${roomId}`, 'id', roomId);
    await redisClient.expire(`room:${roomId}`, EXPIRATION);

    return result
  } catch (error) {
    console.error(error.message)
  }
}

export async function ormGetRoom(roomId) {
  try {
    const result = await redisClient.hGet(`room:${roomId}`, 'id');

    return result
  } catch (error) {
    console.error(error.message);
  }
}

export async function ormDelRoom(roomId) {
  try {
    await redisClient.del(`room:${roomId}`)

    return true
  } catch (error) {
    console.error(error.message);
  }
}

export async function ormAddUserToRoom(roomId, userId) {
  try {
    const currUsers = await redisClient.hGet(`room:${roomId}`, 'users');
    
    let currUsersArray = []
    if (currUsers) {
      currUsersArray = JSON.parse(currUsers)
    }

    if (currUsersArray.includes(userId)) {
      return false
    }

    currUsersArray.push(userId);

    await redisClient.hSet(`room:${roomId}`, 'users', JSON.stringify(currUsersArray))
    await redisClient.expire(`room:${roomId}`, EXPIRATION);
    
    return true;
  } catch (error) {
    console.error(error.message);
  }
}

export async function ormAddMessageToRoom(roomId, message) {
  try {
    const currMessages = await redisClient.hGet(`room:${roomId}`, 'messages');

    let currMessagesArray = []
    if (currMessages) {
      currMessagesArray = JSON.parse(currMessages)
    }

    currMessagesArray.push(message)

    await redisClient.hSet(`room:${roomId}`, 'messages', JSON.stringify(currMessagesArray))
    await redisClient.expire(`room:${roomId}`, 'messages')
    
    return true
  } catch (error) {
    console.error(error.message)
  }
}

export async function ormGetMessagesFromRoom(roomId) {
  try {
    const messages = await redisClient.hGet(`room:${roomId}`, 'messages')

    if (!messages) return []

    return JSON.parse(messages)
  } catch (error) {
    console.error(error.message)
  }
}
