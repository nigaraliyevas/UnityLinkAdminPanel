const signinBtn = document.querySelector(".signin-btn");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

signinBtn.addEventListener("click", async function (ev) {
  ev.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  console.log(email, password);

  if (email === "" || password === "") {
    Swal.fire({
      title: "Şifrə və ya Adres boş ola bilməz!",
      icon: "error",
    });
    return;
  }

  try {
    const response = await fetch("http://ismayilov.somee.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      Swal.fire({
        title: "Uğurlu!",
        icon: "success",
      });
      localStorage.setItem("accessToken", data.access_Token.result);
      // localStorage.setItem("refreshToken", data.refresh_Token.result);

      window.location.href = "./../../allUsers.html";
    } else {
      const errorData = await response.json();
      Swal.fire({
        title: "Şifrə və ya Adres yanlışdır",
        text: errorData.message || "Yanlış məlumat daxil edildi",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Şifrə və ya Adres yanlışdır",
      text: "Bir xəta baş verdi, zəhmət olmasa yenidən cəhd edin",
      icon: "error",
    });
  }
});
