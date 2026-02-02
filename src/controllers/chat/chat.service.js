import users from "../../../users.json" with { type: "json" };
import popUp from "../../utils/popup.js";
import saveToStorage from "../../utils/saveToStorage.js";
import toastMessage from "../../utils/toast.js";

const itemList = document.getElementById("itemList");
const friendsList = document.getElementById("friends-list");
const friendList = localStorage.getItem("friends");
const itemModal = document.getElementById("itemModal");
const chatName = document.getElementById("chat_name");
const chatContainer = document.getElementById("chat-container");
const mainChat = document.getElementById("mainChat");
const sendBtn = document.getElementById("send-btn");

export class ChatService {
  myFriends =
    JSON.parse(friendList) === null || JSON.parse(friendList) === undefined
      ? []
      : JSON.parse(friendList);
  users = users;
  roomList = JSON.parse(sessionStorage.getItem("roomList"));
  getChatRoomList = Array.isArray(this.roomList) ? this.roomList : [];
  authuserId = Number(localStorage.getItem("auth"));
  selectedFriendId;

  getAllUsers(dataToRender = this.users) {
    try {
      itemList.innerHTML = "";

      if (!Array.isArray(users)) {
        toastMessage("unable to read users data", "error");
        return;
      }

      if (dataToRender.length === 0) {
        const itemCard = document.createElement("div");
        itemCard.className = "list-item";

        const ptag = document.createElement("p");
        ptag.textContent = "User not found";

        itemCard.appendChild(ptag);
        itemList.appendChild(itemCard);
        return;
      }

      dataToRender
        .filter((user) => user.id !== this.authuserId)
        .map((user) => {
          const itemCard = document.createElement("div");
          itemCard.className = "list-item";

          const avatar = document.createElement("div");
          avatar.className = "item-avatar";
          avatar.textContent = user.name.slice(0, 2).toUpperCase();

          const userName = document.createElement("span");
          userName.textContent = user.name;

          itemCard.appendChild(avatar);
          itemCard.appendChild(userName);

          itemCard.addEventListener("click", () => {
            popUp({
              title: `confirmation`,
              message: `Are you sure you want to add ${user.name}`,
              success: true,
              open: true,
              proceed: () => {
                this.addfriend(user.id);
                itemModal.classList.add("hidden");
              },
            });
          });

          itemList.appendChild(itemCard);
        });
    } catch (error) {
      console.log(error);
    }
  }

  searchUser(searchQuery) {
    try {
      if (searchQuery === "") return this.getAllUsers();

      const searchWord = searchQuery.trim().toLowerCase();
      const results = this.users.filter((user) =>
        user.name.toLocaleLowerCase().includes(searchWord),
      );
      this.getAllUsers(results);
    } catch (error) {
      console.log(error);
    }
  }

  getAllFriends() {
    try {
      friendsList.innerHTML = "";
      const hasFriends = this.myFriends.find(
        (friends) => Number(friends.authId) === this.authuserId,
      );

      const friends = Array.isArray(hasFriends?.friends)
        ? hasFriends.friends
        : [];

      if (!hasFriends || friends?.length === 0) {
        const message = document.createElement("p");
        message.textContent =
          "you don't have any friends yet click add to add a friend";
        message.style.textAlign = "center";
        message.style.marginTop = "100px";
        message.style.padding = "19px";

        friendsList.appendChild(message);
      }

      friends.map((friend) => {
        const frinedCard = document.createElement("div");
        frinedCard.className = `friend-item ${friend.status.includes("Online") && "active"} `;

        const avater = document.createElement("div");
        avater.className = "avatar";
        avater.textContent = friend.name.slice(0, 2);

        const friendInfo = document.createElement("div");
        friendInfo.className = "friend-info";

        const friendName = document.createElement("h4");
        friendName.textContent = friend.name;

        const status = document.createElement("p");
        status.textContent = friend.status;

        frinedCard.appendChild(avater);
        friendInfo.appendChild(friendName);
        friendInfo.appendChild(status);

        frinedCard.appendChild(friendInfo);
        frinedCard.addEventListener("click", () => {
          chatName.textContent = friend.name;
          this.chatRoom(friend.id);
          this.selectedFriendId = friend.id;
          sendBtn.classList.add("hidden");
          mainChat.classList.remove("hidden");
        });

        friendsList.appendChild(frinedCard);
      });
    } catch (error) {
      console.error(error);
    }
  }

