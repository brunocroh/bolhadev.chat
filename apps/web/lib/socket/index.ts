import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = (): Socket => {
  return io(URL!);
};
