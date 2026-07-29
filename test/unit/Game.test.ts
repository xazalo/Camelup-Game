import { describe, it, expect, beforeEach } from "vitest";
import Game from "../../engine/models/Game.js";
import Colors from "../../engine/enums/Colors.js";
import Card from "../../engine/models/Card.js";
import BetType from "../../engine/enums/BetType.js";
import { generatePayoutTable } from "../../helpers/index.js";
import GamePhase from "../../engine/enums/GamePhase.js";

describe("Game", () => {
  let game: Game;

  const players = [
    { name: "Player1", isAI: false, socketId: "" },
    { name: "Player2", isAI: false, socketId: "" },
  ];

  beforeEach(() => {
    game = Game.create(players, "testgameId") as Game;
  });

  describe("create", () => {
    it("should create a game with valid players", () => {
      expect(game).toBeInstanceOf(Game);
      expect(game.players.length).toBe(2);
    });

    it("should reject games with less than 2 players", () => {
      expect(
        Game.create(
          [{ name: "Player1", isAI: false, socketId: "" }],
          "testgameId",
        ),
      ).include("This Game must have between 2 and 6 players");
    });

    it("should reject games with more than 6 players", () => {
      expect(
        Game.create(
          [
            { name: "Player1", isAI: false, socketId: "" },
            { name: "Player2", isAI: false, socketId: "" },
            { name: "Player3", isAI: false, socketId: "" },
            { name: "Player4", isAI: false, socketId: "" },
            { name: "Player5", isAI: false, socketId: "" },
            { name: "Player6", isAI: false, socketId: "" },
            { name: "Player7", isAI: false, socketId: "" },
          ],
          "testgameId",
        ),
      ).include("This Game must have between 2 and 6 players");
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
      expect(game.rollDice("Player1")).include("Dice rolled");
    });

    it("should reject unknown player", () => {
      expect(game.rollDice("Unknown")).include("Player not found");
    });

    it("should reject player without turn", () => {
      expect(game.rollDice("Player2")).include("It is not this player's turn");
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
      const invalidCamels = game.board.spaces
        .slice(4, 13)
        .flatMap((space) => space.camels);

      expect(invalidCamels.length).toBe(0);
    });
  });

  describe("placeWinnerBet", () => {
    it("should place a winner bet", () => {
      const camel = game.board.findCamelByColor(Colors.Yellow);

      if (typeof camel === "string") {
        expect(camel).toBe("");
        return;
      }

      game.placeWinnerBet("Player1", camel);
      expect(game.cardStorage.hasWinnerCardPlaced("Player1", "yellow")).toBe(
        true,
      );
    });

    it("should reject unknown player", () => {
      const camel = game.board.findCamelByColor(Colors.Yellow);

      if (typeof camel === "string") {
        expect(camel).toBe("");
        return;
      }

      expect(game.placeWinnerBet("Unknown", camel)).include("Player not found");
    });
  });

  describe("placeLoserBet", () => {
    it("should place a loser bet", () => {
      const camel = game.board.findCamelByColor(Colors.Blue);

      if (typeof camel === "string") {
        expect(camel).toBe("");
        return;
      }

      game.placeLoserBet("Player1", camel);

      expect(game.cardStorage.hasLoserCardPlaced("Player1", "blue")).toBe(true);
    });

    it("should reject unknown player", () => {
      const camel = game.board.findCamelByColor(Colors.Blue);

      if (typeof camel === "string") {
        expect(camel).toBe("");
        return;
      }

      expect(game.placeLoserBet("Unknown", camel)).include("Player not found");
    });
  });

  describe("round management", () => {
    it("should have an initial round", () => {
      expect(game.history.length).toBe(1);
    });
  });

  describe("round management", () => {
    it("should have an initial round", () => {
      expect(game.history.length).toBe(1);
    });
  });

  describe("round incomes", () => {
    it("should pay 5 coins for a first place card", () => {
      const player = game.players[0]!;

      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      game.board.spaces.forEach((space) => (space.camels = []));
      game.board.spaces[15]!.addCamel(green);

      player.addCard(
        new Card(BetType.TurnWinner, green, generatePayoutTable(5)),
      );

      game.endRound();

      expect(player.money).toBe(8);
    });

    it("should pay 1 coins for a second place card", () => {
      const player = game.players[0]!;

      const green = game.board.findCamelByColor(Colors.Green);
      const blue = game.board.findCamelByColor(Colors.Blue);

      if (typeof green === "string" || typeof blue === "string") {
        expect(green).toBe("");
        expect(blue).toBe("");
        return;
      }

      game.board.spaces.forEach((space) => (space.camels = []));

      game.board.spaces[15]!.addCamel(blue);
      game.board.spaces[14]!.addCamel(green);

      player.addCard(
        new Card(BetType.TurnWinner, green, generatePayoutTable(5)),
      );

      game.endRound();

      expect(player.money).toBe(4);
    });

    it("should lose one coin when the camel finishes fourth", () => {
      const player = game.players[0]!;

      const green = game.board.findCamelByColor(Colors.Green);
      const blue = game.board.findCamelByColor(Colors.Blue);
      const red = game.board.findCamelByColor(Colors.Red);
      const yellow = game.board.findCamelByColor(Colors.Yellow);

      if (
        typeof green === "string" ||
        typeof blue === "string" ||
        typeof red === "string" ||
        typeof yellow === "string"
      ) {
        expect(green).toBe("");
        expect(blue).toBe("");
        expect(red).toBe("");
        expect(yellow).toBe("");
        return;
      }

      game.board.spaces.forEach((space) => (space.camels = []));

      game.board.spaces[15]!.addCamel(blue);
      game.board.spaces[14]!.addCamel(red);
      game.board.spaces[13]!.addCamel(yellow);
      game.board.spaces[12]!.addCamel(green);

      player.addCard(
        new Card(BetType.TurnWinner, green, generatePayoutTable(5)),
      );

      game.endRound();

      expect(player.money).toBe(2);
    });
  });

  describe("Game Incomes", () => {
    it("should pay 8 coins to the first correct winner bet", () => {
      const player = game.players[0]!;

      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      game.placeWinnerBet(player.name, green);

      game.board.spaces.forEach((space) => (space.camels = []));
      game.board.spaces[15]!.addCamel(green);

      game.endGame();

      expect(player.money).toBe(11);
    });

    it("should pay 5 coins to the second correct winner bet", () => {
      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      game.placeWinnerBet("Player1", green);
      game.placeWinnerBet("Player2", green);

      game.board.spaces.forEach((space) => (space.camels = []));
      game.board.spaces[15]!.addCamel(green);

      game.endGame();

      expect(game.players[0]!.money).toBe(11);
      expect(game.players[1]!.money).toBe(8);
    });

    it("should lose one coin for an incorrect winner bet", () => {
      const green = game.board.findCamelByColor(Colors.Green);
      const blue = game.board.findCamelByColor(Colors.Blue);

      if (typeof green === "string" || typeof blue === "string") {
        expect(green).toBe("");
        expect(blue).toBe("");
        return;
      }

      game.placeWinnerBet("Player1", blue);

      game.board.spaces.forEach((space) => (space.camels = []));
      game.board.spaces[15]!.addCamel(green);

      game.endGame();

      expect(game.players[0]!.money).toBe(2);
    });

    it("should pay 8 coins for the first correct loser bet", () => {
      const green = game.board.findCamelByColor(Colors.Green);
      const blue = game.board.findCamelByColor(Colors.Blue);

      if (typeof green === "string" || typeof blue === "string") {
        expect(green).toBe("");
        expect(blue).toBe("");
        return;
      }

      game.placeLoserBet("Player1", blue);

      game.board.spaces.forEach((space) => (space.camels = []));

      game.board.spaces[15]!.addCamel(green);
      game.board.spaces[0]!.addCamel(blue);

      game.endGame();

      expect(game.players[0]!.money).toBe(11);
    });

    it("should lose one coin for an incorrect loser bet", () => {
      const green = game.board.findCamelByColor(Colors.Green);
      const blue = game.board.findCamelByColor(Colors.Blue);

      if (typeof green === "string" || typeof blue === "string") {
        expect(green).toBe("");
        expect(blue).toBe("");
        return;
      }

      game.placeLoserBet("Player1", green);

      game.board.spaces.forEach((space) => (space.camels = []));

      game.board.spaces[15]!.addCamel(green);
      game.board.spaces[0]!.addCamel(blue);

      game.endGame();

      expect(game.players[0]!.money).toBe(2);
    });
  });

  describe("Ensure game only can be played when is active", () => {
    beforeEach(() => {
      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      game.board.spaces.forEach((space) => (space.camels = []));
      game.board.spaces[15]!.addCamel(green);

      game.endGame();
    });

    it("should change phase to Finished after ending the game", () => {
      expect(game.phase).toBe(GamePhase.Finished);
    });

    it("should not allow rolling dice after game finishes", () => {
      expect(game.rollDice("Player1")).include("Game has already finished");
    });

    it("should not allow winner bets after game finishes", () => {
      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      expect(game.placeWinnerBet("Player1", green)).include(
        "Game has already finished",
      );
    });

    it("should not allow loser bets after game finishes", () => {
      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      expect(game.placeLoserBet("Player1", green)).include(
        "Game has already finished",
      );
    });

    it("should not allow round bets after game finishes", () => {
      const green = game.board.findCamelByColor(Colors.Green);

      if (typeof green === "string") {
        expect(green).toBe("");
        return;
      }

      expect(game.takeRoundBet("Player1", green)).include(
        "Game has already finished",
      );
    });
  });
});
