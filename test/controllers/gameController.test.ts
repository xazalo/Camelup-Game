import { describe, it, expect, beforeEach } from "vitest";
import GameController from "../../cli/controllers/GameController.js";
import type { Game } from "../../engine/models/index.js";
import { Colors } from "../../engine/enums/index.js";

describe("GameController", () => {
  let gameController: GameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  const players = [
    { name: "Player1", isAI: false },
    { name: "Player2", isAI: false },
  ];

  describe("startGame", () => {
    it("should start a game correctly", () => {
      const result = gameController.startGame(players, "testgameId");

      expect(result).toBe("Game started");
    });

    it("should return an error if player amount is invalid", () => {
      const result = gameController.startGame(
        [{ name: "Player1", isAI: false }],
        "testgameId",
      );

      expect(result).toBe("This Game must have between 2 and 6 players");
    });

    it("should return an error if there are too many players", () => {
      const result = gameController.startGame(
        [
          { name: "Player1", isAI: false },
          { name: "Player2", isAI: false },
          { name: "Player3", isAI: false },
          { name: "Player4", isAI: false },
          { name: "Player5", isAI: false },
          { name: "Player6", isAI: false },
          { name: "Player7", isAI: false },
        ],
        "testgameId",
      );

      expect(result).toBe("This Game must have between 2 and 6 players");
    });

    it("should expose the created game state", () => {
      gameController.startGame(players, "testgameId");

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
      gameController.startGame(players, "testgameId");

      const state = gameController.getState();

      expect(state).toBeDefined();
    });
  });

  describe("placeTile", () => {
    it("should place a tile", () => {
      gameController.startGame(players, "testgameId");
      const r = gameController.placeTile("Player1", 1, 1);
      const state = gameController.getState() as Game;

      const tileType = state?.board.spaces[1]?.tile.returnTileType();
      const hasTile = state?.board.spaces[1]?.tile.hasTile();

      expect(r).toBe("Tile placed");
      expect(tileType).toBe(1);
      expect(hasTile).toBe(true);
    });

    it("should throw error if the player already have a tile placed", () => {
      gameController.startGame(players, "testgameId");
      gameController.placeTile("Player1", 1, 1);
      gameController.placeTile("Player2", 2, 1);
      const result = gameController.placeTile("Player1", 4, 1);
      expect(result).toBe("Tile already placed");
    });
  });

  describe("rollTheDice", () => {
    it("should return error if game has not started", () => {
      const result = gameController.rollTheDice("enzo");

      expect(result).toBe("Game not started");
    });

    it("should call the game roll action for a valid player", () => {
      gameController.startGame(players, "testgameId");

      const r = gameController.rollTheDice("Player1");

      expect(r).toBe("Dice rolled successfully");
    });

    it("should return an error when the player action is rejected", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.rollTheDice("Unknown");

      expect(result).toBe("Player not found");
    });
  });

  describe("placeWinnerBet", () => {
    it("should return error if game has not started", () => {
      const result = gameController.placeWinnerBet("Player1", Colors.Red);

      expect(result).toBe("Game not started");
    });

    it("should place a winner bet correctly", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.placeWinnerBet("Player1", Colors.Red);

      expect(result).toBe("Winner bet placed");
    });

    it("should return error if player does not exist", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.placeWinnerBet("Unknown", Colors.Red);

      expect(result).toBe("Player not found");
    });
  });

  describe("placeLoserBet", () => {
    it("should return error if game has not started", () => {
      const result = gameController.placeLoserBet("Player1", Colors.Red);

      expect(result).toBe("Game not started");
    });

    it("should place a loser bet correctly", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.placeLoserBet("Player1", Colors.Blue);

      expect(result).toBe("Loser bet placed");
    });

    it("should return error if player does not exist", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.placeLoserBet("Unknown", Colors.Blue);

      expect(result).toBe("Player not found");
    });
  });

  describe("takeRoundBet", () => {
    it("should return error if game has not started", () => {
      const result = gameController.takeRoundBet("Player1", Colors.Green);

      expect(result).toBe("Game not started");
    });

    it("should place a round bet correctly", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.takeRoundBet("Player1", Colors.Yellow);

      expect(result).toBe("Round bet placed");
    });

    it("should reject the action if it is not the player's turn", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.takeRoundBet("Player2", Colors.Yellow);

      expect(result).toBe("It is not your turn");
    });

    it("should return error if player does not exist", () => {
      gameController.startGame(players, "testgameId");

      const result = gameController.takeRoundBet("Unknown", Colors.Yellow);

      expect(result).toBe("Player not found");
    });
  });
});
