// const barIcon = document.querySelector(".bar-icon");
// const hiddenNav = document.querySelector(".hidden-nav");
// Local Time
const dateTime = document.querySelector(".date-time");

function writeLocalTime() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `Bugün ${day}/${month}/${year}`;
  dateTime.textContent = fullDate;
}
writeLocalTime();

const footerCopyright = document.querySelector(".footer-copyright");

function writeCopyrightYear() {
  let date = new Date();
  let year = date.getFullYear();
  let fullContent = `©${year}. Bütün hüquqlar qorunur`;
  footerCopyright.textContent = fullContent;
}
writeCopyrightYear();

$(document).ready(function () {
  $(".barIcon").click(function () {
    $(".hiddenNav").slideToggle("slow");
  });
});
