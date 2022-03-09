import GameBoard from "../game-board";
import fleet from "../helpers/fleet";
import alphabets from "../helpers/alphabets";

describe("GameBoard Class Test", () => {
  test("GameBoard Length should be array with length of provided argument", () => {
    const array = [
      [
        { cord: "A1", ship: null, isHit: false, isMissed: false },
        { cord: "A2", ship: null, isHit: false, isMissed: false },
      ],
      [
        { cord: "B1", ship: null, isHit: false, isMissed: false },
        { cord: "B2", ship: null, isHit: false, isMissed: false },
      ],
    ];
    const testGameBoard = new GameBoard(array.length);
    expect(testGameBoard.board).toEqual(array);
  });

  test("createShip() should call Ship class to make a ship instance", () => {
    const testGameBoard = new GameBoard(10);
    const cords = ["A0", "A1", "A2", "A3", "A4"];
    const type = "Carrier";
    const ship = { len: cords, type, sunk: false };
    expect(testGameBoard.createShip(cords, type)).toEqual(ship);
  });

  test("createShip() should add new ship to GameBoard.ships", () => {
    const testGameBoard = new GameBoard(10);
    const carrierCords = ["A0", "A1", "A2", "A3", "A4"];
    const carrierType = "Carrier";
    const carrier = { len: carrierCords, type: carrierType, sunk: false };
    testGameBoard.createShip(carrierCords, carrierType);
    expect(testGameBoard.ships[carrierType]).toEqual(carrier);
    const battleshipCords = ["A0", "A1", "A2", "A3"];
    const battleshipType = "Battleship";
    const battleship = {
      len: battleshipCords,
      type: battleshipType,
      sunk: false,
    };
    testGameBoard.createShip(battleshipCords, battleshipType);
    expect(testGameBoard.ships[battleshipType]).toEqual(battleship);
  });

  test("placeShip() should place ships at specific coordinates horizontally by making new ship", () => {
    const testGameBoard = new GameBoard(10);
    const carrierCords = ["A1", "A2", "A3", "A4", "A5"];
    const carrierType = "Carrier";
    const carrier = { len: carrierCords, type: carrierType, sunk: false };
    testGameBoard.placeShip("A1", 5, "X", "Carrier");
    for (let i = 0; i < carrierCords.length; i += 1) {
      expect(testGameBoard.board[0][i].ship).not.toBeNull();
      expect(testGameBoard.board[0][i].ship).toEqual(carrier);
    }
  });

  test("placeShip() should place ships at specific coordinates vertically by making new ship", () => {
    const testGameBoard = new GameBoard(10);
    const carrierCords = ["A1", "B1", "C1", "D1", "E1"];
    const carrierType = "Carrier";
    const carrier = { len: carrierCords, type: carrierType, sunk: false };
    testGameBoard.placeShip("A1", 5, "Y", "Carrier");
    for (let i = 0; i < carrierCords.length; i += 1) {
      expect(testGameBoard.board[i][0].ship).not.toBeNull();
      expect(testGameBoard.board[i][0].ship).toEqual(carrier);
    }
  });

  test("placeShip() should not place ships if there is a ship", () => {
    const testGameBoard = new GameBoard(10);
    testGameBoard.placeShip("A1", 5, "X", "Carrier");
    expect(() => testGameBoard.placeShip("A1", 4, "X", "Battleship")).toThrow(
      "Ship already exists"
    );
  });

  test("placeShip() should not place ships if coordinates are out of boundary", () => {
    const testGameBoard = new GameBoard(10);
    expect(() => testGameBoard.placeShip("A7", 5, "X", "Carrier")).toThrow(
      "Out of Boundary"
    );
    expect(() => testGameBoard.placeShip("G1", 5, "Y", "Carrier")).toThrow(
      "Out of Boundary"
    );
  });

  test("generateRandomPlacement() should place five ships randomly", () => {
    const testGameBoard = new GameBoard(10);
    for (let i = 0; i < fleet.length; i += 1) {
      testGameBoard.generateRandomPlacement(fleet[i].len, i + 1, fleet[i].type);
    }
    const totalShips = Object.keys(testGameBoard.ships).length;
    expect(totalShips).toBe(fleet.length);
  });

  test("receiveAttack() should take a coordinate and sends the ‘hit’ function to the correct ship if attack hits a ship", () => {
    const testGameBoard = new GameBoard(10);
    testGameBoard.placeShip("C1", 5, "X", "Carrier");
    testGameBoard.receiveAttack("C2");
    const len = ["C1", "C2-hit", "C3", "C4", "C5"];
    expect(testGameBoard.board[2][1].ship.len).toEqual(len);
    expect(testGameBoard.board[2][1].isHit).toBe(true);
  });

  test("receiveAttack() should take a coordinate and records the coordinates of the missed shot if attack misses a ship", () => {
    const testGameBoard = new GameBoard(10);
    testGameBoard.placeShip("C1", 5, "X", "Carrier");
    testGameBoard.receiveAttack("D2");
    testGameBoard.receiveAttack("E5");
    testGameBoard.receiveAttack("G4");
    const missed = ["D2", "E5", "G4"];
    expect(testGameBoard.missed).toEqual(missed);
  });

  test("checkAllSunk() should report whether or not all of their ships have been sunk", () => {
    const testGameBoard = new GameBoard(10);
    for (let i = 0; i < fleet.length; i += 1) {
      testGameBoard.generateRandomPlacement(fleet[i].len, i + 1, fleet[i].type);
    }
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        testGameBoard.receiveAttack(`${alphabets[i]}${j + 1}`);
      }
    }
    Object.keys(testGameBoard.ships).forEach((ship) => {
      testGameBoard.ships[ship].len.forEach((pos) => {
        expect(pos[pos.length - 1]).toBe(`t`);
      });
    });
    expect(testGameBoard.checkAllSunk()).toBe(true);
  });
});
