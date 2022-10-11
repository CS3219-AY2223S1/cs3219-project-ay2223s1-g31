import {
  createMatchEntry,
  listValidMatchEntriesByDifficulty,
} from "./repository.js";

export async function ormCreateMatchEntry(
  username,
  difficulty,
  start_time,
  socket_id
) {
  try {
    await createMatchEntry({ username, difficulty, start_time, socket_id });
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new match entry");
    return false;
  }
}

export async function ormListValidMatchEntriesByDifficulty(
  username,
  difficulty,
  start_time
) {
  try {
    const newMatchEntry = await listValidMatchEntriesByDifficulty({
      username,
      difficulty,
      start_time,
    });
    return newMatchEntry;
  } catch (err) {
    console.log("ERROR: Could not find match entries");
    return false;
  }
}
