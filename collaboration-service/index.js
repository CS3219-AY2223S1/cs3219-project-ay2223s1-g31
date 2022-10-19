import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import chalk from "chalk";
import "dotenv/config";
import {
  createRoom,
  deleteRoom,
  getRoomInfo,
  getRoomQuestion,
} from "./controllers/room-controller.js";
import { roomConnectHandler } from "./handlers/room-connect-handler.js";
import { disconnectHandler } from "./handlers/disconnect-handler.js";
import { codeChangeHandler } from "./handlers/code-change-handler.js";
import { leaveRoomHandler } from "./handlers/leave-room-handler.js";
import { codeExec } from "./controllers/code-controller.js";
import { verifyAccessToken } from "./middlewares/verifyAccessToken.js";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 8050;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
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

app.use("/api/collab", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

router.get("/ping", (_, res) =>
  res.send("Hello World from collaboration-service")
);

// room routes
router.post("/room", verifyAccessToken, createRoom);
router.get("/room/:roomId", verifyAccessToken, getRoomInfo);
router.get("/roomQuestion/:roomId", verifyAccessToken, getRoomQuestion);
router.delete("/room/:roomId", verifyAccessToken, deleteRoom);

// code routes
router.post("/code", codeExec);

io.on("connection", (socket) => {
  console.log("Connected " + socket.id);
  socket.on("connected-to-room", roomConnectHandler(io, socket));
  socket.on("disconnect-from-room", disconnectHandler(io, socket));
  socket.on("code-changed", codeChangeHandler(io, socket));
  socket.on("leave-room", leaveRoomHandler(io, socket));
});

server.listen(PORT, () =>
  console.log(
    chalk.yellowBright(`[collaboration-service] listening on port ${PORT}`)
  )
);
