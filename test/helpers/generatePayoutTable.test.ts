import { describe, expect, it } from "vitest";
import generatePayoutTable from "../../helpers/generatePayoutTable.js";

describe("generatePayoutTable", () => {
  it("should generate payout table for top value 5", () => {
    const result = generatePayoutTable(5);

    expect(result).toEqual({
      1: 5,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should generate payout table for top value 4", () => {
    const result = generatePayoutTable(4);

    expect(result).toEqual({
      1: 3,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should generate payout table for top value 3", () => {
    const result = generatePayoutTable(3);

    expect(result).toEqual({
      1: 2,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should generate default payout table for other values", () => {
    const values = [0, 1, 2, 6, 10, -1];

    values.forEach((value) => {
      expect(generatePayoutTable(value)).toEqual({
        1: 1,
        2: 1,
        3: -1,
        4: -1,
      });
    });
  });
});