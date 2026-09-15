import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("/", { autoConnect: true, path: "/socket.io" });
  }
  return socket;
};
