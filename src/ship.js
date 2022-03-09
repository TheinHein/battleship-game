export default class Ship {
  constructor(cords, type) {
    this.len = cords;
    this.type = type;
    this.sunk = false;
  }

  hit(cord) {
    this.len = this.len.map((pos) => {
      let isHit = pos;
      if (isHit === cord) {
        isHit = `${cord}-hit`;
      }
      return isHit;
    });
    this.isSunk();
  }

  isSunk() {
    if (this.len.every((pos) => pos[pos.length - 1] === "t")) this.sunk = true;
    else this.sunk = false;
  }
}
