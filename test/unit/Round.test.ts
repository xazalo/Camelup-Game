import { describe, it, expect, beforeEach, vi } from "vitest";
import { Round, Turn, Dice, Game } from "../../engine/models/index.js";

import { Colors } from "../../engine/enums/index.js";

describe("Round", () => {
  let round: Round;
  let game: Game;

  beforeEach(() => {
    game = Game.create(["Player1", "Player2"]);
    round = new Round();
  });

  describe("constructor", () => {
    it("should create an empty round", () => {
      expect(round.turns).toEqual([]);
      expect(round.rolledDice).toEqual([]);
      expect(round.dicePool).toBeDefined();
    });
  });

  describe("addTurn", () => {
    it("should store a turn", () => {
      const turn = new Turn("Player1", { type: "RollDice" });

      round.addTurn(turn);

      expect(round.turns).toEqual([turn]);
    });

    it("should store rolled dice when the turn contains one", () => {
      const dice = new Dice(Colors.Green, 2);
      const turn = new Turn("Player1", { type: "RollDice" }, dice);

      round.addTurn(turn);

      expect(round.rolledDice).toEqual([dice]);
    });

    it("should not store rolled dice when the turn has no dice", () => {
      const dice = new Dice(Colors.Green, 2);
      const turn = new Turn("Player1", { type: "Bet", cardId: "none" }, dice);

      round.addTurn(turn);

      expect(round.turns).toEqual([turn]);
      expect(round.rolledDice).toHaveLength(1); //Exists the setup at the history
    });
  });

  describe("isFinished", () => {
    it("should return false before five dice have been rolled", () => {
      for (let i = 0; i < 4; i++) {
        round.addTurn(
          new Turn("Player", { type: "RollDice" }, new Dice(Colors.Green, 1)),
        );
      }

      expect(round.isFinished()).toBe(false);
    });

    it("should return true after five dice have been rolled", () => {
      for (let i = 0; i < 5; i++) {
        round.addTurn(
          new Turn("Player", { type: "RollDice" }, new Dice(Colors.Green, 1)),
        );
      }

      expect(round.isFinished()).toBe(true);
    });
  });

  describe("prepareInitialMoves", () => {
    it("should perform four initial moves", () => {
      const moveCamelSpy = vi.spyOn(game.board, "moveCamel");
      round.prepareInitialMoves(game.board);
      expect(moveCamelSpy).toHaveBeenCalledTimes(4);
    });
  });
});
