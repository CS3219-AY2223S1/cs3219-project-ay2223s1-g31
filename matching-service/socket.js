import { Server } from "socket.io";

const FRONTEND_ORIGIN = "http://localhost:3000";

let io;
export default {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: FRONTEND_ORIGIN,
        // methods: ["GET", "POST"],
        credentials: true
      },
    });
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket.io is not initialized");
    }
    return io;
  },
};
