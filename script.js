const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const accuracyValue = document.querySelector(".accuracy-value");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// startGame 関数を変更
function startGame() {
  RenderNextSentence();
  StartTimer();
  incorrectChars = 0; // ミスタイプ回数を初期化する
  typeInput.disabled = false;
  typeInput.focus();
}

/* inputテキスト入力。合っているか判定 */
typeInput.addEventListener("input", (event) => {
  let correct = true;

  // タイプ音をつける
  typeSound.play();
  typeSound.volume = 0.3;
  typeSound.currentTime = 0;

  const sentenceArray = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");
  sentenceArray.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.play();
      wrongSound.volume = 0.1;
      wrongSound.currentTime = 0;

      correct = false;
      // 誤タイプの回数をカウント
      incorrectChars++;
      accuracyValue.innerText = incorrectChars;
    }
  });

  // エンターキーが押されたかどうかをチェック
  if (event.inputType === "insertLineBreak" && correct) {
    event.preventDefault(); // エンターキーによる改行を無効化
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

/* 非同期処理でランダムな文章を取得する */
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

/* ランダムな文章を取得して表示する */
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplay.innerText = "";

  /* 文章を一文字ずつ分解して、spanタグを生成する */
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    console.log(characterSpan);
    typeDisplay.appendChild(characterSpan);
    characterSpan.classList.add("correct");
    characterSpan.classList.remove("correct");
    characterSpan.classList.remove("incorrect");
  });

  /* テキストボックスの中身を消す */
  typeInput.value = "";

  StartTimer();
}

let startTime;
let originTime = 60;
let timerInterval;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();

  // タイマーをクリアする処理を追加
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) {
      TimeUp();
      clearInterval(timerInterval); // ゲームが終了した時にタイマーをクリア
    }
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  clearInterval(timerInterval); // タイムアップ時にタイマーをクリア
  typeInput.disabled = true; // タイムアップ時にテキスト入力欄を無効化
  // startGame(); を削除
}

// RenderNextSentence();
