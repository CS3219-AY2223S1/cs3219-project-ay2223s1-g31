import jwt from "jsonwebtoken";
import {
  ormCreateUser as _createUser,
  ormFindOneByUsername,
} from "../model/user-orm.js";

const ENV = process.env.ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
    if (username && password) {
      const user = await ormFindOneByUsername(username);
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "Username does not exist!" });
      } else if (user.password === password) {
        const data = {
          username,
        };
        const token = jwt.sign(data, ACCESS_TOKEN_SECRET);
        return res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: false,
            secure: ENV === "PROD",
          })
          .json({ ...data });
      } else {
        return res.status(401).json({ message: "Incorrect password!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Database failure when logging in user!",
    });
  }
}
