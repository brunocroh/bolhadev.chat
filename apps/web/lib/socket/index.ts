import { io, Socket } from "socket.io-client";

const socketClient: Socket = io("http://localhost:4000");

export { socketClient as socket };
