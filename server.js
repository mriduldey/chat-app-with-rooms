const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const formatMessage = require("./utils/message");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", socket => {
  console.log("new user connected");

  // Welcome message to the new client
  socket.emit("message", formatMessage("MD@Chat Bot", "Welcome to Chat"));

  // Broadcast ( to all except the client) when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage("MD@Chat Bot", "A new user has joined the chat")
  );

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    // io.emit("message", msg);
    io.emit("message", formatMessage("User", msg));
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    // to all
    io.emit("message", formatMessage("MD@Chat Bot", "A user has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
