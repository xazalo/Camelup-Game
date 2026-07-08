import { Colors } from "../../engine/enums/index.js";
import {
  Game,
  Board,
  Player,
  CardStorage,
  Round,
  DicePool,
  Dice,
  Turn,
  Camel,
} from "../../engine/models/index.js";
import { type DiceValue, type Action } from "../../engine/types/index.js";
import { randomNumber } from "../helpers/index.js";

/**
 * This class creates a controller for the game cli orders
 */
export default class GameController {
  game: Game | null = null;

  /**
   * Takes the names of the players, create a game, and define the initial position of the camels.
   * @param playerNames
   */
  startGame(playerNames: string[]): string {
    try {
      this.game = Game.create(playerNames);
      return "Game started";
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }

  /**
   * Return the state of the game.
   */
  getState() {
    return this.game;
  }

  /**
   * Roll the dice and moves camels across the board
   */
  rollTheDice(playerName: string) {
    if (!this.game) return "Game not started";

    try {
      this.game.rollDice(playerName);
      return "Dice rolled successfully";
    } catch (error) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }
}
