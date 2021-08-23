const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", socket => {
  console.log("new user connected");

  // to the client itself
  socket.emit("message", "Welcome to Chat");

  // Broadcast ( to all except the client) when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // runs when client discconnects
  socket.on("disconnect", () => {
    // to all
    io.emit("message", "A user has left the chat");
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
