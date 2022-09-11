import { ormCreateSession } from "../model/session-orm.js";
import {
  ormCreateUser as _createUser,
  ormFindOneByUsername,
} from "../model/user-orm.js";
import { generateAccessToken } from "../utils/auth.js";

const ENV = process.env.ENV;

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const resp = await _createUser(username, password);
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

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }

    const user = await ormFindOneByUsername(username);
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Username does not exist!" });
    } else if (user.password === password) {
      const data = {
        username,
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
    const blacklistedSession = ormCreateSession(token);
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
