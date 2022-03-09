import Ship from "./ship";
import alphabets from "./helpers/alphabets";

export default class GameBoard {
  constructor(boardSize) {
    this.board = [];
    this.ships = {};
    this.occupied = [];
    this.missed = [];
    this.createBoard(boardSize);
  }

  createBoard(size) {
    for (let x = 0; x < size; x += 1) {
      const row = [];
      this.board.push(row);
      for (let y = 0; y < size; y += 1) {
        const cellData = {
          cord: `${alphabets[x]}${y + 1}`,
          ship: null,
          isHit: false,
          isMissed: false,
        };
        row.push(cellData);
      }
    }
  }

  placeShip(firstCord, len, dir, type) {
    if (firstCord.length === 0) return;

    const digit = firstCord[1] + firstCord[2];
    const y = parseInt(digit, 10);

    const cords = [];
    for (let i = 0; i < len; i += 1) {
      if (dir === "X") {
        if (y - 1 > 10 - len) throw new Error("Out of Boundary");
        cords.push(`${firstCord[0]}${y + i}`);
      } else if (dir === "Y") {
        if (alphabets.indexOf(firstCord[0]) > 10 - len)
          throw new Error("Out of Boundary");
        cords.push(`${alphabets[alphabets.indexOf(firstCord[0]) + i]}${y}`);
      }

      if (this.occupied.includes(cords[i]))
        throw new Error("Ship already exists");
    }
    const ship = this.createShip(cords, type);
    this.board.map((row) =>
      row.map((cell) => {
        const shipAssigned = cell;
        if (cords.includes(shipAssigned.cord)) {
          shipAssigned.ship = ship;
        }
        return shipAssigned;
      })
    );
    this.occupied.push(...cords);
  }

  generateRandomPlacement(len, totalShips, type) {
    const randomAlphabet = alphabets[Math.floor(Math.random() * 10)];
    const randomNumber = Math.ceil(Math.random() * 10);
    const randomDir = ["X", "Y"][Math.floor(Math.random() * 2)];
    const randomCord = `${randomAlphabet}${randomNumber}`;
    try {
      this.placeShip(randomCord, len, randomDir, type);
    } catch (e) {
      if (!(e instanceof Error)) throw Error;
    }
    while (Object.keys(this.ships).length < totalShips)
      this.generateRandomPlacement(len, totalShips, type);
  }

  placeShipsRandomly(fleet) {
    for (let i = 0; i < fleet.length; i += 1) {
      this.generateRandomPlacement(fleet[i].len, i + 1, fleet[i].type);
    }
  }

  createShip(cords, type) {
    const ship = new Ship(cords, type);
    if (typeof this.ships[type] === "undefined") this.ships[type] = ship;
    return ship;
  }

  receiveAttack(cord) {
    const foundCell = this.board
      .find((r) => r.find((e) => e.cord === cord))
      .find((e) => e.cord === cord);
    if (foundCell.ship !== null) {
      foundCell.ship.hit(cord);
      foundCell.isHit = true;
    } else {
      this.missed.push(cord);
      foundCell.isMissed = true;
    }
  }

  checkAllSunk() {
    let totalSunk = 0;
    Object.keys(this.ships).forEach((ship) => {
      if (this.ships[ship].sunk === true) totalSunk += 1;
    });
    if (totalSunk === Object.keys(this.ships).length) return true;
    return false;
  }
}
