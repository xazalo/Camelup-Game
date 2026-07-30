import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { log } from "../../helpers/logger.js";

describe("log", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T12:34:56.789Z"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should include player information when playerName is provided", () => {
    const result = log("Player action", "success", "Alice");

    expect(result).toContain("[SUCCESS]");
    expect(result).toContain("[Player: Alice]");
    expect(result).toContain("Player action");
  });

  it("should not include player information when playerName is missing", () => {
    const result = log("Game started", "started");

    expect(result).toContain("[STARTED]");
    expect(result).toContain("Game started");
    expect(result).not.toContain("[Player:");
  });

  it("should call console.log with the generated message", () => {
    const consoleSpy = vi.spyOn(console, "log");

    const result = log("Something happened", "info");

    expect(consoleSpy).toHaveBeenCalledWith(result);
  });

  it("should fallback when an invalid type is provided", () => {
    const result = log(
      "This should fail",
      "invalid-type" as any,
    );

    expect(result).toContain("[ERROR]");
    expect(result).toContain("***** Log didn't work properly *****");
  });
});