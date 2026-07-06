import { TileType } from "../enums/index.js";
import { Dice } from "./index.js";
import { type Action } from "../types/index.js"

/**
 * This class represents a turn in the game
 * @param {playerId} number, The position of the player in players array
 * @param {action} Action, The action executed by the player
 * @param {dice} Dice, If the player made a dice | null instead.
 */

export default class Turn {
  playerId: number;
  action: Action;
  dice: Dice | null;

  constructor(playerId: number, action: Action, dice: Dice | null) {
    this.playerId = playerId;
    this.action = action;
    this.dice = dice;
  }
}