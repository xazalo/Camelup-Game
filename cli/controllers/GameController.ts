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
import { TileType } from "../../engine/enums/TileType.js";

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
    try {
      return this.game;
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }

  /**
   * This function place a tile card
   */
  placeTile(playerName: string, position: number, tileType: TileType) {
    if (!this.game) {
      return "Game not started";
    }

    try {
      this.game.placeTile(playerName, position, tileType);
      return "Tile placed";
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
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

  /**
   * Place a bet for the camel that will win the game
   */
  placeWinnerBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return "Game not started";
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return "Camel not found";
      }

      this.game.placeWinnerBet(playerName, camel);
      return "Winner bet placed";
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }

  /**
   * Place a bet for the camel that will lose the game
   */
  placeLoserBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return "Game not started";
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return "Camel not found";
      }

      this.game.placeLoserBet(playerName, camel);
      return "Loser bet placed";
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }

  /**
   * Place a bet for the winner of the current round
   */
  takeRoundBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return "Game not started";
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return "Camel not found";
      }

      this.game.takeRoundBet(playerName, camel);
      return "Round bet placed";
    } catch (error: unknown) {
      return error instanceof Error ? error.message : "Unknown error";
    }
  }
}
