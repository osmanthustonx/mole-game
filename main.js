import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";

import { mainnet, arbitrum } from "viem/chains";
import { reconnect } from "@wagmi/core";

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = "665e493a7c111924c567dce3e2480593";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain.
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
reconnect(config);

// 3. Create modal
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

const caves = document.querySelectorAll(".cave");
const playerScore = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const playBtn = document.querySelector(".play-btn");
const faceImage = document.querySelector(".face");
const timeLeftDisplay = document.querySelector(".time-left");
const highScoreDisplay = document.querySelector(".high-score");
let lastCave;
let timeUp = false;
let score = 0;
let highScore = 0;
let countdown;

// modal.subscribeEvents((event) => {
//   if (event.data.event === "CONNECT_SUCCESS") {
//     playBtn.style.display = "block";
//   }
//   if (event.data.event === "MODAL_CLOSE" && !event.data.properties.connected) {
//     playBtn.style.display = "none";
//   }
// });

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
  if (faceImage) faceImage.src = "./off.png"; 
  setTimeout(() => {
    cave.classList.remove("up");
    if (!timeUp) popUp();
  }, time);
}

function startGame() {
  // if (!modal.getIsConnectedState()) {
  //   modal.open();
  //   return;
  // }
  if (playBtn) playBtn.style.display = "none";
  if (playerScore) playerScore.textContent = "0";
  if (timeLeftDisplay) timeLeftDisplay.textContent = "10";
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
        if (playBtn) playBtn.style.display = "block";
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
  if (faceImage) faceImage.src = "./on.png"; 
}

moles.forEach((mole) => mole.addEventListener("click", clickClick));

playBtn.addEventListener("click", () => {
  startGame();
});
