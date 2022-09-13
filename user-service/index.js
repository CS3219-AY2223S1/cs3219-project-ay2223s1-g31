import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {
  createUser,
  deleteUser,
  login,
  logout,
  updateUserPassword,
} from "./controller/user-controller.js";
import { authenticateToken } from "./middlewares/authenticateToken.js";

const FRONTEND_ORIGIN = "http://localhost:3000";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

const router = express.Router();

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

// Controller will contain all the User-defined Routes

// Check if the server is alive
router.get("/ping", (_, res) => res.send("Hello World from user-service"));

router.post("/", createUser);
router.delete("/", authenticateToken, deleteUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/changePassword", authenticateToken, updateUserPassword);

// Protected route just for testing auth
router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

app.listen(8000, () => console.log("user-service listening on port 8000"));
