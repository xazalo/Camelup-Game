import { type Turn, Dice } from "./index.js";

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