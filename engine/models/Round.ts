import { Turn, Dice, DicePool, Board } from "./index.js";
import { randomNumber } from "../../cli/helpers/index.js";
import { type DiceValue } from "../types/index.js";

/**
 * This class defines a round in the game.
 * @param {turns} Turn[], A list of the turns witch includes de actions
 * @param {rolledDice} Dice[], A list of the dices made by itself
 */

export default class Round {
  turns: Turn[];
  rolledDice: Dice[];
  dicePool: DicePool;

  constructor() {
    this.turns = [];
    this.rolledDice = [];
    this.dicePool = new DicePool();
  }

  prepareInitialMoves(board: Board) {
    for (let i = 0; i < 4; i++) {
      const color = this.dicePool.draw();
      const value = (randomNumber(3) + 1) as DiceValue;
      //const dice = new Dice(color, value);
      //this.addTurn(new Turn("System", { type: "RollDice" }, dice));
      //? it's better to no register the first movement, this is because
      //? we are moving only 4 camels, so the turn don't finish 1 dice remaining,
      //? this create an error because the new round is not started on the next round.
      //? for implement the register of the first moves, is needed to create another method
      //? instead of reuse the method for move the camels.
      //? Whatever it's better to keep it without register it, probably don't needed.
      board.moveCamel(color, value);
    }
  }

  /**
   * Add a new turn.
   */
  addTurn(turn: Turn) {
    this.turns.push(turn);

    if (turn.dice) {
      this.rolledDice.push(turn.dice);
    }
  }

  /**
   * Return if the round if finished
   */
  isFinished(): boolean {
    return this.rolledDice.length === 5;
  }
}
