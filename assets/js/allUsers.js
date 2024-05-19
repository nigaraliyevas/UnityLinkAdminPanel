const barIcon = document.querySelector(".bar-icon");

async function fetchUsers(page = 1) {
  const response = await fetch(`http://nadir.somee.com/api/usersmanagment/getusers/${page}/false/false/false`);
  return response.json();
}

function createUserRow(user) {
  const row = document.createElement("tr");
  row.dataset.isActive = user.emailConfirmed; // Initial status
  row.innerHTML = `
    <td class="d-none user" id="${user.id}">ID</td>
    <td><img src="${user.imageUrl}" alt="${user.role}"/></td>
    <td>${user.fullName}</td>
    <td>${user.email}</td>
    <td>${user.company}</td>
    <td>${user.position}</td>
    <td>${user.userName}</td>
    <td>${user.phoneNumber}</td>
    <td>
      <select class="role-select">
        <option>${user.role}</option>
        <option>admin</option>
        <option>moderator</option>
      </select>
    </td>
    <td>${checkStatus(user.emailConfirmed)}</td>
    <td>${checkStatus(user.phoneConfirmed)}</td>
    <td>
      <i class="fa-regular fa-square-check fa-xl active-btn activity-btn" style="color: #157347;"></i>
      <i class="fa-solid fa-square-xmark fa-xl deactive-btn activity-btn" style="color: #c71a1a;"></i>
    </td>
    <td><button type="button" class="btn btn-warning text-white update-btn">Yenilə</button></td>
  `;
  return row;
}

function populateTable(users) {
  const table = document.querySelector(".table-body");
  table.innerHTML = "";
  users.forEach(user => {
    const row = createUserRow(user);
    table.appendChild(row);
  });
  getActivityStatus();
  updateUser();
}

function checkStatus(status) {
  return status ? '<i class="fa-regular fa-square-check fa-xl" style="color: #157347;"></i>' : '<i class="fa-solid fa-square-xmark fa-xl" style="color: #c71a1a;"></i>';
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

async function init() {
  const data = await fetchUsers();
  populateTable(data.users);
  updatePagination(1, data.pageCount);
}

init();

function getActivityStatus() {
  const activityBtns = document.querySelectorAll(".activity-btn");
  activityBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const isActive = this.classList.contains("active-btn");
      return (row.dataset.isActive = isActive);
    });
  });
}
function getRole() {
  const roleSelects = document.querySelectorAll(".role-select");
  roleSelects.forEach(select => {
    select.addEventListener("change", function () {
      return (selectedValue = this.value);
    });
  });
}
function updateUser() {
  const updateBtn = document.querySelectorAll(".update-btn");
  updateBtn.forEach(update => {
    update.addEventListener("click", function () {
      const row = this.closest("tr");
      const id = row.querySelector(".user").id;
      const roleSelect = row.querySelector(".role-select").value;
      const isActive = row.dataset.isActive === "true";
      console.log(typeof id, +" ", roleSelect + " ", isActive);
      fetch("http://nadir.somee.com/api/usersmanagment/UpdateUser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: id,
          IsActive: isActive,
          RoleName: roleSelect,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });
  });
}
