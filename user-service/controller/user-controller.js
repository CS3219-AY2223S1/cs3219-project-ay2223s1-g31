import { ormCreateSession } from "../model/session-orm.js";
import {
  ormCreateUser as _createUser,
  ormDeleteUser,
  ormFindOneByUsername,
  ormUpdateUserPassword,
} from "../model/user-orm.js";
import {
  generateAccessToken,
  generateHashedPassword,
  validatePassword,
} from "../utils/auth.js";

const ENV = process.env.ENV;

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const hashedPassword = await generateHashedPassword(password);
      const resp = await _createUser(username, hashedPassword);
      console.log(resp);
      if (resp === false) {
        return res.status(409).json({ message: "User already existed!" });
      } else if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not create a new user!" });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

export async function getUser(req, res) {
  try {
    const { username } = req.user;
    const user = await ormFindOneByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Username does not exist!" });
    } else if (user.err) {
      return res.status(400).json({ message: "Could not get user info!" });
    }
    const { createdAt } = user;
    return res.status(200).json({ username, createdAt });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when getting new user!" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }

    const user = await ormFindOneByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Username does not exist!" });
    } else if (await validatePassword(password, user.password)) {
      const data = {
        username,
        createdAt: user.createdAt,
      };
      const accessToken = generateAccessToken(data);

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: ENV === "PROD",
        })
        .json({ ...data });
    } else {
      return res.status(401).json({ message: "Incorrect password!" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Database failure when logging in!",
    });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(200).json({ message: "You are already logged out!" });
    }
    const blacklistedSession = await ormCreateSession(token);
    console.log(blacklistedSession);
    if (blacklistedSession.err) {
      return res.status(400).json({ message: "Could not log out!" });
    }
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "You have been logged out successfully!" });
  } catch (err) {
    return res.status(500).json({
      message: "Database failure when logging out!",
    });
  }
}

export async function updateUserPassword(req, res) {
  try {
    const { username } = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "New password/Old password are missing!" });
    }
    console.log(username);
    const user = await ormFindOneByUsername(username);
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    } else if (!(await validatePassword(oldPassword, user.password))) {
      return res.status(400).json({ message: "Old password is not correct!" });
    }
    const hashedNewPassword = await generateHashedPassword(newPassword);
    const updatedUser = await ormUpdateUserPassword(
      username,
      hashedNewPassword
    );
    console.log(updatedUser);
    if (updatedUser.err) {
      return res.status(400).json({ message: "Could not change password!" });
    }
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: `User ${username} has been deleted!` });
  } catch (err) {
    return res.status(500).json({
      message: "Database failure when logging out!",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { username } = req.user;
    const deletedUser = await ormDeleteUser(username);
    if (!deletedUser) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    console.log(deletedUser);
    const blacklistedSession = await ormCreateSession(req.cookies.access_token);
    console.log(blacklistedSession);
    if (blacklistedSession.err) {
      return res.status(400).json({ message: err });
    }
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: `User's password has been updated!` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Database failure when deleting user!",
    });
  }
}
