import { describe, it, expect, beforeEach } from "vitest";
import GameController from "../../cli/controllers/GameController.js";

describe("GameController", () => {
  let gameController: GameController;

  beforeEach(() => {
    gameController = new GameController();
  });


  describe("startGame", () => {

    it("should start a game correctly", () => {
      const result = gameController.startGame([
        "enzo",
        "pizza",
      ]);

      expect(result).toBe("Game started");
    });


    it("should return an error if player amount is invalid", () => {
      const result = gameController.startGame([
        "enzo",
      ]);

      expect(result).toBe(
        "This Game must have between 2 and 6 players"
      );
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

      expect(result).toBe(
        "This Game must have between 2 and 6 players"
      );
    });


    it("should expose the created game state", () => {
      gameController.startGame([
        "enzo",
        "pizza",
      ]);

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
      gameController.startGame([
        "enzo",
        "pizza",
      ]);

      const state = gameController.getState();

      expect(state).toBeDefined();
    });

  });


  describe("rollTheDice", () => {

    it("should return error if game has not started", () => {
      const result = gameController.rollTheDice(
        "enzo"
      );

      expect(result).toBe(
        "Game not started"
      );
    });


    it("should call the game roll action for a valid player", () => {
      gameController.startGame([
        "Player1",
        "Player2",
      ]);

      const result =
        gameController.rollTheDice(
          "Player1"
        );

      expect(result).toBe(
        "Dice rolled successfully"
      );
    });


    it("should return an error when the player action is rejected", () => {
      gameController.startGame([
        "Player1",
        "Player2",
      ]);

      const result =
        gameController.rollTheDice(
          "Unknown"
        );

      expect(result).toBe(
        "Player not found"
      );
    });

  });

});