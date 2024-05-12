import { Server } from "socket.io";

type Room = {
  id: string;
  peer: null;
  users: string[];
  host: string;
};

type ServerToClientEvents = {
  enterRoom: (props: { room: string }) => void;
  createRoom: (props: { room: string; peer: string; owner: string }) => void;
  mediaOffer: (props: { from: string; to: string; offer: any }) => void;
  mediaAnswer: (props: { from: string; to: string; answer: any }) => void;
  iceCandidate: (props: { to: string; candidate: any }) => void;
};

type ClientToServerEvents = {
  updateUserList: (props: { connectedUsers: string[] }) => void;
  roomDetails: (props: { room: Room }) => void;
  enterRoom: (props: { room: Room }) => void;
  roomCreated: (props: { room: Room }) => void;
  mediaOffer: (props: { from: string; offer: any }) => void;
  mediaAnswer: (props: { from: string; answer: any }) => void;
  remotePeerIceCandidate: (props: { candidate: any; from: string }) => void;
};

const connectedUsers = new Map<string, string>();
const rooms = new Map<string, Room>();

const disconectUser = (userId: string) => {
  const roomId = connectedUsers.get(userId);
  if (!roomId) {
    console.warn(`The user ${userId} is not related to any room `);
    return;
  }

  const room = rooms.get(roomId);

  if (!room) {
    console.warn(`The room ${roomId} does not exist `);
    return;
  }

  room.users = room.users.filter((id) => id !== userId);
  rooms.set(room.id, room);
  connectedUsers.delete(userId);

  io.to(roomId).emit("roomDetails", { room });
};

const io = new Server<ServerToClientEvents, ClientToServerEvents>({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    disconectUser(socket.id);
  });

  socket.on("enterRoom", ({ room: roomName }) => {
    socket.join(roomName);
    connectedUsers.set(socket.id, roomName);
    let room: Room = {
      id: roomName,
      peer: null,
      users: [],
      host: socket.id,
    };

    if (rooms.has(roomName)) {
      room = rooms.get(roomName)!;
    }

    const newRoomState = {
      ...room,
      users: [...room.users, socket.id],
    };

    rooms.set(roomName, newRoomState);

    io.to(roomName).emit("roomDetails", { room: newRoomState });
    socket.emit("enterRoom", { room: newRoomState });
  });

  socket.on("mediaOffer", (data) => {
    console.log("mediaOfer");
    socket.to(data.to).emit("mediaOffer", {
      from: data.from,
      offer: data.offer,
    });
  });

  socket.on("mediaAnswer", (data) => {
    socket.to(data.to).emit("mediaAnswer", {
      from: data.from,
      answer: data.answer,
    });
  });

  socket.on("iceCandidate", (data) => {
    socket.to(data.to).emit("remotePeerIceCandidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });
});

io.listen(4000);

console.log("Server up");
