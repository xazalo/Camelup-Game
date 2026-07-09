import { describe, it, expect, beforeEach } from "vitest";
import GameController from "../../cli/controllers/GameController.js";
import type Game from "../../engine/models/Game.js";

describe("GameController", () => {
  let gameController: GameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  describe("startGame", () => {
    it("should start a game correctly", () => {
      const result = gameController.startGame(["enzo", "pizza"]);

      expect(result).toBe("Game started");
    });

    it("should return an error if player amount is invalid", () => {
      const result = gameController.startGame(["enzo"]);

      expect(result).toBe("This Game must have between 2 and 6 players");
    });

    it("should return an error if there are too many players", () => {
      const result = gameController.startGame([
        "Player1",
        "Player2",
        "Player3",
        "Player4",
        "Player5",
        "Player6",
        "Player7",
      ]);

      expect(result).toBe("This Game must have between 2 and 6 players");
    });

    it("should expose the created game state", () => {
      gameController.startGame(["enzo", "pizza"]);

      const state = gameController.getState();
      expect(state).toBeDefined();
    });
  });

  describe("getState", () => {
    it("should return null if game has not started", () => {
      const state = gameController.getState();

      expect(state).toBe(null);
    });

    it("should return the current game instance after starting", () => {
      gameController.startGame(["enzo", "pizza"]);

      const state = gameController.getState();

      expect(state).toBeDefined();
    });
  });

  describe("placeTile", () => {
    it("should place a tile", () => {
      gameController.startGame(["John", "Doe"]);
      const r = gameController.placeTile("John", 1, 1);
      const state = gameController.getState() as Game;

      const tileType = state?.board.spaces[1]?.tile.returnTileType();
      const hasTile = state?.board.spaces[1]?.tile.hasTile();

      expect(r).toBe("Tile placed");
      expect(tileType).toBe(1);
      expect(hasTile).toBe(true);
    });

    it("should throw error if the player already have a tile placed", () => {
      gameController.startGame(["John", "Doe"]);
      gameController.placeTile("John", 1, 1);
      const result = gameController.placeTile("John", 2, 1);
      expect(result).toBe("Tile already placed");
    });
  });

  describe("rollTheDice", () => {
    it("should return error if game has not started", () => {
      const result = gameController.rollTheDice("enzo");

      expect(result).toBe("Game not started");
    });

    it("should call the game roll action for a valid player", () => {
      gameController.startGame(["Player1", "Player2"]);

      const r = gameController.rollTheDice("Player1");

      expect(r).toBe("Dice rolled successfully");
    });

    it("should return an error when the player action is rejected", () => {
      gameController.startGame(["Player1", "Player2"]);

      const result = gameController.rollTheDice("Unknown");

      expect(result).toBe("Player not found");
    });
  });
});
