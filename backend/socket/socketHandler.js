export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("board:join", (boardId) => {
      socket.join(boardId);
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(boardId);
    });

    socket.on("disconnect", () => {
      // connection cleanup handled automatically by socket.io rooms
    });
  });
};
