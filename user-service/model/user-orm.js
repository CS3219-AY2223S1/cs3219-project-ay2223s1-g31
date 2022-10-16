import {
  createUser,
  userExists,
  findOneUser,
  deleteUser,
  updateUser,
} from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const isUserExisted = await userExists({ username });
    console.log(isUserExisted);
    if (isUserExisted) {
      return false;
    }
    const newUser = await createUser({ username, password });
    await newUser.save();
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

export async function ormUpdateUserPassword(username, password) {
  try {
    const user = await updateUser({ username }, { password });
    return user;
  } catch (err) {
    console.log("ERROR: Could not find user");
    return { err };
  }
}

export async function ormDeleteUser(username) {
  try {
    const user = await deleteUser({ username });
    return user;
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}
