function createQuestion(ev) {
  ev.preventDefault();
  fetch("http://nadir.somee.com/api/questionsmanagment/createquestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.querySelector("#title").value.trim(),
      answer: document.querySelector("#answer").value.trim(),
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Question created successfully:", data);
      alert("Question created successfully!");
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
      location.reload();
    });
}

document.querySelector("#create-event__form").addEventListener("submit", createQuestion);
