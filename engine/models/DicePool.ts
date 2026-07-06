import { Colors } from "../enums/index.js";

/**
* This class is a pool, this pool register the dices which are success on
* one Round.
* 
* Is defined empty and next it needs to be filled whit the colors of the dices,
* it's for avoid another use of this colors, because this use can create multiple
* movements through the round
*/

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

  /**
 * Resets the dice pool to its initial state,
 * making all camel colors available again.
 */
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

/**
 * Draws a random camel color from the pool.
 * The drawn color is removed and cannot be drawn again
 * until the pool is reset.
 *
 * @returns The randomly selected camel color.
 * 
 * @throws {Error} If there are no dice available.
 */
draw(): Colors {
  if (this.colors.length === 0) {
    throw new Error("No dice available");
  }

  const index = Math.floor(Math.random() * this.colors.length);

  const color = this.colors.splice(index, 1)[0];

  return color as Colors;
}

/**
 * Returns all colors that are still available
 * in the dice pool.
 *
 * @returns A copy of the remaining colors.
 */
getAvailable(): Colors[] {
  return [...this.colors];
}

/**
 * Returns the number of dice remaining
 * in the pool.
 *
 * @returns The number of available dice.
 */
getRemaining(): number {
  return this.colors.length;
}
}
