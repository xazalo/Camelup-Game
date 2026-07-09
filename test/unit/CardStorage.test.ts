import { describe, expect, it, beforeEach } from "vitest";
import { CardStorage } from "../../engine/models/index.js";

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

    expect(storage.hasWinnerCardPlaced("Player1", "yellow"))
      .toBe(true);
  });


  it("should add a loser bet", () => {
    storage.addLoser("Player1", "blue");

    expect(storage.hasLoserCardPlaced("Player1", "blue"))
      .toBe(true);
  });


  it("should return false when player has no winner card placed", () => {
    expect(storage.hasWinnerCardPlaced("Player1", "yellow"))
      .toBe(false);
  });


  it("should return false when player has no loser card placed", () => {
    expect(storage.hasLoserCardPlaced("Player1", "red"))
      .toBe(false);
  });


  it("should reset stored cards to initial amount", () => {
    storage.grabCard("green");
    storage.grabCard("green");
    storage.grabCard("green");

    expect(storage.numberRemainingCards("green"))
      .toBe(2);

    storage.resetStoredCards();

    expect(storage.numberRemainingCards("green"))
      .toBe(5);
  });


  it("should keep winner and loser bets after resetting stored cards", () => {
    storage.addWinner("Player1", "red");
    storage.addLoser("Player2", "blue");

    storage.resetStoredCards();

    expect(storage.hasWinnerCardPlaced("Player1", "red"))
      .toBe(true);

    expect(storage.hasLoserCardPlaced("Player2", "blue"))
      .toBe(true);
  });
});