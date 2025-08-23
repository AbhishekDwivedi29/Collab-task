const userSockets = {};

exports.handleSocketConnection = (socket, io) => {
  const userId = socket.user.userId;
  userSockets[userId] = socket.id;
  // console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
    // console.log(`User ${userId} joined board ${boardId}`);
  });

   io.emit("connectionCount", io.engine.clientsCount);


  socket.on('disconnect', () => {
    delete userSockets[userId];
    // console.log(`User ${userId} disconnected`);
  });
};



exports.userSockets = userSockets;