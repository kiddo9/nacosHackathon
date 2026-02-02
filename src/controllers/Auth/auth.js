import { Authentication } from "./auth.service.js";

class AuthController extends Authentication {
  logUser() {
    const email = document.getElementById("email")?.value;
    const pwd = document.getElementById("password")?.value;
    try {
      const userInfo = this.loginUser({
        email: email,
        password: pwd,
      });

      if (userInfo) {
        window.location.href = `./index.html`;
      }

      return userInfo;
    } catch (error) {
      console.error("server error", error);
      return;
    }
  }

  validateAuthenticatedUser() {
    try {
      const id = Number(localStorage.getItem("auth"));
      const authUser = this.validateUser(id);
      return authUser;
    } catch (error) {
      console.error("server error", error);
      return;
    }
  }
}

const authController = new AuthController();
export default authController;
