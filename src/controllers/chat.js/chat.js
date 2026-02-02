import toastMessage from "../../utils/toast.js";
import { ChatService } from "./chat.service.js";

class ChatController extends ChatService {
  allUsers() {
    try {
      return this.getAllUsers();
    } catch (error) {
      console.log(error);
    }
  }

  searchUserByName(searchWord) {
    try {
      return this.searchUser(searchWord);
    } catch (error) {
      console.error(error);
    }
  }

  allFriends() {
    try {
      return this.getAllFriends();
    } catch (error) {
      console.error(error);
    }
  }

  chatMessage(message) {
    try {
      if (message === "") {
        toastMessage("enter a message", "error");
        return;
      }

      this.chatFriend("", message);
    } catch (error) {
      console.error(error);
    }
  }
}

const chat = new ChatController();
export default chat;
