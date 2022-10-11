import {
  createMatchEntry,
  listValidMatchEntriesByDifficulty,
  deleteMatchEntry,
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
  difficulty,
  start_time,
  socket_id,
) {
  try {
    const newMatchEntry = await listValidMatchEntriesByDifficulty({
      difficulty,
      start_time,
      socket_id,
    });
    return newMatchEntry;
  } catch (err) {
    console.log("ERROR: Could not find match entries");
    return false;
  }
}

export async function ormDeleteMatchEntry(
  socket_id,
) {
  try {
    await deleteMatchEntry({ socket_id })
  } catch (err) {
    console.log("ERROR: Could not find match entry")
  }
}
