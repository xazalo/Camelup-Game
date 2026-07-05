enum Colors {
  Yellow,
  Green,
  Red,
  Blue,
  Black,
  White,
}

enum Directions {
  Right,
  Left,
}

export default class Camel {
  color: Colors;
  direction: Directions;

  constructor(color: Colors) {
    this.color = color;
    if (color === Colors.Black || color === Colors.White) {
      this.direction = Directions.Left;
    } else {
      this.direction = Directions.Right;
    }
  }
}
