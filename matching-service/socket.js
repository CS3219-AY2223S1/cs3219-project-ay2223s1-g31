import { Server } from 'socket.io'

let io
export default {
  into: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error('socket.io initialization failed.');
    }
    return io;
  },
}
