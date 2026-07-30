import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import createRandomId from "../../helpers/createRandomId.js";

vi.mock("../../helpers/randomNumber.js", () => ({
  default: vi.fn(() => 0),
}));

import randomNumber from "../../helpers/randomNumber.js";

describe("createRandomId", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T12:34:56.789Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should create an id with the correct format", () => {
    const result = createRandomId();

    expect(result).toMatch(/^\d{17}-[A-Za-z0-9]{16}$/);
  });

  it("should include the current date and time in the id", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T14:34:56.789"));

    const result = createRandomId();

    const [datePart] = result.split("-");

    expect(datePart).toBe("20260731143456789");

    vi.useRealTimers();
  });

  it("should generate a random part with 16 characters", () => {
    const result = createRandomId();

    const [, randomPart] = result.split("-");

    expect(randomPart).toHaveLength(16);
  });

  it("should generate the expected random characters", () => {
    const result = createRandomId();

    const [, randomPart] = result.split("-");

    expect(randomPart).toBe("AAAAAAAAAAAAAAAA");
  });
});
