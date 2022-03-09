import "./style.css";
import game from "./game";
// eslint-disable-next-line no-unused-vars
import UI from "./ui";
import fleet from "./helpers/fleet";

const previewContainer = document.querySelector(".preview-container");
const randomizeBtn = document.querySelector(".randomize");
const startBtn = document.querySelector(".start");
const preGameContainer = document.querySelector(".pre-game-container");
const resetBtn = document.querySelector(".reset");
const shipsContainer = document.querySelector(".ships-container");
const notificationContainer = document.querySelector(".notification-container");
const passBtn = document.querySelector(".pass");
const main = document.querySelector(".display");

game.emit("render board", {
  appendTo: previewContainer,
  boardData: game.hu.gameBoard.board,
  type: "preview",
});

game.emit("render dnd ship", { ship: fleet[0], appendTo: shipsContainer });

randomizeBtn.addEventListener("click", () => {
  game.emit("randomize", fleet);
  game.emit("render board", {
    appendTo: previewContainer,
    boardData: game.hu.gameBoard.board,
    type: "preview",
  });
});

startBtn.addEventListener("click", () => {
  const totalShips = Object.keys(game.hu.gameBoard.ships).length;
  if (totalShips < 5) {
    const content = "Require 5 ships";
    const appendTo = notificationContainer;
    game.emit("render notification", { content, appendTo });
    return;
  }

  game.emit("start");

  preGameContainer.classList.add("hide");
  main.classList.add("show");
});

resetBtn.addEventListener("click", () => {
  game.emit("reset");
  game.emit("render preview", previewContainer);
});

passBtn.addEventListener("click", () => {
  game.emit("pass screen");
});
