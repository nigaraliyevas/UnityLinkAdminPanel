const signinBtn = document.querySelector(".signin-btn");
const password = document.querySelector("#password");
const address = document.querySelector("#address");
signinBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  if (true) {
    console.log(password.value);
    Swal.fire({
      title: "Uğurlu!",
      icon: "success",
    });
    window.location.href = "./../../allUsers.html";
  } else if (password.value == "" || address.value == "") {
    Swal.fire({
      title: "Şifrə və ya Adres boş ola bilməz!",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Şifrə və ya Adres yanlışdır",
      icon: "error",
    });
  }
});
