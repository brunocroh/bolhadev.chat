import { Server } from "socket.io";

const io = new Server();

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

io.listen(3000);
