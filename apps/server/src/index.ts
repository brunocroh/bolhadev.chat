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
  callUser: (props: {
    userToCall: string;
    signalData: any;
    from: string;
  }) => void;
  answerCall: (props: { data: any }) => void;
  me: (id: string) => void;
};

type SocketEventCurrier<T extends SocketEvents[keyof SocketEvents]> = (
  socket: Socket,
) => T;

const queue = new Set<string>();
const users = new Map();
const rooms = new Map<string, Room>();

const io = new Server<SocketEvents, SocketEvents>({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  users.set(socket.id, socket);
  io.emit("newUserConnect", { size: io.engine.clientsCount });

  socket.on("disconnect", () => handleDisconnect(socket)());
  socket.on("queueJoin", (params) => onQueueJoin(socket)(params));
  socket.on("queueExit", (params) => onQueueExit(socket)(params));
  socket.on("callUser", (params) => onCallUser(socket)(params));
  socket.on("answerCall", (params) => onAnswerCall(socket)(params));
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
      console.log("criar sala");
    }
  };

const onCallUser: SocketEventCurrier<SocketEvents["callUser"]> =
  (socket) => () => {
    console.log("user calling");
  };

const onAnswerCall: SocketEventCurrier<SocketEvents["answerCall"]> =
  (socket) => () => {
    console.log("user answer");
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

  console.log({
    queue: _queue,
    users: Array.from(users.keys()),
  });

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
