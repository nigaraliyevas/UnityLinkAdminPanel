const signinBtn = document.querySelector(".signin-btn");
const loginForm = document.getElementById("login-form");

signinBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  window.location.href = "./../../allUsers.html";
});
