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
    } catch(error: unknown) {
      if(error instanceof Error) return error.message as string;
      else return "Unknown Error"
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
  //warn this is only a schema needs ro be refactored using the methods across the project
  /*rollTheDice(playerName: string) {
    if (!this.game) return "Game not started";

    //take the player
    const index = this.game.getPlayerIndexByName(playerName);
    const currentPlayer = this.game.players[index];

    //validate if the player === current player
    const validTurn = this.game.playerHasTurn(index);
    if (!validTurn) return "Is not your turn, please wait";

    //update money
    currentPlayer?.updateMoney(1);

    //roll the dice and push it to the dice pool
    this.game.processDiceRoll(this.game.players[index] as Player);

    //!warn I think is finished review it.
  }*/
}
