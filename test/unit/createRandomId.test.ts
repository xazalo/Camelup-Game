import { describe, expect, it } from "vitest";
import createRandomId from "../../cli/helpers/createRandomId.js";

describe("createRandomId", () => {
  it("should return a string", () => {
    const id = createRandomId();
    expect(typeof id).toBe("string");
  });

  it("should return a string whit 34 characters", () => {
    for (let i = 0; i < 1000; i++) {
      const id = createRandomId();
      expect(id.length).toBe(34);
    }
  });

  it("should generate different ids", () => {
    const id1 = createRandomId();
    const id2 = createRandomId();
    expect(id1).not.toBe(id2);
  });

  it("should contain a date prefix", () => {
    const id = createRandomId();
    expect(id).toMatch(/^\d+-/);
  });
});
