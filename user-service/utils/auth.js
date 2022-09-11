import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  return jwt.sign(
    { username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

export function validateAccessToken(token) {
  try {
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { username: result.username };
  } catch (err) {
    return null;
  }
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
}
