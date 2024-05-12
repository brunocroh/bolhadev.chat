import { Server } from "socket.io";
import cron from "node-cron";

type Room = {
  id: string;
  host: string;
  users: string[];
};

type SocketEvents = {
  userConnect: (props: { id: string }) => void;
  queueJoin: (props: { id: string }) => void;
  queueUpdated: (props: { size: number }) => void;
  newUserConnect: (props: { size: number }) => void;
  queueExit: (props: { id: string }) => void;
  roomFound: (props: { users: string[] }) => void;
};

const queue = new Set();
const users = new Map();

const io = new Server<SocketEvents, SocketEvents>({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    queue.delete(socket.id);
    users.delete(socket.id);

    io.emit("newUserConnect", { size: queue.size });
  });

  socket.on("userConnect", ({ id }) => {
    users.set(id, "stale");

    io.emit("newUserConnect", { size: users.size });
  });

  socket.on("queueJoin", ({ id }) => {
    queue.add(id);
    console.log({ queueJoin: id });

    io.emit("queueUpdated", { size: queue.size });
  });

  socket.on("queueExit", ({ id }) => {
    queue.delete(id);

    console.log({ queueExit: id });

    io.emit("queueUpdated", { size: queue.size });
  });
});

io.listen(4000);

cron.schedule("*/30 * * * * *", () => {
  const _queue = Array.from(queue);
  for (; _queue.length >= 2; ) {
    const room = _queue.splice(0, 2);
    queue.delete(room[1]);
    room.forEach((user) => {
      queue.delete(user);
      io.socket(user).emit("roomFound", { users: room });
    });
  }
});

console.log("Server up");
