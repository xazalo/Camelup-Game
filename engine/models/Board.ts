import { Colors, Directions } from "../enums/index.js";
import { Camel, Stack } from "./index.js";

export default class Board {
  spaces: Stack[];

  constructor(size: number) {
    this.spaces = Array.from({ length: size }, () => new Stack());
  }

  //! this logic is correct but only for setup for game 
  //! needs to detect all the camels witch are moved before of move 
  //! because now it's moving only one camel in each movement
  //! but they need to move the camel and all the camels up instead.

  moveCamel(color: Colors, steps: number): void {
    let camel: Camel | null = null;
    let currentPosition = -1;

    // find camel
    for (const [index, stack] of this.spaces.entries()) {
      camel = stack.removeCamel(color);

      if (camel) {
        currentPosition = index;
        break;
      }
    }

    if (!camel) {
      throw new Error(`Camel ${color} not found`);
    }

    const size = this.spaces.length;

    // calculate destination
    let destination =
      camel.direction === Directions.Right
        ? currentPosition + steps
        : currentPosition - steps;

    // rounded board movement
    destination = ((destination % size) + size) % size;

    const destinationStack = this.spaces[destination];

    if (!destinationStack) {
      throw new Error(`Invalid board state at ${destination}`);
    }

    // move camel
    destinationStack.addCamel(camel);
  }

  moveCamelStack() {}
}
