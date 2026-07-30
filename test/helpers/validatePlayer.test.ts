import { describe, expect, it, vi } from "vitest";
import isPlayerValid from "../../helpers/validatePlayer.js";

describe("isPlayerValid", () => {
  it("should return true when player exists and id is valid", () => {
    const controller = {
      game: {
        getPlayerIndexByName: vi.fn().mockReturnValue(1),
        players: [
          {},
          {
            validateId: vi.fn().mockReturnValue(true),
          },
        ],
      },
    } as unknown as any;

    const result = isPlayerValid(controller, "John", "valid-id");

    expect(result).toBe(true);
    expect(controller.game?.getPlayerIndexByName).toHaveBeenCalledWith("John");
    expect(controller.game?.players[1].validateId).toHaveBeenCalledWith(
      "valid-id",
    );
  });

  it("should return unauthorized when player id is invalid", () => {
    const controller = {
      game: {
        getPlayerIndexByName: vi.fn().mockReturnValue(1),
        players: [
          {},
          {
            validateId: vi.fn().mockReturnValue(false),
          },
        ],
      },
    } as unknown as any;

    const result = isPlayerValid(controller, "John", "wrong-id");

    expect(result).toBe("Unauthorized player");
  });

  it("should return bug message when player index is undefined", () => {
    const controller = {
      game: {
        getPlayerIndexByName: vi.fn().mockReturnValue(undefined),
      },
    } as unknown as any;

    const result = isPlayerValid(controller, "Unknown", "id");

    expect(result).toBe("There is a bug at the index in valid player");
  });

  it("should return bug message when game does not exist", () => {
    const controller = {
      game: undefined,
    } as unknown as any;

    const result = isPlayerValid(controller, "John", "id");

    expect(result).toBe("There is a bug at the index in valid player");
  });

  it("should handle player at index 0", () => {
    const controller = {
      game: {
        getPlayerIndexByName: vi.fn().mockReturnValue(0),
        players: [
          {
            validateId: vi.fn().mockReturnValue(true),
          },
        ],
      },
    } as unknown as any;

    const result = isPlayerValid(controller, "FirstPlayer", "id");

    expect(result).toBe("There is a bug at the index in valid player");
  });
});