import { createUser, userExists, findOneUser } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const isUserExisted = userExists({ username });
    if (isUserExisted) {
      return false;
    }
    const newUser = await createUser({ username, password });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormFindOneByUsername(username) {
  try {
    const user = await findOneUser({ username });
    return user;
  } catch (err) {
    console.log("ERROR: Could not find user");
    return { err };
  }
}
