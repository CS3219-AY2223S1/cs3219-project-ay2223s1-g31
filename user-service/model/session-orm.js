import {
  createSession,
  findOneSession,
  findAllSessions,
} from "./repository.js";

export async function ormCreateSession(token) {
  try {
    const newSession = await createSession({ token });
    newSession.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new session");
    return { err };
  }
}

export async function ormFindOneSession(token) {
  try {
    const user = await findOneSession({ token });
    return user;
  } catch (err) {
    console.log("ERROR: Could not find session");
    return { err };
  }
}

export async function ormFindAllSessions(token) {
  try {
    const users = await findAllSessions({ token });
    return users;
  } catch (err) {
    console.log("ERROR: Could not find session");
    return { err };
  }
}