  addfriend(id) {
    try {
      if (!id) {
        toastMessage("user id required", "error");
        return;
      }

      const newFriend = this.users.find((user) => user.id === id);
      if (!newFriend) {
        toastMessage("User not found", "error");
        return;
      }

      const hasFriends = this.myFriends.find(
        (record) => Number(record.authId) === this.authuserId,
      );

      if (!hasFriends) {
        const friendRecord = {
          authId: this.authuserId,
          friends: [newFriend],
        };
        this.myFriends.push(friendRecord);
        saveToStorage({
          storageType: "local",
          key: "friends",
          data: JSON.stringify(this.myFriends),
        });
        this.getAllFriends();
        return;
      }

      const isAlreadyFriend = hasFriends.friends.find((f) => f.id === id);
      if (isAlreadyFriend) {
        toastMessage("User is already your friend", "error");
        return;
      }

      hasFriends.friends = [...hasFriends.friends, newFriend];

      toastMessage(`You have added ${newFriend.name}`, "success");
      saveToStorage({
        storageType: "local",
        key: "friends",
        data: JSON.stringify(this.myFriends),
      });
      this.getAllFriends();
    } catch (error) {
      console.log(error);
    }
  }

  chatFriend(_, message) {
    try {
      const selectRoom = this.getChatRoomList.find(
        (rooms) =>
          (Number(rooms.user1Id) === Number(this.selectedFriendId) &&
            Number(rooms.user2Id) === this.authuserId) ||
          (Number(rooms.user1Id) === this.authuserId &&
            Number(rooms.user2Id) === Number(this.selectedFriendId)),
      );

      const chatObject = {
        userid: this.authuserId,
        message: message,
        timestamp: new Date().toDateString(),
      };

      if (!Array.isArray(selectRoom.chats)) {
        selectRoom.chats = [];
      }

      selectRoom.chats = [...(selectRoom.chats || []), chatObject];
      this.chatRoom(this.selectedFriendId);
      saveToStorage({
        storageType: "session",
        key: "roomList",
        data: JSON.stringify(this.getChatRoomList),
      });

      return;
    } catch (error) {
      console.error();
      error;
    }
  }

  chatRoom(selectedChat) {
    chatContainer.innerHTML = "";
    try {
      if (!this.authuserId) return;

      const selectRoom = this.getChatRoomList.find(
        (rooms) =>
          (Number(rooms.user1Id) === Number(selectedChat) &&
            Number(rooms.user2Id) === this.authuserId) ||
          (Number(rooms.user1Id) === this.authuserId &&
            Number(rooms.user2Id) === Number(selectedChat)),
      );

      if (typeof selectRoom === "object") {
        const chats = Array.isArray(selectRoom.chats) ? selectRoom.chats : [];

        chats.map((chat) => {
          const receiverDiv = document.createElement("div");
          receiverDiv.className = "message received";
          receiverDiv.textContent = chat.message || "";

          const senderDiv = document.createElement("div");
          senderDiv.className = "message sent";
          senderDiv.textContent = chat.message || "";

          if (Number(chat.userid) === this.authuserId) {
            chatContainer.appendChild(senderDiv);
          } else {
            chatContainer.appendChild(receiverDiv);
          }
        });
        return selectRoom.chats;
      }

      const newChartRoomObject = {
        id: this.getChatRoomList.length + 1,
        user1Id: this.authuserId,
        user2Id: Number(selectedChat),
        chats: [],
      };

      this.getChatRoomList.push(newChartRoomObject);
      saveToStorage({
        storageType: "session",
        key: "roomList",
        data: JSON.stringify(this.getChatRoomList),
      });

      console.log(this.getChatRoomList);
    } catch (error) {
      console.error(error);
    }
  }
}
