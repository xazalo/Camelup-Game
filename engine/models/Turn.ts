import { Dice } from "./index.js";
import { type Action } from "../types/index.js"

/**
 * This class represents a turn in the game
 * @param {playerId} number, The position of the player in players array
 * @param {action} Action, The action executed by the player
 * @param {dice} Dice, If the player made a dice | null instead.
 */

export default class Turn {
  playerName: string;
  action: Action;
  dice: Dice | null;

  constructor(playerName: string, action: Action, dice: Dice | null) {
    this.playerName = playerName;
    this.action = action;
    this.dice = dice;
  }
}