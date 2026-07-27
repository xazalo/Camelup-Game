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
    { name: "Player1", isAI: false, socketId: "12344" },
    { name: "Player2", isAI: false, socketId: "12344" },
  ];

  describe("startGame", () => {
    it("should start a game correctly", async () => {
      const result = await gameController.startGame(players, "testgameId");

      expect(result).include("Game Created");
    });

    it("should return an error if player amount is invalid", async () => {
      const result = await gameController.startGame(
        [{ name: "Player1", isAI: false, socketId: "1234" }],
        "testgameId",
      );

      expect(result).include("This Game must have between 2 and 6 players");
    });

    it("should return an error if there are too many players", async () => {
      const result = await gameController.startGame(
        [
          { name: "Player1", isAI: false, socketId: "1234" },
          { name: "Player2", isAI: false, socketId: "1234" },
          { name: "Player3", isAI: false, socketId: "1234" },
          { name: "Player4", isAI: false, socketId: "1234" },
          { name: "Player5", isAI: false, socketId: "1234" },
          { name: "Player6", isAI: false, socketId: "1234" },
          { name: "Player7", isAI: false, socketId: "1234" },
        ],
        "testgameId",
      );

      expect(result).include("This Game must have between 2 and 6 players");
    });

    it("should expose the created game state", async () => {
      await gameController.startGame(players, "testgameId");

      const state = gameController.getState();
      expect(state).toBeDefined();
    });
  });

  describe("getState", () => {
    it("should return null if game has not started", async () => {
      const state = gameController.getState();

      expect(state.game).toBe(null);
    });

    it("should return the current game instance after starting", async () => {
      await gameController.startGame(players, "testgameId");

      const state = gameController.getState();

      expect(state).toBeDefined();
    });
  });

  describe("placeTile", () => {
    it("should place a tile", async () => {
      gameController.startGame(players, "testgameId");
      const r = await gameController.placeTile("Player1", 1, 1);
      const state = gameController.getState();

      const tileType = state?.game.board.spaces[1]?.tile.returnTileType();
      const hasTile = state?.game.board.spaces[1]?.tile.hasTile();

      expect(r).include("Tile placed");
      expect(tileType).toBe(1);
      expect(hasTile).toBe(true);
    });

    it("should throw error if the player already have a tile placed", async () => {
      await gameController.startGame(players, "testgameId");
      await gameController.placeTile("Player1", 1, 1);
      await gameController.placeTile("Player2", 2, 1);
      const result = await gameController.placeTile("Player1", 4, 1);
      expect(result).include("Tile already placed");
    });
  });

  describe("rollTheDice", () => {
    it("should return error if game has not started", async () => {
      const result = await gameController.rollTheDice("enzo");

      expect(result).include("Game not started");
    });

    it("should call the game roll action for a valid player", async () => {
      await gameController.startGame(players, "testgameId");

      const r = await gameController.rollTheDice("Player1");

      expect(r).include("Dice rolled successfully");
    });

    it("should return an error when the player action is rejected", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.rollTheDice("Unknown");

      expect(result).include("Player not found");
    });
  });

  describe("placeWinnerBet", () => {
    it("should return error if game has not started", async () => {
      const result = await gameController.placeWinnerBet("Player1", Colors.Red);

      expect(result).include("Game not started");
    });

    it("should place a winner bet correctly", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.placeWinnerBet("Player1", Colors.Red);
      
      expect(result).include("placed");
    });

    it("should return error if player does not exist", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.placeWinnerBet("Unknown", Colors.Red);

      expect(result).include("Player not found");
    });
  });

  describe("placeLoserBet", () => {
    it("should return error if game has not started", async () => {
      const result = await gameController.placeLoserBet("Player1", Colors.Red);

      expect(result).includes("Game not started");
    });

    it("should place a loser bet correctly", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.placeLoserBet("Player1", Colors.Blue);

      expect(result).include("placed");
    });

    it("should return error if player does not exist", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.placeLoserBet("Unknown", Colors.Blue);

      expect(result).include("Player not found");
    });
  });

  describe("takeRoundBet", () => {
    it("should return error if game has not started", async () => {
      const result = await gameController.takeRoundBet("Player1", Colors.Green);

      expect(result).include("Game not started");
    });

    it("should place a round bet correctly", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.takeRoundBet("Player1", Colors.Yellow);

      expect(result).include("Round bet");
    });

    it("should reject the action if it is not the player's turn", async () => {
      await gameController.startGame(players, "testgameId");

      const result = await gameController.takeRoundBet("Player2", Colors.Yellow);

      expect(result).include("It is not your turn");
    });

    it("should return error if player does not exist", async () => {
      await gameController.startGame(players, "testgameId");
      
      const result = await gameController.takeRoundBet("Unknown", Colors.Yellow);

      expect(result).include("not found");
    });
  });
});
