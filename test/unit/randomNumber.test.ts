import { describe, it, expect } from "vitest";
import { randomNumber } from "../../cli/helpers/index.js";

describe("createRandomNumber", () => {
  it("should create a random number", () => {
    const rNum = randomNumber(5);
    expect(typeof rNum).toBe("number");
  });

  it("should always return a number inside the range", () => {
    const max = 99;
    for (let i = 0; i < 1000; i++) {
      const rNum = randomNumber(max);
      expect(rNum).toBeGreaterThanOrEqual(0);
      expect(rNum).toBeLessThan(max);
    }
  });
});
