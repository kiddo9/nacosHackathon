import authController from "./auth.js";
const loginButton = document.getElementById("loginButton");

loginButton?.addEventListener("click", () => {
  authController.logUser();
});

window.addEventListener("load", () => {
  console.log("yh");
  const loadAuthUser = authController.validateAuthenticatedUser();

  if (loadAuthUser) {
    window.location.href = `/src/index.html`;
    return;
  }
});
