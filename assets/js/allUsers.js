const barIcon = document.querySelector(".bar-icon");

async function fetchUsers(page = 1) {
  const response = await fetch(`http://nadir.somee.com/api/usersmanagment/getusers/${page}`);
  return response.json();
}

function createUserRow(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="d-none" id="${user.id}">ID</td>
    <td><img src="${user.imageUrl}" alt="${user.role}"/></td>
    <td>${user.fullName}</td>
    <td>${user.email}</td>
    <td>${user.company}</td>
    <td>${user.position}</td>
    <td>${user.userName}</td>
    <td>${user.phoneNumber}</td>
    <td>
      <select>
        <option>${user.role}</option>
        <option>${user.role}</option>
        <option>${user.role}</option>
      </select>
    </td>
    <td>${checkStatus(user.emailConfirmed)}</td>
    <td>${checkStatus(user.phoneConfirmed)}</td>
    <td><button type="button" class="btn btn-success activated">Aktiv et</button></td>
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
