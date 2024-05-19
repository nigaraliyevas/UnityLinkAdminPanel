const barIcon = document.querySelector(".bar-icon");
fetch("http://nadir.somee.com/api/usersmanagment/getusers/1")
  .then(response => response.json())
  .then(datas => {
    const table = document.querySelector(".table-body");
    datas.users.forEach(user => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="d-none" id="${user.id}">ID</td>
        <td>
          <img src="${user.imageUrl}" alt="${user.role}"/>
        </td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.company}</td>
        <td>${user.position}</td>
        <td>${user.userName}</td>
        <td>${user.phoneNumber}</td>
        <td>${user.role}</td>
        <td>${user.emailConfirmed}</td>
        <td>${user.phoneConfirmed}</td>
        <td>
        <button type="button" class="btn btn-success activated">Aktiv et</button>
      </td>        
      `;

      table.appendChild(row);
    });
    const pagesBody = document.querySelector(".pages");
    for (let i = 1; i <= datas.pageCount; i++) {
      pagesBody.innerHTML += `
      <button type="button" class="page-item p-1 page btn btn-primary p-2 mx-1">${i}</button>
      `;
    }
    const pages = document.querySelectorAll(".page");
    pages.forEach(page =>
      page.addEventListener("click", function () {
        table.innerHTML = " ";
        fetch(`http://nadir.somee.com/api/usersmanagment/getusers/${page.innerHTML}`)
          .then(response => response.json())
          .then(datas => {
            datas.users.forEach(user => {
              const row = document.createElement("tr");

              row.innerHTML = `
              <td class="d-none" id="${user.id}">ID</td>
              <td>
                <img src="${user.imageUrl}" alt="${user.role}"/>
              </td>
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
              <td>${user.emailConfirmed}</td>
              <td>${user.phoneConfirmed}</td>
              <td>
              <button type="button" class="btn btn-success activated">Aktiv et</button>
            </td>
            `;

              table.appendChild(row);
            });
          });
      })
    );
  });
function checkStatus(status) {
  status == "true" ? '<i class="fa-regular fa-square-check" style="color: #157347;"></i>' : '<i class="fa-solid fa-square-xmark" style="color: #157347;"></i>';
}
