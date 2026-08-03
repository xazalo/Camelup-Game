import type Board from "./Board.js";
import type DicePool from "./DicePool.js";

import { Colors } from "../enums/index.js";
import { silenceLogs, restoreLogs } from "../../helpers/index.js";

/**
 * This class computes the probabilities of each racing camel winning the
 * current round. It computes the probability that each of the racing camels
 * (red, blue, yellow and green) ends up as the front camel (ranking first)
 * when the round finishes.
 *
 * The computation is an exhaustive enumeration over the dice that are still
 * going to be rolled in the current round. Because the round only rolls 5 of
 * the 6 dice, the number of remaining rolls is `pool.getRemaining() - 1`.
 *
 * Every remaining color in the pool is considered, including the white and
 * black camels, which move in reverse and carry the camels stacked on top of
 * them. This means a non-racing camel can "carry" a racing camel forward,
 * which is reflected in the resulting probabilities.
 */
export class Probabilities {
  red: number;
  blue: number;
  yellow: number;
  green: number;

  constructor() {
    this.red = 0;
    this.blue = 0;
    this.yellow = 0;
    this.green = 0;
  }

  defineProbabilities(dicePool: DicePool, board: Board) {
    const remaining = dicePool.getAvailable();
    const futureRolls = Math.max(0, remaining.length - 1);

    const counts: Record<Colors, number> = {
      [Colors.Red]: 0,
      [Colors.Blue]: 0,
      [Colors.Yellow]: 0,
      [Colors.Green]: 0,
      [Colors.White]: 0,
      [Colors.Black]: 0,
    };

    let total = 0;

    silenceLogs();

    try {
      if (futureRolls === 0) {
        const winner = board.getRaceRanking()[0];
        if (winner) {
          counts[winner]++;
          total++;
        }
      } else {
        const sequences = this.selections(remaining, futureRolls);
        const valueSets = this.diceValues(futureRolls, [1, 2, 3]);

        for (const sequence of sequences) {
          for (const values of valueSets) {
            const simulation = board.clone();

            for (let i = 0; i < futureRolls; i++) {
              simulation.moveCamelStack(
                sequence[i] as Colors,
                values[i] as number,
              );

              if (simulation.hasCamelReachedFinish()) break;
            }

            const winner = simulation.getRaceRanking()[0];
            if (winner) {
              counts[winner]++;
              total++;
            }
          }
        }
      }
    } finally {
      restoreLogs();
    }

    if (total === 0) {
      this.red = 0;
      this.blue = 0;
      this.yellow = 0;
      this.green = 0;
      return;
    }

    this.red = counts[Colors.Red] / total;
    this.blue = counts[Colors.Blue] / total;
    this.yellow = counts[Colors.Yellow] / total;
    this.green = counts[Colors.Green] / total;
  }

  /**
   * Returns every ordered selection of `length` distinct items taken from
   * `pool` (i.e. all permutations of all subsets of that size).
   */
  private selections(pool: Colors[], length: number): Colors[][] {
    if (length === 0) return [[]];

    const result: Colors[][] = [];

    for (const [index, item] of pool.entries()) {
      const rest = [...pool.slice(0, index), ...pool.slice(index + 1)];
      for (const tail of this.selections(rest, length - 1)) {
        result.push([item, ...tail]);
      }
    }

    return result;
  }

  /**
   * Returns every combination of dice values (1-3) of the given length.
   */
  private diceValues(length: number, options: number[]): number[][] {
    if (length === 0) return [[]];

    const result: number[][] = [];

    for (const tail of this.diceValues(length - 1, options)) {
      for (const value of options) {
        result.push([value, ...tail]);
      }
    }

    return result;
  }
}