import popUp from "../../utils/popup.js";
import toastMessage from "../../utils/toast.js";
import authController from "../Auth/auth.js";
import chat from "./chat.js";

const loader = document.getElementById("loader-container");
const logout = document.getElementById("logout");
const name = document.getElementById("name");
const email = document.getElementById("email");
const addFriendBtn = document.getElementById("addFriend");
const closeListModal = document.getElementById("closeListModal");
const itemModal = document.getElementById("itemModal");
const searchUsers = document.getElementById("itemSearch");
const sendBtn = document.getElementById("send-btn");
const message = document.getElementById("message");

window.addEventListener("load", () => {
  const loadAuthUser = authController.validateAuthenticatedUser();
  loader.classList.remove("hidden");

  if (!loadAuthUser) {
    window.location.href = `./login.html`;
    return;
  }

  chat.allFriends();

  const getUser = JSON.parse(localStorage.getItem("user"));

  if (typeof getUser !== "object") {
    toastMessage("invalid user data", "error");
    return;
  }

  name.textContent = getUser.name;
  email.textContent = getUser.email;

  loader.classList.add("hiddden");
});

logout.addEventListener("click", () => {
  popUp({
    message:
      "Are you sure you want to leave? Any unsaved messages might be lost.",
    open: true,
    destructive: true,
    title: "Comfirm Logout",
    proceed: () => {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      window.location.href = `./login.html`;
    },
  });
});

addFriendBtn.addEventListener("click", () => {
  itemModal.classList.remove("hidden");
  chat.allUsers();
});

closeListModal.addEventListener("click", () => {
  itemModal.classList.add("hidden");
});

searchUsers.addEventListener("input", () => {
  chat.searchUserByName(searchUsers.value);
});

sendBtn.addEventListener("click", () => {
  chat.chatMessage(message.value);
  message.value = "";
});

message.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    chat.chatMessage(message.value);
    message.value = "";
    sendBtn.classList.add("hidden");
  }
});

message.addEventListener("input", () => {
  if (message.value !== "") {
    sendBtn.classList.remove("hidden");
  } else {
    sendBtn.classList.add("hidden");
  }
});
