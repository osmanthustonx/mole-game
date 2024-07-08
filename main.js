const caves = document.querySelectorAll(".cave");
const playerScore = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startBtn = document.querySelector(".start-btn");
const timeLeftDisplay = document.querySelector(".time-left");
const highScoreDisplay = document.querySelector(".high-score");
let lastCave;
let timeUp = false;
let score = 0;
let highScore = 0;
let countdown;

function popUpTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomCave(caves) {
  const idx = Math.floor(Math.random() * caves.length);
  const cave = caves[idx];
  if (cave === lastCave) {
    console.log("repeated cave");
    return randomCave(caves);
  }
  lastCave = cave;
  return cave;
}

function popUp() {
  const time = popUpTime(200, 1000);
  const cave = randomCave(caves);
  cave.classList.add("up");
  setTimeout(() => {
    cave.classList.remove("up");
    if (!timeUp) popUp();
  }, time);
}

function startGame() {
  if (startBtn) startBtn.style.display = "none";
  if (playerScore) playerScore.textContent = "0";
  if (timeLeftDisplay) timeLeftDisplay.textContent = "10"; // 重置倒數計時器
  timeUp = false;
  score = 0;
  popUp();
  countdown = setInterval(() => {
    if (timeLeftDisplay) {
      let timeLeft = parseInt(timeLeftDisplay.textContent || "0");
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft.toString();
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timeUp = true;
        if (startBtn) startBtn.style.display = "block";
        if (score >= highScore) {
          highScore = score;
          if (highScoreDisplay)
            highScoreDisplay.textContent = highScore.toString();
        }
      }
    }
  }, 1000);
}

function clickClick(e) {
  if (!e.isTrusted) return;
  score++;
  this.classList.remove("up");
  playerScore.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", clickClick));
