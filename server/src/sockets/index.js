import { Server } from 'socket.io';
import { env } from '../config/env.js';

let io;

export function initSocket(server) {
  io = new Server(server, { cors: { origin: env.clientUrl, credentials: true } });

  // TODO: authenticate socket with JWT (io.use), then register handlers from chat.socket.js
  io.on('connection', (socket) => {
    console.log('🔌 socket connected', socket.id);
    socket.on('disconnect', () => console.log('🔌 socket disconnected', socket.id));
  });

  return io;
}

export const getIO = () => io;
