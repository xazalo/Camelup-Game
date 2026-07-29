import { Colors, Directions } from "../enums/index.js";
import { Camel, Stack, Player } from "./index.js";
import { TileType } from "../enums/index.js";
import { log } from "../../helpers/logger.js";

/**
 * This class defines de board of the Game, and also
 * contains methods for move the camels through the tiles
 *
 * @param {size} number, this is the size of the board
 * @param {raceFinished} boolean, bool for indicate if the game is finished
 */

export default class Board {
  spaces: Stack[];
  private raceFinished = false;

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

  moveCamel(color: Colors, steps: number, player?: Player): string | void {
    let camel: Camel | null = null;
    let currentPosition = -1;

    for (const [index, stack] of this.spaces.entries()) {
      camel = stack.removeCamel(color);
      if (camel) {
        currentPosition = index;
        break;
      }
    }

    if (!camel) {
      return log(`Camel not found  ${color}`, "error");
    }

    const size = this.spaces.length;

    let destination =
      camel.direction === Directions.Right
        ? currentPosition + steps
        : currentPosition - steps;

    if (
      camel.direction === Directions.Right &&
      [Colors.Green, Colors.Blue, Colors.Red, Colors.Yellow].includes(
        camel.color,
      ) &&
      currentPosition + steps >= size
    ) {
      this.raceFinished = true;
    }

    destination = ((destination % size) + size) % size;

    const effect = this.applyTileEffect(destination, player);

    if (typeof effect === "string")
      return log(`Invalid board state at ${destination}`, "error");

    destination = effect;

    const destinationStack = this.spaces[destination];
    if (!destinationStack) {
      return log(`Invalid board state at ${destination}`, "error");
    }

    destinationStack.addCamel(camel);

    return log("Camel moved successfully", "info");
  }

  createCamels(): void {
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

  moveCamelStack(color: Colors, steps: number, player?: Player): string | void {
    let camels: Camel[] = [];
    let currentPosition = -1;

    for (const [index, stack] of this.spaces.entries()) {
      camels = stack.removeCamelStack(color);
      if (camels.length > 0) {
        currentPosition = index;
        break;
      }
    }

    if (camels.length === 0) {
      return log(`Camel not found ${color}`, "error");
    }

    const size = this.spaces.length;

    let destination =
      camels[0]!.direction === Directions.Right
        ? currentPosition + steps
        : currentPosition - steps;

    if (
      camels[0]!.direction === Directions.Right &&
      [Colors.Green, Colors.Blue, Colors.Red, Colors.Yellow].includes(
        camels[0]!.color,
      ) &&
      currentPosition + steps >= size
    ) {
      this.raceFinished = true;
    }

    destination = ((destination % size) + size) % size;

    const effect = this.applyTileEffect(destination, player);

    if (typeof effect === "string")
      return log(`Invalid board state at ${destination}`, "error");

    destination = effect;

    const destinationStack = this.spaces[destination];
    if (!destinationStack) {
      return log(`Invalid board state at ${destination}`, "error");
    }

    destinationStack.addCamels(camels);

    return log("Camel stack moved successfully", "info");
  }

  findCamelByColor(color: Colors): Camel | string {
    for (const stack of this.spaces) {
      const camel = stack.camels.find((c) => c.color === color);
      if (camel) return camel;
    }

    return log(`Camel not found on the board ${color}`, "error");
  }

  hasCamelReachedFinish(): boolean {
    return this.raceFinished;
  }

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

  private applyTileEffect(
    destination: number,
    player?: Player,
  ): number | string {
    const destinationStack = this.spaces[destination];

    if (!destinationStack || !destinationStack.tile.hasTile()) {
      return destination;
    }

    const size = this.spaces.length;

    if (destinationStack.tile.tileType === TileType.Oasis) {
      if (player) {
        player.updateMoney(1);
      }

      return (destination + 1) % size;
    }

    if (destinationStack.tile.tileType === TileType.Mirage) {
      if (player) {
        player.updateMoney(-1);
      }

      return (((destination - 1) % size) + size) % size;
    }

    return destination;
  }
}
