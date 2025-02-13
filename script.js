let quizData = [];
let score = 0;

fetchQuizData();

function fetchQuizData() {
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
      displayQuizData(quizData);
    })
    .catch((err) => console.log(err));
}

//display initial quiz data
function displayQuizData(data) {
  let initialStart = data["quizzes"].map((ele) => {
    return `<div class="quiz-topics" id=${ele.title}><img src=${ele.icon} width=20 height=20/> ${ele.title}</div>`;
  });
  document.querySelector(".section-2").innerHTML += initialStart.join("");

  document.querySelector(".section-2").addEventListener("click", function (e) {
    if (e.target.classList.contains("quiz-topics")) {
      data["quizzes"].map((item) => {
        if (item.title == e.target.id) {
          hideIntialQuizPage();
          displayQuestions(item["questions"], 0, item.title);
        }
      });
    }
  });
}

function hideIntialQuizPage() {
  //hide intial start section and replace with quiz questions
  document.querySelector(".question-section").style.display = "block";
  document.querySelector(".answer-section").style.display = "block";
  document.querySelector(".section-2").style.display = "none";
  document.querySelector(".section-1").style.display = "none";
}

function displayQuestions(questions, questionIndex, selectedTopic) {
  console.log(questionIndex, "inside display ques func");
  let submitButton = document.getElementById("submit-answer-button");
  submitButton.textContent = "submit answer";
  let optionPrefix = ["A", "B", "C", "D"];
  //display current question number
  document.getElementById("current-question").innerHTML = questionIndex + 1;

  //display current question
  document.getElementById("question").innerHTML = escapeHTML(
    questions[questionIndex].question
  );

  //display current options
  let optionsContainer = document.querySelector(".options");
  optionsContainer.innerHTML = "";
  questions[questionIndex].options.map((op, index) => {
    let escapedOp = escapeHTML(op);
    optionsContainer.innerHTML += `<div id=${index} class="option" value=${JSON.stringify(
      op
    )}><span>${optionPrefix[index]}</span><span>${escapedOp}</span></div>`;
  });
  console.log(optionsContainer, "options container");
  let options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      options.forEach((opt) => (opt.style.border = "1px solid black"));
      this.style.border = "2px solid black";
    });
  });

  //get new button to avoid multiple on click , so that next questions are correctly checked
  let newSubmitButton = submitButton.cloneNode(true);
  submitButton.replaceWith(newSubmitButton);

  newSubmitButton.addEventListener("click", function () {
    //toggle button text content

    if (this.textContent === "submit answer") {
      console.log(questionIndex, questions.length);

      this.textContent = "next question";

      //check  selected option with actual answer
      options.forEach((op) => {
        console.log(op.getAttribute("value"), "value");
        if (op.getAttribute("value") === questions[questionIndex].answer) {
          op.style.border = "2px solid green";
          score = score + 1;
          console.log(score, "score");
        } else if (
          op.getAttribute("value") !== questions[questionIndex].answer &&
          op.style.border === "2px solid black"
        ) {
          op.style.border = "2px solid red";
        }
      });
    } else if ((this.textContent = "next question")) {
      //display next question
      if (questionIndex === questions.length - 1) {
        displayQuizEnd(score);
      }

      questionIndex = questionIndex + 1;
      let nextQuestions;
      quizData["quizzes"].map((q) => {
        if (q.title === selectedTopic) {
          nextQuestions = q["questions"];
        }
      });
      console.log(questionIndex, "after next question click");
      displayQuestions(nextQuestions, questionIndex, selectedTopic);
    }
  });
}

//show quiz completed and final score
function displayQuizEnd(score) {
  document.querySelector(".question-section").style.display = "none";
  document.querySelector(".answer-section").style.display = "none";
  document.querySelector(".quiz-over-text").style.display = "block";
  document.querySelector(".quiz-score").style.display = "block";
  document.getElementById("final-score").innerHTML = score;
  document
    .querySelector(".play-again-button")
    .addEventListener("click", startOverAgain);
}
function startOverAgain() {
  document.querySelector(".quiz-over-text").style.display = "none";
  document.querySelector(".quiz-score").style.display = "none";
  document.querySelector(".section-1").style.display = "block";
  document.querySelector(".section-2").style.display = "block";
}
// Function to escape HTML characters
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
