import express from "express"
import cors from "cors"
import morgan from "morgan"
import http from "http"
import { Server } from "socket.io"
import { createMatchEntry } from "./controller/match-controller.js"

const FRONTEND_ORIGIN = "http://localhost:3000";
const PORT = process.env.PORT || 8001;

const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
)
app.use(morgan("dev"));

const router = express.Router();

app.use("/api/matching", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
})

router.get("/ping", (_, res) => res.send("Hello World from matching-service"))

router.post("/", createMatchEntry)
// router.post("/", (req, res) => {
//   res.status(200).json({message: req.body})
// })

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);
  socket.on("code-event1", ({ room_id, newCode }) => {
    io.get().sockets.in(room_id).emit("code-event", { newCode })
  })
})

server.listen(PORT, () =>
  console.log(`matching-service listening on port ${PORT}`)
)
