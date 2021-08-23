const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat-messages-container");

// Get userName and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ users, room }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  // get message text
  const inputElement = e.target.elements.msg;
  const msg = inputElement.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input and refocus
  inputElement.value = "";
  inputElement.focus();
});

function outputMessage(message) {
  const { username, text, time } = message;
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>`;
  chatMessages.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  const roomNameElement = document.getElementById("room-name");
  roomNameElement.innerText = room;
}

// Add users to sidebar
function outputUsers(users) {
  const userContainer = document.getElementById("users");
  userContainer.innerHTML = users.reduce(
    (innerElementString, { username }) =>
      `${innerElementString}<li>${username}</li>`,
    ""
  );
}
