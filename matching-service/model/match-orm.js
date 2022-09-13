import { createMatch, listMatch } from "./repository.js"

export async function ormCreateMatch(email, difficulty, start_time, socket_id) {
  try {
    await createMatch({ email, difficulty, start_time, socket_id });
    return true;
  } catch (err) {
    console.log("ERROR: New match entry cannot be created.");
    return true;
  }
}

export async function ormListMatch(difficulty, start_time) {
  try {
    const newMatch = await listMatch({ difficulty, start_time });
    return newMatch;
  } catch (err) {
    console.log("ERROR: Matched entries cannot be found.");
    return false;
  }
}
