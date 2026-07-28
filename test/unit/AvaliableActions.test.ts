import { describe, expect, it, beforeEach } from "vitest";
import { AvailableActions } from "../../engine/models/index.js";
import Colors from "../../engine/enums/Colors.js";

describe("AvailableActions", () => {
  let actions: AvailableActions;

  beforeEach(() => {
    actions = new AvailableActions();
  });

  it("should initialize all actions as available", () => {
    expect(actions.rollDice).toBe(true);

    expect(actions.winnerBet).toEqual({
      blue: true,
      green: true,
      red: true,
      yellow: true,
    });

    expect(actions.loserBet).toEqual({
      blue: true,
      green: true,
      red: true,
      yellow: true,
    });

    expect(actions.placeTile).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
    ]);
  });

  it("should disable roll dice", () => {
    actions.switchRollDice();

    expect(actions.rollDice).toBe(false);
  });

  it("should disable a winner bet", () => {
    actions.switchWinnerBet("green" as Colors);

    expect(actions.winnerBet.green).toBe(false);

    expect(actions.winnerBet.blue).toBe(true);
    expect(actions.winnerBet.red).toBe(true);
    expect(actions.winnerBet.yellow).toBe(true);
  });

  it("should disable a loser bet", () => {
    actions.switchLoserBet("red" as Colors);

    expect(actions.loserBet.red).toBe(false);

    expect(actions.loserBet.blue).toBe(true);
    expect(actions.loserBet.green).toBe(true);
    expect(actions.loserBet.yellow).toBe(true);
  });

  it("should disable the selected tile position", () => {
    actions.switchPlaceTile(5);

    expect(actions.placeTile[5]).toBe(false);
  });

  it("should disable the selected tile position and adjacent positions", () => {
    actions.switchPlaceTile(5);

    expect(actions.placeTile[4]).toBe(false);
    expect(actions.placeTile[5]).toBe(false);
    expect(actions.placeTile[6]).toBe(false);

    expect(actions.placeTile[3]).toBe(true);
    expect(actions.placeTile[7]).toBe(true);
  });

  it("should reset all actions", () => {
    actions.switchRollDice();
    actions.switchWinnerBet("green" as Colors);
    actions.switchLoserBet("red" as Colors);
    actions.switchPlaceTile(5);

    actions.reset();

    expect(actions.rollDice).toBe(true);

    expect(actions.winnerBet).toEqual({
      blue: true,
      green: true,
      red: true,
      yellow: true,
    });

    expect(actions.loserBet).toEqual({
      blue: true,
      green: true,
      red: true,
      yellow: true,
    });

    expect(actions.placeTile).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
    ]);
  });
});
