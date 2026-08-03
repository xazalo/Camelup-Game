import { describe, expect, it } from "vitest";
import { Probabilities } from "../../engine/models/Probabilities.js";
import Board from "../../engine/models/Board.js";
import Camel from "../../engine/models/Camel.js";
import Colors from "../../engine/enums/Colors.js";
import type DicePool from "../../engine/models/DicePool.js";

function poolWith(colors: Colors[]): DicePool {
  return { getAvailable: () => colors } as unknown as DicePool;
}

describe("Probabilities", () => {
  it("should give 100% to the current leader when no rolls remain", () => {
    const board = new Board(16);
    board.spaces[0]!.addCamel(new Camel(Colors.Green));

    const probabilities = new Probabilities();
    probabilities.defineProbabilities(poolWith([Colors.Green]), board);

    expect(probabilities.green).toBe(1);
    expect(probabilities.red + probabilities.blue + probabilities.yellow).toBe(
      0,
    );
  });

  it("should account for black/white camels carrying racing camels", () => {
    const board = new Board(16);
    board.spaces[1]!.addCamel(new Camel(Colors.Black));
    board.spaces[1]!.addCamel(new Camel(Colors.Yellow));
    board.spaces[2]!.addCamel(new Camel(Colors.Red));

    const probabilities = new Probabilities();
    probabilities.defineProbabilities(poolWith([Colors.Red, Colors.Black]), board);

    expect(probabilities.red).toBeCloseTo(4 / 6, 10);
    expect(probabilities.yellow).toBeCloseTo(2 / 6, 10);
    expect(
      probabilities.red + probabilities.blue + probabilities.yellow +
        probabilities.green,
    ).toBeCloseTo(1, 10);
  });

  it("should return normalized probabilities that sum to 1", () => {
    const board = new Board(16);
    board.createCamels();

    const probabilities = new Probabilities();
    probabilities.defineProbabilities(
      poolWith([
        Colors.Green,
        Colors.Blue,
        Colors.Red,
        Colors.Yellow,
        Colors.White,
        Colors.Black,
      ]),
      board,
    );

    const sum =
      probabilities.red + probabilities.blue + probabilities.yellow +
      probabilities.green;

    expect(sum).toBeCloseTo(1, 10);
    expect(probabilities.red).toBeGreaterThanOrEqual(0);
    expect(probabilities.blue).toBeGreaterThanOrEqual(0);
    expect(probabilities.yellow).toBeGreaterThanOrEqual(0);
    expect(probabilities.green).toBeGreaterThanOrEqual(0);
  });
});
