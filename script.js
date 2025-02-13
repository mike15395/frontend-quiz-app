let quizData = [];
let currentQuestionIndex = 0;
fetchQuizData(currentQuestionIndex);

function fetchQuizData(index) {
  console.log(index, "index inside fetch");
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) {
        console.log("something went wrong!");
      }
      return res.json();
    })
    .then((res) => {
      quizData = res;
      console.log(quizData, "quiz data");
      displayQuizData(quizData, index);
    })
    .catch((err) => console.log(err));
}

//display initial quiz data
function displayQuizData(data, index) {
  let initialStart = data["quizzes"].map((ele) => {
    return `<div class="quiz-topics" id=${ele.title}><img src=${ele.icon} width=20 height=20/> ${ele.title}</div>`;
  });
  console.log(initialStart, "initial start");
  document.querySelector(".section-2").innerHTML += initialStart.join("");

  document.querySelector(".section-2").addEventListener("click", function (e) {
    if (e.target.classList.contains("quiz-topics")) {
      data["quizzes"].map((item) => {
        if (item.title == e.target.id) {
          displayQuestions(item["questions"], index);
        }
      });
    }
  });
}

function displayQuestions(questions, questionIndex) {
  //hide intial start section and replace with quiz questions
  document.querySelector(".question-section").style.display = "block";
  document.querySelector(".answer-section").style.display = "block";
  document.querySelector(".section-2").style.display = "none";
  document.querySelector(".section-1").style.display = "none";

  let optionPrefix = ["A", "B", "C", "D"];

  document.getElementById("current-question").innerHTML = questionIndex + 1;

  document.getElementById("question").innerHTML =
    questions[questionIndex].question;
  questions[questionIndex].options.map((op, index) => {
    document.querySelector(
      ".options"
    ).innerHTML += `<div id=${index} class="option" value=${JSON.stringify(
      op
    )}><span>${optionPrefix[index]}</span><span>${op}</span></div>`;
  });

  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      options.forEach((opt) => (opt.style.border = "1px solid black"));
      selectedAnswer = this.getAttribute("value");
      this.style.border = "2px solid black";
    });
  });

  let submitButton = document.getElementById("submit-answer-button");
  submitButton.addEventListener("click", function () {
    if (this.textContent === "submit answer") {
      this.textContent = "next question";

      options.forEach((op) => {
        if (op.getAttribute("value") === questions[questionIndex].answer) {
          op.style.border = "2px solid green";
        } else if (
          op.getAttribute("value") !== questions[questionIndex].answer &&
          op.style.border === "2px solid black"
        ) {
          op.style.border = "2px solid red";
        }
      });
    } else if ((this.textContent = "next question")) {
      //display next question
    }
  });
}
