import { describe, it, expect } from "vitest";
import { generatePayoutTable } from "../../cli/helpers/index.js";
import { type PayoutTable } from "../../engine/types/index.js"

describe("generatePayoutTable", () => {
  it("should return the correct table for topValue 5", () => {
    const expected: PayoutTable = { 1: 5, 2: 3, 3: 2, 4: -1 };
    expect(generatePayoutTable(5)).toEqual(expected);
  });

  it("should return the correct table for topValue 4", () => {
    const expected: PayoutTable = { 1: 3, 2: 2, 3: 1, 4: -1 };
    expect(generatePayoutTable(4)).toEqual(expected);
  });

  it("should return the correct table for topValue 3", () => {
    const expected: PayoutTable = { 1: 2, 2: 1, 3: 1, 4: -1 };
    expect(generatePayoutTable(3)).toEqual(expected);
  });

  it("should return the default case for undefined values (e.g., 2)", () => {
    const expected: PayoutTable = { 1: 1, 2: 1, 3: 1, 4: -1 };
    expect(generatePayoutTable(2)).toEqual(expected);
  });
});
