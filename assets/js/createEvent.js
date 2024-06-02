const selectedUsersId = [];
let isAllUsers = true;
let isActive = true;
const usersPerPage = 10;

$(document).ready(function () {
  const isAllUsersCheck = $("#IsAllUsers");
  const isActiveCheckBox = $("#IsActive");
  const createEventUsers = $(".create-event__users");

  function toggleCreateEventUsers() {
    if (isAllUsersCheck.is(":checked")) {
      createEventUsers.hide();
      isAllUsers = true;
    } else {
      createEventUsers.show();
      isAllUsers = false;
    }
  }

  toggleCreateEventUsers();

  isAllUsersCheck.change(function () {
    toggleCreateEventUsers();
  });

  function isActiveCheck() {
    return isActiveCheckBox.is(":checked") ? (isActive = true) : false;
  }

  isActiveCheck();

  isActiveCheckBox.change(function () {
    isActiveCheck();
  });

  $("#create-event__form").submit(function (event) {
    event.preventDefault();
    uploadImage();
    checkInputsNullOrEmpty();
  });

  init();
});

async function fetchUsers(page = 1) {
  const response = await fetch(`http://nadir.somee.com/api/usersmanagment/getusers/${page}/false/false/false`);
  const data = await response.json();
  return data;
}

function createUserRow(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="" data-id="${user.id}">
      <input type="checkbox" ${selectedUsersId.includes(user.id) ? "checked" : ""} />
    </td>
    <td>
      <img src="${user.imageUrl}" alt="" width="50" height="50" />
    </td>
    <td>${user.fullName}</td>
    <td>${user.company}</td>
  `;

  const checkbox = row.querySelector("input[type='checkbox']");
  checkbox.addEventListener("click", function (event) {
    const userId = this.closest("td").getAttribute("data-id");
    if (this.checked) {
      if (!selectedUsersId.includes(userId)) {
        selectedUsersId.push(userId);
      }
    } else {
      const index = selectedUsersId.indexOf(userId);
      if (index > -1) {
        selectedUsersId.splice(index, 1);
      }
    }
  });

  return row;
}

async function init() {
  const data = await fetchUsers();
  populateTable(data.users);
  updatePagination(1, data.pageCount);
}

function populateTable(users) {
  const table = document.querySelector(".create-event__users-tbody");
  table.innerHTML = "";
  users.forEach(user => {
    const row = createUserRow(user);
    table.appendChild(row);
  });
}

async function loadPage(page) {
  const data = await fetchUsers(page);
  populateTable(data.users);
  updatePagination(page, data.pageCount);
}

function updatePagination(currentPage, totalPages) {
  const pagesBody = document.querySelector(".pages");
  pagesBody.innerHTML = "";

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "page-item btn btn-primary p-2 mx-1";
    prevButton.textContent = "Əvvəlki";
    prevButton.addEventListener("click", () => loadPage(currentPage - 1));
    pagesBody.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `page-item btn btn-primary p-2 mx-1 ${i === currentPage ? "active" : ""}`;
    button.textContent = i;
    button.addEventListener("click", () => loadPage(i));
    pagesBody.appendChild(button);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "page-item btn btn-primary p-2 mx-1";
    nextButton.textContent = "Növbəti";
    nextButton.addEventListener("click", () => loadPage(currentPage + 1));
    pagesBody.appendChild(nextButton);
  }
}

function createEvent(imageBase64) {
  fetch("http://nadir.somee.com/api/EventsManagment/CreateEvent/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Title: document.querySelector("#Title").value.trim(),
      Content: document.querySelector("#Content").value.trim(),
      Address: document.querySelector("#Address").value.trim(),
      DateTime: document.querySelector("#DateTime").value,
      IsAllUsers: isAllUsers,
      IsActive: isActive,
      UserIds: checkTrueOrFalseIsAllUsers(),
      Image: imageBase64,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Event created successfully:", data);
    })
    .then(response => {
      if (response.status == 200 || response.status == 204) {
        console.log("Request successful with status 200: OK");
        // Handle the response if needed
      }
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function checkTrueOrFalseIsAllUsers() {
  if (!isAllUsers && selectedUsersId.length === 0) {
    alert("Ən azı bir istifadəçi seçin");
    return null;
  }
  return isAllUsers ? null : selectedUsersId;
}

function uploadImage() {
  const input = document.getElementById("Image");
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (ev) {
      const imageBase64 = ev.target.result.split(",")[1];
      createEvent(imageBase64);
    };

    reader.readAsDataURL(file); 
  } else {
    alert("File seçilmədi");
  }
}
function checkInputsNullOrEmpty() {
  if (document.querySelector("#Title").value.trim() === null || document.querySelector("#Title").value.trim() == "" || document.querySelector("#Content").value.trim() === null || document.querySelector("#Content").value.trim() == "" || document.querySelector("#Address").value.trim() === null || document.querySelector("#Address").value.trim() == "" || document.querySelector("#DateTime").value === null || document.querySelector("#DateTime").value == "") {
    return alert("Xanalar boş ola bilməz!");
  }
}
init();
