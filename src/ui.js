import GameBoardComponent from "./components/game-board-component";
import game from "./game";
import { dragStart, dblClick } from "./helpers/dragAndDrop";
import NotificationComponent from "./components/notification-component";
import ShipStatusComponent from "./components/ships-status-component";

export default class UI {
  static renderBoard(data) {
    const { appendTo, boardData, type } = data;
    while (appendTo.childElementCount > 0) {
      appendTo.removeChild(appendTo.firstChild);
    }
    const board = new GameBoardComponent();
    board.appendGameBoard(boardData, type);
    appendTo.appendChild(board.fragment);
  }

  static renderDNDShip(data) {
    const { ship, appendTo } = data;
    while (appendTo.childElementCount > 1) {
      appendTo.removeChild(appendTo.lastChild);
    }
    const component = document.createElement("div");
    component.className = "shipContainer";
    component.setAttribute("draggable", true);
    component.dataset.dir = "X";
    component.dataset.type = ship.type;
    component.id = ship.type;
    component.addEventListener("dragstart", dragStart);
    component.addEventListener("dblclick", dblClick);
    for (let i = 0; i < ship.len; i += 1) {
      const div = document.createElement("div");
      div.className = "shipSec";
      component.appendChild(div);
    }
    appendTo.appendChild(component);
  }

  static renderNotification(data) {
    const { content, appendTo, type, turn } = data;
    while (appendTo.childElementCount > 0) {
      appendTo.removeChild(appendTo.firstChild);
    }
    const notification = new NotificationComponent({
      text: content,
      type,
      turn,
    });
    appendTo.appendChild(notification.component);
  }

  static renderShipsStatus(data) {
    const { appendTo, shipsData } = data;
    while (appendTo.childElementCount > 0) {
      appendTo.removeChild(appendTo.firstChild);
    }
    const title = document.createElement("div");
    title.textContent = "Computer's Ship Status";
    appendTo.appendChild(title);
    Object.keys(shipsData).forEach((ship) => {
      const shipsStatus = new ShipStatusComponent(shipsData[ship]);
      appendTo.appendChild(shipsStatus.component);
    });
  }
}

game.on("render dnd ship", "renderDNDShip", UI);
game.on("render board", "renderBoard", UI);
game.on("render ships status", "renderShipsStatus", UI);
game.on("render notification", "renderNotification", UI);
