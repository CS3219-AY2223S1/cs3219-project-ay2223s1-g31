import { io } from "socket.io-client";

let socket;
export default {
  init: (httpServer) => {
    socket = io(httpServer, {
      transports: ["websocket"],
    });
    return socket;
  },
  get: () => {
    if (!socket) {
      throw new Error("socket.io is not initialized");
    }
    return socket;
  },
};
