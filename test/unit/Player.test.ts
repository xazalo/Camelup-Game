import { describe, it, expect, beforeEach } from "vitest";
import { Player, Card, Camel } from "../../engine/models/index.js";
import { BetType, Colors } from "../../engine/enums/index.js";

describe("Player", () => {
  let player: Player;

  beforeEach(() => {
    player = new Player("John");
  });

  it("should update money", () => {
    player.updateMoney(10);
    expect(player.money).toBe(13);

    player.updateMoney(-14);
    expect(player.money).toBe(-1);
  });

  it("should update the placed tile state", () => {
    player.placeTile();
    expect(player.placedTile).toBe(true);
  });

  it("should remove the placed tile state", () => {
    player.removePlacedTile();
    expect(player.placedTile).toBe(false);
  });

  it("should return the current status uf the placedTile", () => {
    expect(player.hasPlacedTile()).toBe(false);
  });

  it("should add card", () => {
    const camel = new Camel(Colors.Yellow);

    const card = new Card(BetType.GameWinner, camel, {
      1: 5,
      2: 3,
      3: 1,
      4: -1,
      5: -1,
    });

    player.addCard(card);

    expect(player.cards).toContain(card);
  });
});
