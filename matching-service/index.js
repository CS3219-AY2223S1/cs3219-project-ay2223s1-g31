import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import {
  createMatchEntry,
  deleteMatchEntry,
} from "./controller/match-controller.js";
import {
  ormCreateMatchEntry,
  ormListValidMatchEntriesByDifficulty,
  ormDeleteMatchEntry,
} from "./model/match-orm.js";

const FRONTEND_ORIGIN = "http://localhost:3000";
const PORT = process.env.PORT || 8001;

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
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.io = io; // pass socket to server
  return next();
});

const router = express.Router();

app.use("/api/matching", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

router.get("/ping", (_, res) => res.send("Hello World from matching-service"));
router.post("/", createMatchEntry);
router.delete("/", deleteMatchEntry);

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);

  socket.on("find-match", async (data) => {
    const { username, difficulty, start_time, socket_id } = data;
    if (!username || !difficulty || !start_time || !socket_id) {
      socket.emit("match-failure");
    }
    try {
      const valid_entries = await ormListValidMatchEntriesByDifficulty(
        difficulty,
        start_time,
        socket_id
      );
      console.log("VALID ENTRY:");
      console.log(valid_entries);

      if (valid_entries.length == 0) {
        console.log("There is no matching avaiable now");
        // add user match entry to database
        const create_response = await ormCreateMatchEntry(
          username,
          difficulty,
          start_time,
          socket_id
        );
        return;
      }
      // delete entry once match found
      console.log("Found match.");
      const first_valid_entry = { ...valid_entries[0].dataValues };
      await ormDeleteMatchEntry(first_valid_entry["socket_id"]);
      // get socket id of users
      const user1_socket_id = first_valid_entry["socket_id"];
      const user2_socket_id = socket_id;
      console.log(user1_socket_id);
      console.log(user2_socket_id);
      // create socket room
      const user1_socket = io.sockets.sockets.get(user1_socket_id);
      const user2_socket = io.sockets.sockets.get(user2_socket_id);
      const room_id = user1_socket_id + user2_socket_id;

      // ensure both users socket can be communicated by server socket
      if (!user1_socket || !user2_socket) {
        io.to(user1_socket).to(user2_socket).emit("match-failure");
        return;
      }

      user1_socket.join(room_id);
      user2_socket.join(room_id);
      console.log("Created room " + room_id);

      io.sockets
        .in(room_id)
        .emit("match-success", {
          room_id,
          username1: first_valid_entry["username"],
          username2: username,
        });
    } catch (err) {
      console.log(err);
      socket.emit("match-failure");
    }
  });

  socket.on("cancel-match", async ({ socket_id }) => {
    try {
      const response = await ormDeleteMatchEntry(socket_id);
      console.log("Match cancelled");
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(PORT, () =>
  console.log(`matching-service listening on port ${PORT}`)
);
