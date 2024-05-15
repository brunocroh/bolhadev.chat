import WebSocket, { WebSocketServer } from "ws";
import Http from "http";
import { v4 as uuid } from "uuid";
import cron from "node-cron";

const server = Http.createServer();
const wss = new WebSocketServer({ server });

type Room = {
  host?: string;
  users: string[];
};

type onQueueUpdate = {
  userId: string;
};

type QueueMe = {
  type: "me";
};

type QueueUpdateEvent = {
  type: "queueJoin" | "queueExit";
  id: string;
};

type SocketEvents = QueueUpdateEvent | QueueMe;

function broadcastMessage(json: any) {
  const data = JSON.stringify(json);
  for (let user of users.values()) {
    if (user.readyState === WebSocket.OPEN) {
      user.send(data);
    }
  }
}

const queue = new Set<string>();
const users = new Map<string, any>();
const rooms = new Map<string, Room>();

wss.on("connection", (ws) => {
  console.log("user Connected");
  const userId = uuid();
  users.set(userId, ws);

  ws.on("message", (data) => {
    const event = JSON.parse(data.toString()) as SocketEvents;

    switch (event.type) {
      case "me":
        const mee = JSON.stringify({ id: userId });
        console.log({ size: users.size });
        ws.send(mee);
        broadcastMessage({ type: "usersOnline", size: users.size });
        break;
      case "queueJoin":
        onQueueJoin({ userId: event.id });
        break;
      case "queueExit":
        onQueueExit({ userId: event.id });
        break;
      default:
        break;
    }
  });

  ws.on("close", () => handleDisconnect(userId));
});

// ws.on("connection", (socket) => {
//   socket.emit("me", socket.id);
//   users.set(socket.id, socket);
//   ws.emit("newUserConnect", { size: ws.engine.clientsCount });
//
//   socket.on("disconnect", () => handleDisconnect(socket)());
//   socket.on("queueJoin", onQueueJoin(socket));
//   socket.on("queueExit", onQueueExit(socket));
//   socket.on("sendOffer", onSendOffer(socket));
//   socket.on("sendAnswer", onSendAnswer(socket));
//   socket.on("roomEnter", onRoomEnter(socket));
// });

const handleDisconnect = (userId: string) => {
  console.log("user disconnected");
  queue.delete(userId);
  users.delete(userId);
  broadcastMessage({
    type: "teste",
    size: users.size,
  });
};

const onRoomEnter =
  (socket: any) =>
  ({ roomId, id }: any) => {
    const room = rooms.get(roomId);

    if (!room) return;

    room.users.push(id);

    if (room?.users.length === 2) {
      socket.emit("hostCall", { to: room.users[0] });
    }
  };

const onSendOffer = ({ to, signal, from }: any) => {
  if (!to) return;

  console.log(`user ${from} call to ${to} on ${signal}`);

  //ws.to(to).emit("receiveOffer", { signal, from, to });
};

const onSendAnswer =
  (socket: any) =>
  ({ to, signal }: any) => {
    console.log(`user ${socket.id} accept call of ${to} ${signal}`);
    // ws.to(to).emit("receiveAnswer", { signal });
  };

const onQueueJoin = ({ userId }: onQueueUpdate) => {
  queue.add(userId);
};

const onQueueExit = ({ userId }: onQueueUpdate) => {
  queue.delete(userId);
};

server.listen(4000, () => {
  console.log("Server up");
});

// cron.schedule("*/5 * * * * *", () => {
//   const _queue = Array.from(queue);
//
//   for (; _queue.length >= 2; ) {
//     const roomId = uuid();
//     const _users = Array.from(_queue.splice(0, 2));
//     const room: Room = { users: _users, host: _users[0] };
//
//     rooms.set(roomId, { host: undefined, users: [] });
//
//     _users.forEach((user) => {
//       queue.delete(user);
//       users.get(user).emit("roomFound", { room, roomId });
//     });
//   }
// });
