import Player from "../player";
import alphabets from "../helpers/alphabets";

describe("Player Class Test", () => {
  test("player should make its own game board", () => {
    const testPlayer = new Player();
    const board = [];
    for (let x = 0; x < 10; x += 1) {
      const row = [];
      board.push(row);
      for (let y = 0; y < 10; y += 1) {
        const cellData = {
          cord: `${alphabets[x]}${y + 1}`,
          ship: null,
          isHit: false,
          isMissed: false,
        };
        row.push(cellData);
      }
    }
    expect(testPlayer.gameBoard.board).toEqual(board);
  });

  test("player should know its enemy game board", () => {
    const testPlayer1 = new Player();
    const testPlayer2 = new Player();
    testPlayer1.assignEnemyGameBoard(testPlayer2.gameBoard);
    testPlayer2.assignEnemyGameBoard(testPlayer1.gameBoard);
    const board = [];
    for (let x = 0; x < 10; x += 1) {
      const row = [];
      board.push(row);
      for (let y = 0; y < 10; y += 1) {
        const cellData = {
          cord: `${alphabets[x]}${y + 1}`,
          ship: null,
          isHit: false,
          isMissed: false,
        };
        row.push(cellData);
      }
    }
    expect(testPlayer1.enemyGameBoard.board).toEqual(board);
    expect(testPlayer2.enemyGameBoard.board).toEqual(board);
  });

  test("attack() should attack enemy game board", () => {
    const testPlayer1 = new Player();
    const testPlayer2 = new Player();
    testPlayer1.assignEnemyGameBoard(testPlayer2.gameBoard);
    testPlayer2.assignEnemyGameBoard(testPlayer1.gameBoard);
    testPlayer1.attack("A1");
    expect(testPlayer2.gameBoard.missed).toEqual(["A1"]);
    testPlayer2.attack("B4");
    expect(testPlayer1.gameBoard.missed).toEqual(["B4"]);
  });
});
