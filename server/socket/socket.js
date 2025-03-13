const socketLogic = (io) => {
  global.io = io; // Store global socket instance
  global.activeUsers = {}; // Store active users

  io.on('connection', (socket) => {
    console.log('⚡️ A user connected:', socket.id);

    // Store the user in the global object when they connect
    socket.on('userConnected', (userId) => {
      global.activeUsers[userId] = socket.id; 
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);

      // Remove user from active users when they disconnect
      const userId = Object.keys(global.activeUsers).find(
        (key) => global.activeUsers[key] === socket.id
      );

      if (userId) {
        delete global.activeUsers[userId];
      }
    });
  });
};

export default socketLogic;
