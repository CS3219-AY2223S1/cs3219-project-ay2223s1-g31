import { io } from "socket.io-client";

let socket;
// eslint-disable-next-line import/no-anonymous-default-export
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
