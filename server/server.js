const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = uuidv4();
  console.log(`A user connected with ID: ${userId}`);

  socket.emit("set user id", userId);

  socket.on("chat message", (msg) => {
    io.emit("chat message", { userId, message: msg });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
