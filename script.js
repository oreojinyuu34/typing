const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const accuracyValue = document.querySelector(".accuracy-value");
const speedValue = document.querySelector(".correctTyped");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

let incorrectChars = 0;
let correctChars = 0;
let totalChars = 0;
let totalTime = 0;
const timerInitialValue = 60;

function startGame() {
  renderNextSentence();
  startTimer();
  incorrectChars = 0;
  correctChars = 0;
  totalChars = 0;
  totalTime = 0;
  typeInput.disabled = false;
  typeInput.focus();
}

typeInput.addEventListener("input", (event) => {
  let correct = true;

  typeSound.play();
  typeSound.volume = 0.3;
  typeSound.currentTime = 0;

  const sentenceArray = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");
  sentenceArray.forEach((characterSpan, index) => {
    totalChars++;

    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      correctChars++;
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.play();
      wrongSound.volume = 0.1;
      wrongSound.currentTime = 0;

      correct = false;
      incorrectChars++;
      accuracyValue.innerText = incorrectChars;
    }
  });

  if (event.inputType === "insertLineBreak" && correct) {
    event.preventDefault();
    correctSound.play();
    correctSound.currentTime = 0;

    let time = getTimerTime();
    totalTime += time;
    let speed = Math.max(0, (correctChars - incorrectChars) / totalTime);
    speedValue.innerText = speed.toFixed(1);

    typeInput.value = ""; // テキストエリアをクリア
    renderNextSentence();
  }
});

function getRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNextSentence() {
  const sentence = await getRandomSentence();

  typeDisplay.innerText = "";

  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplay.appendChild(characterSpan);
    characterSpan.classList.add("correct");
    characterSpan.classList.remove("correct");
    characterSpan.classList.remove("incorrect");
  });

  typeInput.value = "";
}

let startTime;
let timerInterval;
function startTimer() {
  timer.innerText = timerInitialValue;
  startTime = new Date();

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    timer.innerText = timerInitialValue - getTimerTime();
    if (timer.innerText <= 0) {
      timeUp();
      clearInterval(timerInterval);
    }
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function timeUp() {
  clearInterval(timerInterval);
  typeInput.disabled = true;
}
