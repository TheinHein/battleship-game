import GameBoard from "./game-board";
import alphabets from "./helpers/alphabets";

const shuffle = () => {
  let shuffledArray = [];
  for (let x = 0; x < alphabets.length; x += 1) {
    const row = [];
    shuffledArray.push(row);
    for (let y = 0; y < alphabets.length; y += 1) {
      const coord = `${alphabets[x]}${y + 1}`;
      row.push(coord);
    }
  }
  shuffledArray = shuffledArray.flat();

  let i = shuffledArray.length;
  let j = 0;
  let temp;

  // eslint-disable-next-line no-plusplus
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }

  return shuffledArray;
};

const shuffleAvailableSpots = shuffle();

export default class Player {
  constructor() {
    this.gameBoard = new GameBoard(10);
    this.enemyGameBoard = null;
  }

  assignEnemyGameBoard(enemyGameBoard) {
    this.enemyGameBoard = enemyGameBoard;
  }

  attack(cord) {
    this.enemyGameBoard.receiveAttack(cord);
  }

  aiAttack() {
    const randomCord = shuffleAvailableSpots.pop();
    this.enemyGameBoard.receiveAttack(randomCord);
  }
}
