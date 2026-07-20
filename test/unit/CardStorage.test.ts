import { describe, expect, it, beforeEach } from "vitest";
import { CardStorage, Game, Stack } from "../../engine/models/index.js";
import Colors from "../../engine/enums/Colors.js";

describe("CardStorage", () => {
  let storage: CardStorage;

  beforeEach(() => {
    storage = new CardStorage();
  });

  it("should initialize all cards with 5 remaining", () => {
    expect(storage.numberRemainingCards("yellow")).toBe(5);
    expect(storage.numberRemainingCards("green")).toBe(5);
    expect(storage.numberRemainingCards("blue")).toBe(5);
    expect(storage.numberRemainingCards("red")).toBe(5);
  });

  it("should reduce remaining cards when a card is grabbed", () => {
    storage.grabCard("yellow");

    expect(storage.numberRemainingCards("yellow")).toBe(4);
  });

  it("should allow grabbing cards while there are remaining cards", () => {
    expect(storage.shouldGrabCard("yellow")).toBe(true);

    for (let i = 0; i < 5; i++) {
      storage.grabCard("yellow");
    }

    expect(storage.numberRemainingCards("yellow")).toBe(0);
    expect(storage.shouldGrabCard("yellow")).toBe(false);
  });

  it("should add a winner bet", () => {
    storage.addWinner("Player1", "yellow");

    expect(storage.hasWinnerCardPlaced("Player1", "yellow")).toBe(true);
  });

  it("should add a loser bet", () => {
    storage.addLoser("Player1", "blue");

    expect(storage.hasLoserCardPlaced("Player1", "blue")).toBe(true);
  });

  it("should return false when player has no winner card placed", () => {
    expect(storage.hasWinnerCardPlaced("Player1", "yellow")).toBe(false);
  });

  it("should return false when player has no loser card placed", () => {
    expect(storage.hasLoserCardPlaced("Player1", "red")).toBe(false);
  });

  it("should reset stored cards to initial amount", () => {
    storage.grabCard("green");
    storage.grabCard("green");
    storage.grabCard("green");

    expect(storage.numberRemainingCards("green")).toBe(2);

    storage.resetStoredCards();

    expect(storage.numberRemainingCards("green")).toBe(5);
  });

  it("should keep winner and loser bets after resetting stored cards", () => {
    storage.addWinner("Player1", "red");
    storage.addLoser("Player2", "blue");

    storage.resetStoredCards();

    expect(storage.hasWinnerCardPlaced("Player1", "red")).toBe(true);
    expect(storage.hasLoserCardPlaced("Player2", "blue")).toBe(true);
  });

  describe("getWinnerCards", () => {
    it("should return all winner bets", () => {
      storage.addWinner("Player1", "yellow");
      storage.addWinner("Player2", "red");

      const winners = storage.getWinnerCards();

      expect(winners.yellow).toEqual([
        { player: "Player1", order: 0 },
      ]);

      expect(winners.red).toEqual([
        { player: "Player2", order: 1 },
      ]);

      expect(winners.green).toEqual([]);
      expect(winners.blue).toEqual([]);
    });

    it("should preserve the betting order", () => {
      storage.addWinner("Player1", "yellow");
      storage.addWinner("Player2", "yellow");
      storage.addWinner("Player3", "yellow");

      expect(storage.getWinnerCards().yellow).toEqual([
        { player: "Player1", order: 0 },
        { player: "Player2", order: 1 },
        { player: "Player3", order: 2 },
      ]);
    });
  });

  describe("getLoserCards", () => {
    it("should return all loser bets", () => {
      storage.addLoser("Player1", "green");
      storage.addLoser("Player2", "blue");

      const losers = storage.getLoserCards();

      expect(losers.green).toEqual([
        { player: "Player1", order: 0 },
      ]);

      expect(losers.blue).toEqual([
        { player: "Player2", order: 1 },
      ]);

      expect(losers.yellow).toEqual([]);
      expect(losers.red).toEqual([]);
    });

    it("should preserve the betting order", () => {
      storage.addLoser("Player1", "red");
      storage.addLoser("Player2", "red");
      storage.addLoser("Player3", "red");

      expect(storage.getLoserCards().red).toEqual([
        { player: "Player1", order: 0 },
        { player: "Player2", order: 1 },
        { player: "Player3", order: 2 },
      ]);
    });

    it("should pay 8, 5, 3 and 2 coins for multiple correct winner bets", () => {
      const game = Game.create(
        [
          "Player1",
          "Player2",
          "Player3",
          "Player4",
          "Player5",
        ],
        "testgameId",
      );

      const green = game.board.findCamelByColor(Colors.Green);

      game.placeWinnerBet("Player1", green);
      game.placeWinnerBet("Player2", green);
      game.placeWinnerBet("Player3", green);
      game.placeWinnerBet("Player4", green);
      game.placeWinnerBet("Player5", green);

      const initialMoney = game.players.map((p) => p.money);

      game.board.spaces.forEach((space: Stack) => {
        space.camels = [];
      });

      game.board.spaces[15]!.addCamel(green);

      game.endGame();

      expect(game.players[0]!.money - initialMoney[0]!).toBe(8);
      expect(game.players[1]!.money - initialMoney[1]!).toBe(5);
      expect(game.players[2]!.money - initialMoney[2]!).toBe(3);
      expect(game.players[3]!.money - initialMoney[3]!).toBe(2);
      expect(game.players[4]!.money - initialMoney[4]!).toBe(2);
    });
  });
});