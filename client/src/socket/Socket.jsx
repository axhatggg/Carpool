import { io } from 'socket.io-client';

const socket = io('https://carpool-1.onrender.com');

export const connectSocket = (userId) => {
  socket.emit('userConnected', userId);
};

export default socket;
