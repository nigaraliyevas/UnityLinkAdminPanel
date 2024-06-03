const usersPerPage = 10;

async function fetchQuestions() {
  const response = await fetch(`http://nadir.somee.com/api/QuestionsManagment/GetQuestions/`);
  return response.json();
}
function populateAllQuestions(question) {
  const allQuestions = document.querySelector(".all-questions__field");
  allQuestions.innerHTML = "";
  question.forEach(question => {
    const row = createQuestionColumn(question);
    allQuestions.appendChild(row);
  });
  getDeleteQuestionBtn();
}
function createQuestionColumn(question) {
  const column = document.createElement("div");
  column.classList.add("question");
  column.innerHTML = `
  <h6 class="" data-id="${question.id}">Başlıq:</h6>
  <p class="">${question.title}</p>
  <h6 class="">Cavab:</h6>
  <p class="">${question.answer}</p>
  <h6 class="">Yaradıldı:</h6>
  <p class="">${question.createdBy}</p>
  <button class="btn btn-danger p-1 delete-question">Sorğunu sil</button>
  `;
  return column;
}
async function init() {
  const data = await fetchQuestions();
  populateAllQuestions(data);
}
init();
function getDeleteQuestionBtn() {
  const deleteEventBtns = document.querySelectorAll(".delete-question");
  deleteEventBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", function () {
      const clickedBtn = this.closest(".question").childNodes[1];
      const clickedBtnId = clickedBtn.getAttribute("data-id");
      console.log(clickedBtnId);
      deleteQuestion(clickedBtnId);
    });
  });
}
function deleteQuestion(questionId) {
  fetch(`http://nadir.somee.com/api/questionsmanagment/deletequestion/${questionId}`, {
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
      document.querySelector(`.question[data-id="${eventId}"]`).remove();
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
      window.location.reload();
    });
}
