import { Colors, Directions } from "../enums/index.js";
import { Camel, Game, Stack, Player } from "./index.js";
import { TileType } from "../enums/index.js";

/**
 * This class defines de board of the Game, and also
 * contains methods for move the camels through the tiles
 *
 * @param {size} number, this is the size of the board
 */

export default class Board {
  spaces: Stack[];

  constructor(size: number) {
    this.spaces = Array.from({ length: size }, () => new Stack());
  }

  /**
   * This method is used for set the camels on their initial position
   * only at the game start, never in the players actions
   *
   * @param {color} string, This is one string whit the color of the camel for move,
   *                        used for select it.
   *
   * @param {steps} number, Define the size of the movement across the tiles
   *                        the camels has a property called direction
   *                        this direction can be Left or Right
   *                        this is because the white and black camels move
   *                        in reverse than the other camels
   *
   */

  moveCamel(color: Colors, steps: number, player?: Player): void {
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

    if (destinationStack.tile.hasTile() && player) {
      if (destinationStack.tile.tileType === TileType.Oasis)
        player.updateMoney(1);
      else if (destinationStack.tile.tileType === TileType.Mirage)
        player.updateMoney(-1);
    }
  }

  /**
   * Creates and places all camels on the starting tile.
   */
  createCamels() {
    const camels = [
      new Camel(Colors.Green),
      new Camel(Colors.Blue),
      new Camel(Colors.Red),
      new Camel(Colors.Yellow),
      new Camel(Colors.White),
      new Camel(Colors.Black),
    ];

    camels.forEach((camel) => {
      this.spaces[0]?.addCamel(camel);
    });
  }

  /**
   * This function extends moveCamel, the idea is move al the camels which are
   * up than the camel inside the tile.
   *
   * @param { color } string, again uses the color for select the camel
   *
   * @param { steps } number This is the number the steps for advance
   */
  moveCamelStack(color: Colors, steps: number): void {
    let camels: Camel[] = [];
    let currentPosition = -1;

    // find camel stack
    for (const [index, stack] of this.spaces.entries()) {
      camels = stack.removeCamelStack(color);

      if (camels.length > 0) {
        currentPosition = index;
        break;
      }
    }

    if (camels.length === 0) {
      throw new Error(`Camel ${color} not found`);
    }

    const size = this.spaces.length;

    // calculate destination
    let destination =
      camels[0]!.direction === Directions.Right
        ? currentPosition + steps
        : currentPosition - steps;

    // rounded board movement
    destination = ((destination % size) + size) % size;

    const destinationStack = this.spaces[destination];

    if (!destinationStack) {
      throw new Error(`Invalid board state at ${destination}`);
    }

    // move camel stack
    destinationStack.addCamels(camels);
  }

  findCamelByColor(color: Colors): Camel {
    for (const stack of this.spaces) {
      const camel = stack.camels.find((c) => c.color === color);
      if (camel) return camel;
    }
    throw new Error(`Camel ${color} not found on the board`);
  }

  /**
   * This method validates if one camel reached the finish tile and the game is finished
   */
  hasCamelReachedFinish(): boolean {
    const racingCamels = [Colors.Green, Colors.Blue, Colors.Red, Colors.Yellow];
    const camels = this.spaces[this.spaces.length - 1]?.camels ?? [];
    return camels.some((camel) => racingCamels.includes(camel.color));
  }

  /**
   * This method gets the race ranking for calculate the rewards
   */
  getRaceRanking(): Colors[] {
    const ranking: Colors[] = [];
    const racingCamels = [Colors.Green, Colors.Blue, Colors.Red, Colors.Yellow];

    for (let i = this.spaces.length - 1; i >= 0; i--) {
      const stack = this.spaces[i]!;

      for (let i = stack.camels.length - 1; i >= 0; i--) {
        const camel = stack.camels[i]!;

        if (racingCamels.includes(camel.color)) {
          ranking.push(camel.color);
        }
      }
    }

    return ranking;
  }
}
