import { TileType } from "../enums/index.js";
import { Dice } from "./index.js";
import { type Action } from "../types/index.js"

export default class Turn {
  playerId: string;
  action: Action;
  dice: Dice | null;

  constructor(playerId: string, action: Action, dice: Dice | null) {
    this.playerId = playerId;
    this.action = action;
    this.dice = dice;
  }
}