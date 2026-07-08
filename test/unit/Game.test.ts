import { describe, it, expect, beforeEach } from "vitest";
import Game from "../../engine/models/Game.js";
import Colors from "../../engine/enums/Colors.js";

describe("Game", () => {
  let game: Game;

  beforeEach(() => {
    game = Game.create(["Player1", "Player2"]);
  });

  describe("create", () => {
    it("should create a game with valid players", () => {
      expect(game).toBeInstanceOf(Game);
      expect(game.players.length).toBe(2);
    });

    it("should reject games with less than 2 players", () => {
      expect(() => {
        Game.create(["Player1"]);
      }).toThrow("This Game must have between 2 and 6 players");
    });

    it("should reject games with more than 6 players", () => {
      expect(() => {
        Game.create(["1", "2", "3", "4", "5", "6", "7"]);
      }).toThrow("This Game must have between 2 and 6 players");
    });
  });

  describe("players", () => {
    it("should return player index by name", () => {
      const index = game.getPlayerIndexByName("Player2");
      const indexOne = game.getPlayerIndexByName("Player1");
      expect(index).toBe(1);
      expect(indexOne).toBe(0);
    });

    it("should return -1 if player does not exist", () => {
      const index = game.getPlayerIndexByName("Unknown");

      expect(index).toBe(-1);
    });
  });

  describe("turn management", () => {
    it("should start with the first player turn", () => {
      expect(game.currentPlayer).toBe(0);
    });

    it("should confirm when player has turn", () => {
      expect(game.playerHasTurn(0)).toBe(true);
    });

    it("should reject player without turn", () => {
      expect(game.playerHasTurn(1)).toBe(false);
    });
  });

  describe("rollDice", () => {
    it("should allow current player to roll the dice", () => {
      expect(() => {
        game.rollDice("Player1");
      }).not.toThrow();
    });

    it("should reject unknown player", () => {
      expect(() => {
        game.rollDice("Unknown");
      }).toThrow("Player not found");
    });

    it("should reject player without turn", () => {
      expect(() => {
        game.rollDice("Player2");
      }).toThrow("It is not this player's turn");
    });

    it("should increase player money after move", () => {
      const player = game.players.find((player) => player.name === "Player1");

      const moneyBefore = player!.money;

      game.rollDice("Player1");

      expect(player!.money).toBe(moneyBefore + 1);
    });

    it("should create a turn after rolling dice", () => {
      const round = game.getCurrentRound();

      const turnsBefore = round.turns.length;

      game.rollDice("Player1");

      expect(round.turns.length).toBe(turnsBefore + 1);
    });

    it("should change current player after rolling", () => {
      expect(game.currentPlayer).toBe(0);
      game.rollDice("Player1");
      expect(game.currentPlayer).toBe(1);
    });
  });

  describe("camel setup", () => {
    it("should place camels according to initial movement rules", () => {
      const startingCamels = game.board.spaces[0]?.camels;

      expect(startingCamels?.length).toBe(2);

      const invalidCamels = game.board.spaces
        .slice(4, 13)
        .flatMap((space) => space.camels);

      expect(invalidCamels.length).toBe(0);
    });
  });

  describe("round management", () => {
    it("should have an initial round", () => {
      expect(game.history.length).toBe(1);
    });
  });
});
