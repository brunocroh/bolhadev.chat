import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import cron from "node-cron";

type Room = {
  host?: string;
  users: string[];
};

type SocketEvents = {
  queueJoin: (props: { id: string }) => void;
  queueUpdated: (props: { size: number }) => void;
  newUserConnect: (props: { size: number }) => void;
  queueExit: (props: { id: string }) => void;
  roomFound: (props: { room: Room; roomId: string }) => void;
  roomEnter: (props: { roomId: string; id: string }) => void;
  sendOffer: (props: {
    to: string | undefined;
    signal: any;
    from: string;
  }) => void;
  receiveOffer: (props: { to: string; from: string; signal: any }) => void;
  sendAnswer: (props: { to: string; signal: any }) => void;
  receiveAnswer: (props: { signal: any }) => void;
  me: (id: string) => void;
  callAccepted: (signal: any) => void;
  hostCall: (payload: { to: string }) => void;
};

type SocketEventCurrier<T extends SocketEvents[keyof SocketEvents]> = (
  socket: Socket,
) => T;

const queue = new Set<string>();
const users = new Map();
const rooms = new Map<string, Room>();

const io = new Server<SocketEvents, SocketEvents>({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  users.set(socket.id, socket);
  io.emit("newUserConnect", { size: io.engine.clientsCount });

  socket.on("disconnect", () => handleDisconnect(socket)());
  socket.on("queueJoin", (params) => onQueueJoin(socket)(params));
  socket.on("queueExit", (params) => onQueueExit(socket)(params));
  socket.on("sendOffer", (params) => onSendOffer(socket)(params));
  socket.on("sendAnswer", (params) => onSendAnswer(socket)(params));
  socket.on("roomEnter", (params) => onRoomEnter(socket)(params));
});

const handleDisconnect = (socket: Socket) => () => {
  queue.delete(socket.id);
  users.delete(socket.id);
  io.emit("newUserConnect", { size: users.size });
};

const onRoomEnter: SocketEventCurrier<SocketEvents["roomEnter"]> =
  (socket: Socket) =>
  ({ roomId, id }) => {
    const room = rooms.get(roomId);

    if (!room) return;

    room.users.push(id);

    if (room?.users.length === 2) {
      socket.emit("hostCall", { to: room.users[0] });
    }
  };

const onSendOffer: SocketEventCurrier<SocketEvents["sendOffer"]> =
  () =>
  ({ to, signal, from }) => {
    if (!to) return;

    console.log(`user ${from} call to ${to}`);

    io.to(to).emit("receiveOffer", { signal, from, to });
  };

const onSendAnswer: SocketEventCurrier<SocketEvents["sendAnswer"]> =
  (socket) =>
  ({ to, signal }) => {
    console.log(`user ${socket.id} accept call of ${to}`);
    io.to(to).emit("receiveAnswer", { signal });
  };

const onQueueJoin: SocketEventCurrier<SocketEvents["queueJoin"]> =
  () =>
  ({ id }) => {
    queue.add(id);
    io.emit("queueUpdated", { size: queue.size });
  };

const onQueueExit: SocketEventCurrier<SocketEvents["queueExit"]> =
  () =>
  ({ id }) => {
    queue.delete(id);
    io.emit("queueUpdated", { size: queue.size });
  };

io.listen(4000);

cron.schedule("*/5 * * * * *", () => {
  const _queue = Array.from(queue);

  console.log({ clients: io.engine.clientsCount });

  for (; _queue.length >= 2; ) {
    const roomId = uuid();
    const _users = Array.from(_queue.splice(0, 2));
    const room: Room = { users: _users, host: _users[0] };

    rooms.set(roomId, { host: undefined, users: [] });

    _users.forEach((user) => {
      queue.delete(user);
      users.get(user).emit("roomFound", { room, roomId });
    });
  }
});

console.log("Server up");
