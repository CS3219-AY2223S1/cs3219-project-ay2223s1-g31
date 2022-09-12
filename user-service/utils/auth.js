import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export async function generateHashedPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function validatePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
