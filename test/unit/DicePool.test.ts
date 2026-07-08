import { describe, it, expect, beforeEach } from "vitest";

import DicePool from "../../engine/models/DicePool.js";
import { Colors } from "../../engine/enums/index.js";

describe("DicePool", () => {
  let dicePool: DicePool;

  beforeEach(() => {
    dicePool = new DicePool();
  });

  describe("constructor", () => {
    it("should initialize with all camel colors available", () => {
      expect(dicePool.getRemaining()).toBe(6);

      expect(dicePool.getAvailable()).toEqual([
        Colors.Yellow,
        Colors.Green,
        Colors.Blue,
        Colors.Red,
        Colors.White,
        Colors.Black,
      ]);
    });
  });

  describe("draw", () => {
    it("should return a color from the pool", () => {
      const color = dicePool.draw();

      expect([
        Colors.Yellow,
        Colors.Green,
        Colors.Blue,
        Colors.Red,
        Colors.White,
        Colors.Black,
      ]).toContain(color);
    });

    it("should remove the drawn color from available colors", () => {
      const color = dicePool.draw();

      expect(dicePool.getAvailable()).not.toContain(color);
      expect(dicePool.getRemaining()).toBe(5);
    });

    it("should not allow drawing the same color twice", () => {
      const firstDraw = dicePool.draw();

      const secondDraw = dicePool.draw();

      expect(secondDraw).not.toBe(firstDraw);
      expect(dicePool.getRemaining()).toBe(4);
    });

    it("should throw when there are no dice available", () => {
      for (let i = 0; i < 6; i++) {
        dicePool.draw();
      }

      expect(() => dicePool.draw())
        .toThrow("No dice available");
    });
  });

  describe("reset", () => {
    it("should restore all colors after drawing dice", () => {
      dicePool.draw();
      dicePool.draw();

      expect(dicePool.getRemaining()).toBe(4);

      dicePool.reset();

      expect(dicePool.getRemaining()).toBe(6);
    });

    it("should restore the original colors", () => {
      dicePool.draw();

      dicePool.reset();

      expect(dicePool.getAvailable()).toEqual([
        Colors.Yellow,
        Colors.Green,
        Colors.Blue,
        Colors.Red,
        Colors.White,
        Colors.Black,
      ]);
    });
  });

  describe("getAvailable", () => {
    it("should return a copy of the available colors", () => {
      const available = dicePool.getAvailable();

      available.pop();

      expect(dicePool.getRemaining()).toBe(6);
    });
  });

  describe("getRemaining", () => {
    it("should return the amount of available dice", () => {
      dicePool.draw();
      dicePool.draw();

      expect(dicePool.getRemaining()).toBe(4);
    });
  });
});