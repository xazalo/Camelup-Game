import { describe, it, expect } from "vitest";
import GameController from "../../cli/controllers/GameController.js";
import { Colors } from "../../engine/enums/index.js";

const gameController = new GameController();

describe("GameController", () => {
  it("should return Game Started if the game has been started", () => {
    const game = gameController.startGame(["enzo", "pizza"]);
    expect(game).toBe("Game started");
  });

  it("should return the state if the game was previously created", () => {
    const game = gameController.startGame(["enzo", "John Doe"]);
    expect(game).toBe("Game started");

    const state = gameController.getState();
    expect(state).exist;
  });

  it("state has the correct fields", () => {
    const game = gameController.startGame(["enzo", "John Doe"]);
    expect(game).toBe("Game started");

    const state = gameController.getState();
    expect(state?.board.spaces.length).toBe(16);
    for (const space of state!.board.spaces) {
      expect(space.tile.owner).toBeNull();
      expect(space.tile.tileType).toBe(0);
    }

    expect(state?.cardStorage.loserCards.blue.length).toBe(0);
    expect(state?.cardStorage.loserCards.green.length).toBe(0);
    expect(state?.cardStorage.loserCards.red.length).toBe(0);
    expect(state?.cardStorage.loserCards.yellow.length).toBe(0);

    expect(state?.cardStorage.winnerCards.blue.length).toBe(0);
    expect(state?.cardStorage.winnerCards.green.length).toBe(0);
    expect(state?.cardStorage.winnerCards.red.length).toBe(0);
    expect(state?.cardStorage.winnerCards.yellow.length).toBe(0);

    expect(state?.cardStorage.storedCards.blue.remaining).toBe(5);
    expect(state?.cardStorage.storedCards.green.remaining).toBe(5);
    expect(state?.cardStorage.storedCards.red.remaining).toBe(5);
    expect(state?.cardStorage.storedCards.yellow.remaining).toBe(5);

    expect(state?.currentPlayer).toBe(1);
    expect(state?.currentTurn).toBe(1);

    expect(state?.history.length).toBe(1);
    expect(state?.phase).toBe(0);
    expect(typeof state?.id).toBe("string");
    expect(state?.id.length).toBe(34);

    expect(state?.players.length).toBe(2);

    expect(state?.players).toMatchObject([
      {
        name: "enzo",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "John Doe",
        money: 3,
        cards: [],
        tiles: [],
      },
    ]);

    const camelsStack = state!.board!.spaces[0]!.camels;

    for (const camel of camelsStack) {
      expect([
        Colors.Green,
        Colors.Blue,
        Colors.Red,
        Colors.Yellow,
        Colors.White,
        Colors.Black,
      ]).toContain(camel.color);
    }
  });

  it("should create a game properly with 3 players", () => {
    const game = gameController.startGame(["Ferananda", "Ilia", "Aleksander"]);
    const state = gameController.getState();

    expect(state?.players).toMatchObject([
      {
        name: "Ferananda",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Ilia",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Aleksander",
        money: 3,
        cards: [],
        tiles: [],
      },
    ]);
  });

  it("should create a game properly with 4 players", () => {
    const game = gameController.startGame([
      "Player1",
      "Player2",
      "Player3",
      "Player4",
    ]);
    const state = gameController.getState();

    expect(state?.players).toMatchObject([
      {
        name: "Player1",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player2",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player3",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player4",
        money: 3,
        cards: [],
        tiles: [],
      },
    ]);
  });

  it("should create a game properly with 5 players", () => {
    const game = gameController.startGame([
      "Player1",
      "Player2",
      "Player3",
      "Player4",
      "Player5",
    ]);
    const state = gameController.getState();

    expect(state?.players).toMatchObject([
      {
        name: "Player1",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player2",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player3",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player4",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player5",
        money: 3,
        cards: [],
        tiles: [],
      },
    ]);
  });

  it("should create a game properly with 6 players", () => {
    const game = gameController.startGame([
      "Player1",
      "Player2",
      "Player3",
      "Player4",
      "Player5",
      "Player6",
    ]);
    const state = gameController.getState();

    expect(state?.players).toMatchObject([
      {
        name: "Player1",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player2",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player3",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player4",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player5",
        money: 3,
        cards: [],
        tiles: [],
      },
      {
        name: "Player6",
        money: 3,
        cards: [],
        tiles: [],
      },
    ]);
  });

  it("should return error if players are not between 2 and 6", () => {
    const game = gameController.startGame(["enzo"]);
    expect(game).toBe("This Game must have between 2 and 6 players");
    const gameTwo = gameController.startGame([
      "enzo",
      "enzo",
      "enzo",
      "enzo",
      "enzo",
      "enzo",
      "enzo",
    ]);
    expect(gameTwo).toBe("This Game must have between 2 and 6 players");
  });
});
