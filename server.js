const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", socket => {
  console.log("new user connected");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome message to the new client
    socket.emit(
      "message",
      formatMessage("MD@Chat Bot", `Hi there! Welcome ${username} to ${room}`)
    );

    // Broadcast ( to all except the client) when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("MD@Chat Bot", `${username} has joined the chat`)
      );
  });

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    const { username, room } = getCurrentUser(socket.id);

    // io.emit("message", msg);
    io.to(room).emit("message", formatMessage(username, msg));
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    const { username, room } = getCurrentUser(socket.id);

    // to all
    io.to(room).emit(
      "message",
      formatMessage("MD@Chat Bot", `${username} has left the chat`)
    );
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
