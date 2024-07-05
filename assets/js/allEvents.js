const usersPerPage = 10;

async function fetchEvents(page = 1, filter = "allUsers") {
  const filterParams = getFilterParams(filter);
  const response = await fetch(`http://nadir.somee.com/api/EventsManagment/GetEvents/${page}/${filterParams}`);
  return response.json();
}

function getFilterParams(filter) {
  switch (filter) {
    case "allUsers":
      return "false/false";
    case "isAllUsers":
      return "false/true";
    case "IsActive":
      return "true/false";
    default:
      return "false/false";
  }
}

function populateAllEvents(event) {
  const allEvents = document.querySelector(".all-events__field");
  allEvents.innerHTML = "";
  event.forEach(event => {
    const row = createEventRow(event);
    allEvents.appendChild(row);
  });
  getDeleteEventBtn();
}

function createEventRow(event) {
  const row = document.createElement("div");
  row.classList.add("all-event__event", "d-flex", "flex-lg-nowrap", "flex-wrap", "flex-md-nowrap", "gap-3", "w-100");

  // Split content into words and check if it's more than 25 words
  const contentWords = event.content.split(" ");
  const initialContent = contentWords.slice(0, 25).join(" ");
  const remainingContent = contentWords.slice(25).join(" ");

  row.innerHTML = `
      <div class="all-event__event-left">
          <img src="${event.imageUrl}" alt="" class="" width="300" height="280" />
      </div>
      <div class="all-event__event-right">
          <h6 class=""><i class="fa-regular fa-pen-to-square"></i>Başlıq</h6>
          <p class="event-title" data-id="${event.id}">${event.title}</p>
          <h6 class=""><i class="fa-solid fa-align-left"></i>Mövzu:</h6>
          <p class="event-content">${initialContent}${remainingContent ? "..." : ""}</p>
          ${remainingContent ? `<button class="btn btn-warning btn-loadMore px-1 py-1 d-inline-block mb-4">Load More...</button>` : ""}
          <div class="full-content d-none">${remainingContent}</div>
          <div class="d-flex gap-lg-5 gap-3 flex-wrap flex-md-nowrap flex-lg-nowrap">
              <div class="">
                  <h6 class="">Yaranma tarixi:</h6>
                  <p class="">${changeDateFormat(event.createdTime)}</p>
              </div>
              <div class="">
                  <h6 class="">Yaradan:</h6>
                  <p class="">${event.createdBy}</p>
              </div>
              <div class="">
                  <h6 class="">IsActive:</h6>
                  <div class="">${checkStatus(event.isActive)}</div>
              </div>
              <div class="">
                  <h6 class="">IsAllUsers</h6>
                  <div class="">${checkStatus(event.IsAllUsers)}</div>
              </div>
          </div>
          <button class="btn btn-danger p-1 delete-event">Tədbiri sil</button>
      </div>
  `;

  if (remainingContent) {
    const loadMoreButton = row.querySelector(".btn-loadMore");
    const eventContent = row.querySelector(".event-content");
    const fullContent = row.querySelector(".full-content");

    loadMoreButton.addEventListener("click", () => {
      eventContent.innerHTML = `${initialContent} ${remainingContent}`;
      loadMoreButton.classList.add("d-none");
    });
  }

  return row;
}

function checkStatus(status) {
  return status ? '<i class="fa-solid fa-circle-check" style="color: #5ac421; font-size: 25px"></i>' : '<i class="fa-solid fa-circle-xmark" style="color: #bf1d1d; font-size: 25px"></i>';
}

async function loadPage(page, filter = "all") {
  const data = await fetchEvents(page, filter);
  populateAllEvents(data.events);
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
  const data = await fetchEvents();
  populateAllEvents(data.events);
  updatePagination(1, data.pageCount);
}

init();

const filterSelect = document.getElementById("event-filter");
filterSelect.addEventListener("change", function () {
  loadPage(1, this.value);
});
function getDeleteEventBtn() {
  const deleteEventBtns = document.querySelectorAll(".delete-event");
  deleteEventBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", function () {
      const clickedBtn = this.closest(".all-event__event-right").childNodes[3];
      const clickedBtnId = clickedBtn.getAttribute("data-id");
      deleteEvent(clickedBtnId);
    });
  });
}
function deleteEvent(eventId) {
  fetch(`http://nadir.somee.com/api/EventsManagment/DeleteEvent/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Event deleted successfully:", data);
      document.querySelector(`.all-event__event[data-id="${eventId}"]`).remove();
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
      window.location.reload();
    });
}

function changeDateFormat(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} / ${hours}:${minutes}:${seconds}`;
}
