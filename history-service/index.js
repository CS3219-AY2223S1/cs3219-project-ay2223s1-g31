import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";
import {
  createHistoryEntry,
  getHistoryEntry,
} from "./controllers/history-controller.js";
import { verifyAccessToken } from "./middlewares/verifyAccessToken.js";

const FRONTEND_ORIGIN = "http://localhost:3000";
const PORT = process.env.PORT || 8052;

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

app.use("/api/history", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

router.get("/ping", (_, res) => res.send("Hello World from history-service"));

router.get("/", verifyAccessToken, getHistoryEntry);
router.post("/", createHistoryEntry);

app.listen(PORT, () =>
  console.log(`history-service listening on port ${PORT}`)
);
