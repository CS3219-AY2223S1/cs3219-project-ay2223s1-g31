import { ormFindOneSession } from "../model/session-orm.js";
import { validateAccessToken } from "../utils/auth.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("token: " + token);
    return res
      .status(403)
      .json({ message: "Access token required for authentication" });
  }
  const blacklistToken = await ormFindOneSession(token);
  if (blacklistToken) {
    return res.status(401).send({ message: "Access token already expired" });
  }
  const user = validateAccessToken(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }
  console.log(user);
  req.user = user;
  return next();
};
