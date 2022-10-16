import authAxios from "../services/authAxios.js";

export async function verifyAccessToken(req, res, next) {
  try {
    const res = await authAxios.post("/verifyToken");
    console.log(res);
    req.user = res.data;
    return next();
  } catch (err) {
    console.log(err.response.data);
    return res
      .status(500)
      .json({ message: "Server failure when verifying access token!" });
  }
}
