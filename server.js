const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", socket => {
  const { id } = socket;

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(id, username, room);

    socket.join(user.room);

    // Welcome message to the new client
    socket.emit(
      "message",
      formatMessage("MD@Chat Bot", `Hi ${username}! Welcome  to ${room}`)
    );

    // Broadcast ( to all except the client) when a user connects
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage("MD@Chat Bot", `${username} has joined the chat`)
      );

    // Send Users and Room info
    io.to(room).emit("roomUsers", {
      room,
      users: getRoomUsers(room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    const { username, room } = getCurrentUser(id);

    // io.emit("message", msg);
    io.to(room).emit("message", formatMessage(username, msg));
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    if (getCurrentUser(id)) {
      const { username, room } = getCurrentUser(id);

      // to all
      io.to(room).emit(
        "message",
        formatMessage("MD@Chat Bot", `${username} has left the chat`)
      );

      userLeave(id);

      // Send Users and Room info
      io.to(room).emit("roomUsers", {
        room,
        users: getRoomUsers(room),
      });
    }
  });
});

const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
