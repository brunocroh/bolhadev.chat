import { io, Socket } from "socket.io-client";

const URL = "http://localhost:4000";

export const socket = (): Socket => {
  return io(URL);
};
