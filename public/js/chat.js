// const axios = require("axios");
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export default socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const $messages = document.querySelector("#messages");

const getCredentials = async () => {
  const username = prompt("Enter username");
  const password = prompt("Enter password");

  const data = await axios.post(
    "http://localhost:3000/api/v1/user/login",
    {
      username,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  console.log(data);

  return { username, password };
};

const { username } = getCredentials();

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    // username: msg.username,
    // message: msg.text,
    // createdAt: moment(msg.createdAt).format("h:mm a"),
    message: message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
  e.target.elements.message.value = "";
});
