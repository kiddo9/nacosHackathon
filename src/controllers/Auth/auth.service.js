import users from "../../users.json" with { type: "json" };
import saveToStorage from "../../utils/saveToStorage.js";
import toastMessage from "../../utils/toast.js";
const loader = document.getElementById("loader-container");

export class Authentication {
  Users = users;

  loginUser({ email, password }) {
    loader.classList.remove("hidden");
    try {
      if (typeof email !== "string" || typeof password !== "string") {
        toastMessage("invalid data type", "error");
        console.error("invalid data type");
        return;
      }
      if (!email || !password) {
        toastMessage("please enter user details", "error");
        console.error("please enter user details");
        return;
      }

      const isExisting = this.Users.find((user) => user.email === email.trim());

      if (!isExisting) {
        toastMessage("user not found", "error");
        console.error("user not found");
        return;
      }
      if (isExisting.password !== password) {
        toastMessage("user not found", "error");
        console.error("user not found");
        return;
      }

      saveToStorage({
        storageType: "local",
        key: "auth",
        data: String(isExisting?.id),
      });

      saveToStorage({
        storageType: "local",
        key: "user",
        data: JSON.stringify(isExisting),
      });

      return isExisting;
    } catch (error) {
      console.error("server error", error);
      return;
    } finally {
      loader.classList.add("hidden");
    }
  }

  validateUser(id) {
    loader.classList.remove("hidden");
    try {
      if (!id) {
        console.error("id parameter required");
        return;
      }

      if (typeof id !== "number") {
        console.error("invalid parameter");
        return;
      }

      const getUser = this.Users.find((user) => user.id === id);
      if (!getUser) throw new Error("unknown user");

      return getUser;
    } catch (error) {
      console.error("error", error);
      return;
    } finally {
      loader.classList.add("hidden");
    }
  }
}
