import jwt from "jsonwebtoken";
import Board from "../models/Board.js";

export const registerSocketHandlers = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) socket.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      // invalid/expired token — leave socket.userId unset, treated as unauthenticated
    }
    next();
  });

  io.on("connection", (socket) => {
    if (socket.userId) socket.join(`user:${socket.userId}`);

    socket.on("board:join", async (boardId) => {
      if (!socket.userId) return;
      const isMember = await Board.exists({ _id: boardId, members: socket.userId });
      if (isMember) socket.join(boardId);
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(boardId);
    });

    socket.on("disconnect", () => {
      // connection cleanup handled automatically by socket.io rooms
    });
  });
};

export const notifyUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit("notification:new", notification);
};
