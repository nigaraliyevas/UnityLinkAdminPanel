const barIcon = document.querySelector(".bar-icon");

async function fetchUsers(page = 1, filter = "all") {
  const filterParams = getFilterParams(filter);
  const response = await fetch(`http://nadir.somee.com/api/usersmanagment/getusers/${page}/${filterParams}`);
  return response.json();
}

function getFilterParams(filter) {
  switch (filter) {
    case "confirmedActivity":
      return "false/true/false"; // Assuming this means emailConfirmed is false, phoneConfirmed is true, isActive is false
    case "unconfirmedEmail":
      return "true/false/false"; // Assuming this means emailConfirmed is false
    case "unconfirmedNumber":
      return "true/false/true"; // Assuming this means phoneConfirmed is false
    default:
      return "false/false/false"; // Default case, if 'all' is selected
  }
}

function createUserRow(user) {
  const row = document.createElement("tr");
  row.classList.add("trow");
  // row.dataset.isActive = user.emailConfirmed;
  row.innerHTML = `
    <td data-cell="id" row-header="" data-label="ID" class="d-none user" id="${user.id}">ID</td>
    <td data-cell="Şəkil" row-header="" data-label="Şəkil"><img src="${user.imageUrl}" alt="${user.role}"/></td>
    <td data-cell="Ad və Soyad" row-header="" data-label="Ad və Soyad">${user.fullName}</td>
    <td data-cell="Email" row-header="" data-label="Email">${user.email}</td>
    <td data-cell="Şirkət" row-header="" data-label="Şirkət">${user.company}</td>
    <td data-cell="Vəzifə" row-header="" data-label="Vəzifə">${user.position}</td>
    <td data-cell="İstifadəçi adı" row-header="" data-label="İstifadəçi adı">${user.userName}</td>
    <td data-cell="Telefon" row-header="" data-label="Telefon">${user.phoneNumber}</td>
    <td data-cell="Roles" row-header="" data-label="Roles">
      <select class="role-select">
        ${getRoleOptions(user.role)}
      </select>
    </td>
    <td data-cell="Email Status" row-header="" data-label="Email Status">${checkStatus(user.emailConfirmed)}</td>
    <td data-cell="Aktiv Status" row-header="" data-label="Aktiv Status">${checkStatus(user.isActive)}</td>
    <td data-cell="Aktivlik Statusunun Redaktəsi" row-header="" data-label="Aktivlik Statusunun Redaktəsi">
      <div>
      <i class="fa-regular fa-square-check fa-xl active-btn activity-btn" style="color: #157347;"></i>
      <i class="fa-solid fa-square-xmark fa-xl deactive-btn activity-btn" style="color: #c71a1a;"></i>
      </div>
    </td>
    <td data-cell="⚙  " row-header="" data-label="Actions"><button type="button" class="btn btn-warning text-white update-btn">Yenilə</button></td>
  `;
  return row;
}

function getRoleOptions(currentRole) {
  const roles = ["user", "admin", "moderator"];
  return roles
    .map(role => {
      if (role === currentRole) {
        return `<option value="${role}" selected>${role}</option>`;
      } else {
        return `<option value="${role}">${role}</option>`;
      }
    })
    .join("");
}

function populateTable(users) {
  const table = document.querySelector(".table-body");
  table.innerHTML = "";
  users.forEach(user => {
    const row = createUserRow(user);
    table.appendChild(row);
  });
  getActivityStatus();
  getRole();
  updateUser();
}

function checkStatus(status) {
  return status ? '<i class="fa-regular fa-square-check fa-xl" style="color: #157347;"></i>' : '<i class="fa-solid fa-square-xmark fa-xl" style="color: #c71a1a;"></i>';
}

async function loadPage(page, filter = "all") {
  const data = await fetchUsers(page, filter);
  populateTable(data.users);
  updatePagination(page, data.pageCount, filter);
}

function updatePagination(currentPage, totalPages, filter) {
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
    prevButton.addEventListener("click", () => loadPage(currentPage - 1, filter));
    pagesBody.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `page-item btn btn-primary p-2 mx-1 ${i === currentPage ? "active" : ""}`;
    button.textContent = i;
    button.addEventListener("click", () => loadPage(i, filter));
    pagesBody.appendChild(button);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "page-item btn btn-primary p-2 mx-1";
    nextButton.textContent = "Növbəti";
    nextButton.addEventListener("click", () => loadPage(currentPage + 1, filter));
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
      row.dataset.isActive = isActive;
    });
  });
}

function getRole() {
  const roleSelects = document.querySelectorAll(".role-select");
  roleSelects.forEach(select => {
    select.addEventListener("change", function () {
      const row = this.closest("tr");
      const selectedValue = this.value;
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

function searchUser() {
  const searchValue = document.querySelector(".search-input").value;
  fetch(`http://nadir.somee.com/api/usersmanagment/getsearchusers/${searchValue}`)
    .then(response => response.json())
    .then(data => {
      populateTable(data.users);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

const searchButton = document.querySelector(".search-btn");
searchButton.addEventListener("click", searchUser);

const filterSelect = document.getElementById("select");
filterSelect.addEventListener("change", function () {
  loadPage(1, this.value);
});
