import authAxios from "../services/authAxios.js";

export async function verifyAccessToken(req, res, next) {
  try {
    const token = req.cookies.access_token;
    const res = await authAxios.post(
      "/verifyToken",
      {},
      {
        headers: {
          Cookie: `access_token=${token}`,
        },
      }
    );
    console.log(res);
    req.user = res.data;
    return next();
  } catch (err) {
    console.log(err.response.data);
    return res.status(err.response.status).json(err.response.data);
  }
}
