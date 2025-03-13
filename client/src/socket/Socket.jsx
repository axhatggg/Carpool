import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

export const connectSocket = (userId) => {
  socket.emit('userConnected', userId);
};

export default socket;
