import { describe, expect, it } from "vitest";
import { serializeGame } from "../../helpers/serializeGame.js";
import type { Game } from "../../engine/models/index.js";

describe("serializeGame", () => {
  it("should serialize a game correctly", () => {
    const game = {
      id: "game-1",
      board: {
        tiles: [],
      },
      players: [
        {
          name: "Alice",
          money: 100,
          cards: ["card-1"],
          placedTile: "tile-1",
          availableActions: ["move"],
          isAI: false,
          secretProperty: "should-not-exist",
        },
      ],
      currentTurn: 2,
      currentPlayer: 0,
      phase: "playing",
      history: ["turn-1"],
    } as unknown as Game;

    const result = serializeGame(game);

    expect(result).toEqual({
      id: "game-1",
      board: {
        tiles: [],
      },
      players: [
        {
          name: "Alice",
          money: 100,
          cards: ["card-1"],
          placedTile: "tile-1",
          availableActions: ["move"],
          isAI: false,
        },
      ],
      currentTurn: 2,
      currentPlayer: 0,
      phase: "playing",
      history: ["turn-1"],
    });
  });

  it("should serialize multiple players", () => {
    const game = {
      id: "game-2",
      board: {},
      players: [
        {
          name: "Alice",
          money: 50,
          cards: [],
          placedTile: null,
          availableActions: [],
          isAI: false,
        },
        {
          name: "Bot",
          money: 75,
          cards: ["card-a"],
          placedTile: "tile-a",
          availableActions: ["buy"],
          isAI: true,
        },
      ],
      currentTurn: 1,
      currentPlayer: 1,
      phase: "setup",
      history: [],
    } as unknown as Game;

    const result = serializeGame(game);

    expect(result.players).toHaveLength(2);

    expect(result.players[0]).toEqual({
      name: "Alice",
      money: 50,
      cards: [],
      placedTile: null,
      availableActions: [],
      isAI: false,
    });

    expect(result.players[1]).toEqual({
      name: "Bot",
      money: 75,
      cards: ["card-a"],
      placedTile: "tile-a",
      availableActions: ["buy"],
      isAI: true,
    });
  });

  it("should not include extra player properties", () => {
    const game = {
      id: "game-3",
      board: {},
      players: [
        {
          name: "Alice",
          money: 100,
          cards: [],
          placedTile: null,
          availableActions: [],
          isAI: false,
          id: "secret-id",
          password: "secret",
          validateId: () => true,
        },
      ],
      currentTurn: 0,
      currentPlayer: 0,
      phase: "playing",
      history: [],
    } as unknown as Game;

    const result = serializeGame(game);

    expect(result.players[0]).not.toHaveProperty("id");
    expect(result.players[0]).not.toHaveProperty("password");
    expect(result.players[0]).not.toHaveProperty("validateId");
  });
});