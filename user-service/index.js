import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createUser, login } from "./controller/user-controller.js";

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

const router = express.Router();

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/", createUser);

router.post("/login", login);

app.listen(8000, () => console.log("user-service listening on port 8000"));
