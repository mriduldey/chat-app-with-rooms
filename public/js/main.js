const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat-messages-container");

// Message from server
socket.on("message", message => {
  console.log(message);
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
  const { userName, text, time } = message;
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${userName} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>`;
  chatMessages.appendChild(div);
}
