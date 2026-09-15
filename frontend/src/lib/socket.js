import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("/", {
      autoConnect: true,
      path: "/socket.io",
      auth: (cb) => cb({ token: localStorage.getItem("flowboard_token") }),
    });
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
