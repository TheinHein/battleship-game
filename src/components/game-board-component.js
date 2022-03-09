import { drop, dragEnter, dragOver } from "../helpers/dragAndDrop";
import alphabets from "../helpers/alphabets";
import game from "../game";

const basicClassName = "game-board";

const clicked = [];

export default class GameBoardComponent {
  constructor(className = basicClassName) {
    this.className = className;
    this.fragment = document.createDocumentFragment();
    this.component = document.createElement("table");
    this.component.className = this.className;
    this.fragment.appendChild(this.component);
  }

  appendGameBoard(gameBoard, type) {
    while (this.component.childElementCount > 0) {
      this.component.removeChild(this.component.firstChild);
    }
    const thead = document.createElement("thead");
    this.component.appendChild(thead);
    const tr = document.createElement("tr");
    thead.appendChild(tr);
    const firstTh = document.createElement("th");
    tr.appendChild(firstTh);
    for (let i = 0; i < gameBoard.length; i += 1) {
      const th = document.createElement("th");
      th.textContent = i + 1;
      tr.appendChild(th);
    }
    const tbody = document.createElement("tbody");
    this.component.appendChild(tbody);
    for (let i = 0; i < gameBoard.length; i += 1) {
      const trBody = document.createElement("tr");
      tbody.appendChild(trBody);
      const th = document.createElement("th");
      th.textContent = alphabets[i];
      trBody.appendChild(th);
      for (let j = 0; j < gameBoard.length; j += 1) {
        const td = document.createElement("td");
        td.dataset.cord = gameBoard[i][j].cord;
        if (type === "computer") {
          td.style.cursor = "pointer";
          if (td.nodeName === "TD" && !clicked.includes(td.dataset.cord)) {
            td.addEventListener("click", GameBoardComponent.onClickToAttack);
          }
        } else if (type === "preview") {
          td.addEventListener("dragenter", dragEnter);
          td.addEventListener("dragover", dragOver);
          td.addEventListener("drop", drop);
        }
        if (gameBoard[i][j].ship !== null) {
          const { cord } = gameBoard[i][j];
          const ship = gameBoard[i][j].ship.len;
          const shipFront = ship[0];
          const shipEnd = ship[ship.length - 1];
          const isHor = ship.every((c) => c[0] === ship[0][0]);
          if (isHor) {
            td.classList.add(`hasShip-x`);
            if (cord === `${shipFront[0]}${shipFront[1]}`) {
              td.classList.add(`ship-front-x`);
            }
            if (cord === `${shipEnd[0]}${shipEnd[1]}`) {
              td.classList.add(`ship-end-x`);
            }
          } else {
            td.classList.add(`hasShip-y`);
            if (
              cord === `${shipFront[0]}${shipFront[1]}` ||
              cord === `${shipFront[0]}${shipFront[1]}${shipFront[2]}`
            ) {
              td.classList.add(`ship-front-y`);
            }
            if (
              cord === `${shipEnd[0]}${shipEnd[1]}` ||
              cord === `${shipEnd[0]}${shipEnd[1]}${shipEnd[2]}`
            ) {
              td.classList.add(`ship-end-y`);
            }
          }
          // ? hide ships on AI Board
          if (type === "computer") td.className = "";
        }
        if (gameBoard[i][j].isHit) {
          td.classList.add("isHit");
        }
        if (gameBoard[i][j].isMissed) {
          td.classList.add("isMissed");
        }
        trBody.appendChild(td);
      }
    }
  }

  static onClickToAttack(e) {
    clicked.push(e.target.dataset.cord);
    game.emit("human clicks", e.target.dataset.cord);
    const peekBoard = document.querySelector(".peek .game-board");
    const board = document.querySelector(".board-container .game-board");

    peekBoard.classList.add("zoom-in");
    peekBoard.classList.remove("zoom-out");
    board.classList.add("zoom-out");

    setTimeout(() => {
      peekBoard.classList.remove("zoom-in");
      peekBoard.classList.add("zoom-out");
      board.classList.remove("zoom-out");
      board.classList.add("zoom-in");
    }, 1000);
  }
}
