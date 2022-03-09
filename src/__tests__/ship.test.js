import Ship from "../ship";
import fleet from "../helpers/fleet";

describe("Ship Factory Function Test", () => {
  test("Ship Length should be array with length of provided argument", () => {
    const testShip = new Ship(fleet);
    expect(testShip.len).toEqual(fleet);
  });

  test("hit() should take a number and then marks that position as 'hit' inside len array", () => {
    const testShip = new Ship(fleet);
    for (let i = 0; i < fleet.length; i += 1) {
      testShip.hit(fleet[i]);
      expect(testShip.len[i]).toBe(`${fleet[i]}-hit`);
    }
  });

  test("isSunk() should return false if all of the ship's position are not 'hit'", () => {
    const testShip = new Ship(fleet);
    for (let i = 0; i < fleet.length - 1; i += 1) {
      testShip.hit(fleet[i]);
      expect(testShip.len[i]).toBe(`${fleet[i]}-hit`);
    }
    expect(testShip.sunk).toBe(false);
  });

  test("isSunk() should return true if all of the ship's position are not 'hit'", () => {
    const testShip = new Ship(fleet);
    for (let i = 0; i < fleet.length; i += 1) {
      testShip.hit(fleet[i]);
      expect(testShip.len[i]).toBe(`${fleet[i]}-hit`);
    }
    expect(testShip.sunk).toBe(true);
  });
});
