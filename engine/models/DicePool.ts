import { Colors } from "../enums/index.js";

export default class DicePool {
  private colors: Colors[] = [
    Colors.Yellow,
    Colors.Green,
    Colors.Blue,
    Colors.Red,
    Colors.White,
    Colors.Black,
  ];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.colors = [
      Colors.Yellow,
      Colors.Green,
      Colors.Blue,
      Colors.Red,
      Colors.White,
      Colors.Black,
    ];
  }

  draw(): Colors {
    if (this.colors.length === 0) {
      throw new Error("No dice available");
    }

    const index = Math.floor(Math.random() * this.colors.length);

    const color = this.colors.splice(index, 1)[0];

    return color as Colors;
  }

  getAvailable(): Colors[] {
    return [...this.colors];
  }

  getRemaining(): number {
    return this.colors.length;
  }
}
