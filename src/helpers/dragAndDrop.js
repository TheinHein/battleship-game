import fleet from "./fleet";
import game from "../game";

const shipsContainer = document.querySelector(".ships-container");
const notificationContainer = document.querySelector(".notification-container");

function dblClick(e) {
  if (e.target.parentNode.dataset.dir === "X")
    e.target.parentNode.dataset.dir = "Y";
  else if (e.target.parentNode.dataset.dir === "Y")
    e.target.parentNode.dataset.dir = "X";
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain/len", e.target.childElementCount);
  e.dataTransfer.setData("text/plain/dir", e.target.dataset.dir);
  e.dataTransfer.setData("text/plain/type", e.target.dataset.type);
  e.dataTransfer.setData("text/plain/id", e.target.id);
}

function dragEnter(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
}

let totalDrag = 1;
function drop(e) {
  if (totalDrag === 5) {
    totalDrag = 0;
  }
  if (Object.keys(game.hu.gameBoard.ships).length === 5) return;
  game.emit("place ai's ships randomly", fleet);
  const len = e.dataTransfer.getData("text/plain/len");
  const dir = e.dataTransfer.getData("text/plain/dir");
  const type = e.dataTransfer.getData("text/plain/type");
  const id = e.dataTransfer.getData("text/plain/id");
  e.dataTransfer.clearData();
  const firstCord = e.target.dataset.cord;
  try {
    game.emit("place human's ship", { firstCord, len, dir, type });
  } catch (error) {
    const content = error.message;
    const appendTo = notificationContainer;
    game.emit("render notification", { content, appendTo });
    return;
  }
  const shipDisplay = document.getElementById(id);
  shipDisplay.remove();

  const ship = fleet[totalDrag];
  totalDrag += 1;
  game.emit("render dnd ship", { ship, appendTo: shipsContainer });
}

export { dragEnter, dragOver, drop, dblClick, dragStart };
