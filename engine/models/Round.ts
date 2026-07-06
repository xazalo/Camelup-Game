import { type Turn, Dice } from "./index.js";

/**
 * This class defines a round in the game.
 * @param {turns} Turn[], A list of the turns witch includes de actions
 * @param {rolledDice} Dice[], A list of the dices made by itself
 */

export default class Round {
  turns: Turn[];
  rolledDice: Dice[];

  constructor() {
    this.turns = [];
    this.rolledDice = [];
  }

  addTurn(turn: Turn) {
    this.turns.push(turn);

    if (turn.dice) {
      this.rolledDice.push(turn.dice);
    }
  }

  isFinished(): boolean {
    return this.rolledDice.length === 5;
  }
}