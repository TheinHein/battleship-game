import Player from "./player";
import fleet from "./helpers/fleet";
import makePublisher from "./helpers/publisher";

const boardContainer = document.querySelector(".board-container");
const shipsStatusContainer = document.querySelector(".ships-status-container");
const previewContainer = document.querySelector(".preview-container");
const shipsContainer = document.querySelector(".ships-container");
const notificationContainer = document.querySelector(".notification-container");
const peek = document.querySelector(".peek");

const game = {
  hu: new Player(),
  ai: new Player(),
  turn: "hu",

  assignEnemyGameBoard() {
    this.hu.assignEnemyGameBoard(this.ai.gameBoard);
    this.ai.assignEnemyGameBoard(this.hu.gameBoard);
  },

  start() {
    const content = "Your Turn";
    const appendTo = notificationContainer;
    const type = "turn";
    this.emit("render notification", {
      content,
      appendTo,
      type,
      turn: this.turn,
    });
  },

  pass() {
    let content = "";
    if (this.turn === "hu") {
      this.turn = "ai";
      content = "Computer's Turn";
    } else if (this.turn === "ai") {
      this.turn = "hu";
      content = "Your Turn";
    }
    const appendTo = notificationContainer;
    const type = "turn";
    this.emit("render notification", {
      content,
      appendTo,
      type,
      turn: this.turn,
    });
  },

  placeShipsRandomly(ships) {
    this.hu = new Player();
    this.hu.gameBoard.placeShipsRandomly(ships);
    this.ai = new Player();
    this.ai.gameBoard.placeShipsRandomly(ships);
    this.assignEnemyGameBoard();
  },

  placeAiShipsRandomly(ships) {
    this.ai = new Player();
    this.ai.gameBoard.placeShipsRandomly(ships);
    this.assignEnemyGameBoard();
  },

  attack(cord) {
    this.hu.attack(cord);
    this.emit("render board", {
      appendTo: boardContainer,
      boardData: game.ai.gameBoard.board,
      type: "computer",
    });
    this.emit("render ships status", {
      shipsData: this.ai.gameBoard.ships,
      appendTo: shipsStatusContainer,
    });
    this.ai.aiAttack();
    game.emit("render board", {
      appendTo: peek,
      boardData: game.hu.gameBoard.board,
    });

    this.checkWinner();
  },

  reset() {
    this.hu = new Player();
    this.ai = new Player();
    this.assignEnemyGameBoard();
    this.emit("render dnd ship", { ship: fleet[0], appendTo: shipsContainer });
  },

  placeShip(args) {
    const { firstCord, len, dir, type } = args;
    this.hu.gameBoard.placeShip(firstCord, len, dir, type);
    this.emit("render board", {
      appendTo: previewContainer,
      boardData: game.hu.gameBoard.board,
      type: "preview",
    });
  },

  checkWinner() {
    if (this.ai.gameBoard.checkAllSunk())
      this.emit("render notification", {
        content: "WIN",
        appendTo: notificationContainer,
      });
    else if (this.hu.gameBoard.checkAllSunk()) {
      this.emit("render notification", {
        content: "LOSE",
        appendTo: notificationContainer,
      });
    }
  },
};

makePublisher(game);

game.on("randomize", "placeShipsRandomly", game);
game.on("place ai's ships randomly", "placeAiShipsRandomly", game);
game.on("human clicks", "attack", game);
game.on("reset", "reset", game);
game.on("place human's ship", "placeShip", game);
game.on("pass screen", "pass", game);
game.on("start", "start", game);

export default game;
