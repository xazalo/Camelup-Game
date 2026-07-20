import { describe, it, expect } from "vitest";
import { generatePayoutTable } from "../../cli/helpers/index.js";

describe("generatePayoutTable", () => {
  it("should return the correct table for the first betting card (5)", () => {
    expect(generatePayoutTable(5)).toEqual({
      1: 5,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should return the correct table for the second betting card (4)", () => {
    expect(generatePayoutTable(4)).toEqual({
      1: 3,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should return the correct table for the third betting card (3)", () => {
    expect(generatePayoutTable(3)).toEqual({
      1: 2,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should return the correct table for the last betting card (2)", () => {
    expect(generatePayoutTable(2)).toEqual({
      1: 1,
      2: 1,
      3: -1,
      4: -1,
    });
  });

  it("should return the default table for unexpected values", () => {
    expect(generatePayoutTable(1)).toEqual({
      1: 1,
      2: 1,
      3: -1,
      4: -1,
    });

    expect(generatePayoutTable(0)).toEqual({
      1: 1,
      2: 1,
      3: -1,
      4: -1,
    });
  });
});