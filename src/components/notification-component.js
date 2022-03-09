import game from "../game";

const boardContainer = document.querySelector(".board-container");
const shipsStatusContainer = document.querySelector(".ships-status-container");
const peek = document.querySelector(".peek");

export default class NotificationComponent {
  constructor(data) {
    const { text, type, turn } = data;
    this.component = document.createElement("div");
    const content = document.createElement("div");
    content.textContent = text;
    this.component.appendChild(content);
    this.component.classList.add("notification");
    const button = document.createElement("button");
    this.handleClose = this.handleClose.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    if (type === "turn") {
      button.textContent = "PLAY";
      button.addEventListener("click", () => this.handlePlay(turn));
    } else {
      button.textContent = "CLOSE";
      button.addEventListener("click", this.handleClose);
    }
    this.component.appendChild(button);
  }

  handleClose() {
    this.component.remove();
  }

  handlePlay(turn) {
    this.component.remove();
    if (turn === "hu") {
      game.emit("render board", {
        appendTo: boardContainer,
        boardData: game.ai.gameBoard.board,
        type: "computer",
      });
      game.emit("render board", {
        appendTo: peek,
        boardData: game.hu.gameBoard.board,
      });
      game.emit("render ships status", {
        appendTo: shipsStatusContainer,
        shipsData: game.ai.gameBoard.ships,
      });
    } else if (turn === "ai") {
      game.emit("render board", {
        appendTo: boardContainer,
        boardData: game.hu.gameBoard.board,
      });

      while (shipsStatusContainer.childElementCount > 0) {
        shipsStatusContainer.removeChild(shipsStatusContainer.firstChild);
      }
    }
  }
}
