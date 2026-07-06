import { Colors, Directions } from "../enums/index.js"

/**
 * This class create one Camel, in this game the camels are used for
 * bet them, they are moving themselves through the board, generating changes
 * on the win and lose probabilities.
 * 
 * @param { color } string, This is the color of the camel
 * 
 * @param { direction } string Define the direction, can be from start to end
 *                             or from end to start if the camel are 
 *                             black or white.  
 */

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
