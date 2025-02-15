let quizData = [];
let score = 0;
let currentHeading = document.querySelector(".current-heading");
let darkLightModeButton = document.querySelector(".toggle-button");
let optionImagePath;
let rootStyles = getComputedStyle(document.documentElement);

fetchQuizData();

darkLightModeButton.addEventListener("click", toggleClick);
function toggleClick() {
  let toggleButton = document.querySelector(".toggle-button");
  let circle = document.querySelector(".circle");

  circle.classList.toggle("active-circle");
  toggleButton.classList.toggle("toggle-active");
}

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
          currentHeading.innerHTML =
            `<img src=${item.icon}  id=${item.title}>` + item.title;
          displayQuestions(item["questions"], 0, item);
        }
      });
    }
  });
}

function hideIntialQuizPage() {
  //hide intial start section and replace with quiz questions
  document.querySelector(".question-section").style.display = "flex";
  document.querySelector(".answer-section").style.display = "flex";
  document.querySelector(".section-2").style.display = "none";
  document.querySelector(".section-1").style.display = "none";
}

function displayQuestions(questions, questionIndex, selectedTopic) {
  let questionProgressBar = document.querySelector(".question-progress-bar");
  let purpleColor = rootStyles.getPropertyValue("--purple").trim();
  let pureWhite = rootStyles.getPropertyValue("--pure-white").trim();
  let green = rootStyles.getPropertyValue("--green").trim();
  let red = rootStyles.getPropertyValue("--red").trim();
  let lightGrey = rootStyles.getPropertyValue("--light-grey").trim();
  let navy = rootStyles.getPropertyValue("--navy").trim();

  questionProgressBar.style.backgroundImage = `-webkit-linear-gradient(left, ${purpleColor}, ${purpleColor} ${
    10 * (questionIndex + 1)
  }%, transparent ${10 * (questionIndex + 1)}%, transparent 100%)`;
  let submitButton = document.getElementById("submit-answer-button");
  submitButton.textContent = "Submit Answer";
  let optionPrefix = ["A", "B", "C", "D"];
  //display current question number
  document.getElementById("current-question").innerHTML = questionIndex + 1;

  //display current question
  document.getElementById("question").innerHTML = escapeHTML(
    questions[questionIndex].question
  );

  //display current options
  let optionsContainer = document.querySelector(".options");
  //refresh container for next questions
  optionsContainer.innerHTML = "";
  questions[questionIndex].options.map((op, index) => {
    let escapedOp = escapeHTML(op);
    optionsContainer.innerHTML += `<div id=${index} class="option" value=${JSON.stringify(
      op
    )}><span>${optionPrefix[index]}</span><span>${escapedOp}</span> </div>`;
  });

  let options = document.querySelectorAll(".option");

  let selectedOption = null;
  //highlight selected option
  options.forEach((option) => {
    option.addEventListener("click", function (e) {
      options.forEach((ele) => {
        ele.style.border = "none";
        ele.querySelector(
          "span:first-child"
        ).style.backgroundColor = `${lightGrey}`;
        ele.querySelector("span:first-child").style.color = `${navy}`;
      });
      selectedOption = this;

      this.style.border = `2px solid ${purpleColor}`;
      this.querySelector(
        "span:first-child"
      ).style.backgroundColor = `${purpleColor}`;
      this.querySelector("span:first-child").style.color = `${pureWhite}`;
    });
  });

  //get new button to avoid multiple on click , so that next questions are correctly displayed
  let newSubmitButton = submitButton.cloneNode(true);
  submitButton.replaceWith(newSubmitButton);

  newSubmitButton.addEventListener("click", function () {
    //check if some option is selected before submitting
    document.querySelector(".warning").style.display = "none";
    if (!selectedOption) {
      document.querySelector(".warning").style.display = "block";
      return;
    }

    let correctAnswer = questions[questionIndex].answer;

    //toggle button text content
    if (this.textContent === "Submit Answer") {
      this.textContent = "next question";

      if (selectedOption.getAttribute("value") === correctAnswer) {
        //correct case-highlight option with green
        selectedOption.style.border = `2px solid ${green}`;
        selectedOption.querySelector(
          "span:first-child"
        ).style.backgroundColor = `${green}`;
        selectedOption.querySelector(
          "span:first-child"
        ).style.color = `${pureWhite}`;

        optionImagePath = "./assets/images/icon-correct.svg";
        selectedOption.innerHTML += `<img src=${optionImagePath} width=30 height=30 id="check-image"/>`;
        document.getElementById("check-image").style.display = "flex";

        score = score + 1;
      } else if (selectedOption.getAttribute("value") !== correctAnswer) {
        //incorrect case-highlight opotion with red
        selectedOption.style.border = `2px solid ${red}`;
        selectedOption.querySelector(
          "span:first-child"
        ).style.backgroundColor = `${red}`;
        selectedOption.querySelector(
          "span:first-child"
        ).style.color = `${pureWhite}`;
        optionImagePath = "./assets/images/icon-incorrect.svg";
        selectedOption.innerHTML += `<img src=${optionImagePath} width=30 height=30 id="check-image"/>`;
        document.getElementById("check-image").style.display = "flex";
      }

      //check  selected option with actual answer
      options.forEach((op) => {
        if (op.getAttribute("value") === correctAnswer) {
          //highlight correct option in case of incorrect selection
          op.style.border = `2px solid ${green}`;
          op.querySelector(
            "span:first-child"
          ).style.backgroundColor = `${green}`;
          op.querySelector("span:first-child").style.color = `${pureWhite}`;
          optionImagePath = "./assets/images/icon-correct.svg";
          op.innerHTML += `<img src=${optionImagePath} width=30 height=30 id="check-image"/>`;
          document.getElementById("check-image").style.display = "flex";
        }
      });
    } else if ((this.textContent = "next question")) {
      //display next question
      if (questionIndex === questions.length - 1) {
        displayQuizEnd(score, selectedTopic);
        return;
      }

      questionIndex = questionIndex + 1;
      let nextQuestions;
      quizData["quizzes"].map((q) => {
        if (q.title === selectedTopic.title) {
          nextQuestions = q["questions"];
        }
      });
      displayQuestions(nextQuestions, questionIndex, selectedTopic);
    }
  });
}

//show quiz completed and final score
function displayQuizEnd(score, selectedTopic) {
  document.querySelector(".question-section").style.display = "none";
  document.querySelector(".answer-section").style.display = "none";
  document.querySelector(".quiz-over-text").style.display = "block";
  document.querySelector(".quiz-score").style.display = "block";
  document.querySelector(".topic").innerHTML =
    `<img src=${selectedTopic.icon} width="20" height="20"/>` +
    selectedTopic.title;
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
  score = 0;
  currentHeading.innerHTML = "";
}
// Function to escape HTML characters
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
