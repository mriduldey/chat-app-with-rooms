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
socket.on("roomUsers", ({ username, room }) => {
  outputRoomName(room);
  outputUsers(username);
});

// Message from server
socket.on("message", message => {
  console.log(username, room);
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
  console.log(roomNameElement);
  roomNameElement.innerText = room;
}

// Add
