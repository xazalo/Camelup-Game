import { describe, it, expect, beforeEach } from "vitest";
import Game from "../../engine/models/Game.js";
import Colors from "../../engine/enums/Colors.js";
import Card from "../../engine/models/Card.js";
import BetType from "../../engine/enums/BetType.js";
import { generatePayoutTable } from "../../helpers/index.js";
import GamePhase from "../../engine/enums/GamePhase.js";
import { TileType } from "../../engine/enums/TileType.js";

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

  describe("placeTile", () => {
    it("should place a tile on a valid isolated position", () => {
      const result = game.placeTile("Player1", 5, TileType.Oasis);

      expect(result).include("placed successfully");
      expect(game.board.spaces[5]!.tile.hasTile()).toBe(true);
    });

    it("should block the placed position and its neighbors in every player's available actions", () => {
      game.placeTile("Player1", 5, TileType.Oasis);

      game.players.forEach((player) => {
        expect(player.availableActions.placeTile[5]).toBe(false);
        expect(player.availableActions.placeTile[4]).toBe(false);
        expect(player.availableActions.placeTile[6]).toBe(false);
      });
    });

    it("should reject a position that is not in the available actions array", () => {
      expect(game.placeTile("Player1", 15, TileType.Oasis)).include(
        "Tile position not available",
      );
    });

    it("should reject placing a tile out of board bounds", () => {
      expect(game.placeTile("Player1", 99, TileType.Oasis)).include(
        "Invalid tile position",
      );
    });

    it("should reject placing a tile on an already occupied space", () => {
      game.board.spaces[5]!.tile.place("Other", TileType.Oasis);

      expect(game.placeTile("Player1", 5, TileType.Oasis)).include(
        "already a tile",
      );
    });

    it("should reject placing a tile adjacent to an existing tile", () => {
      game.board.spaces[6]!.tile.place("Other", TileType.Oasis);

      expect(game.placeTile("Player1", 5, TileType.Oasis)).include(
        "next to an existing tile",
      );
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

  describe("available actions reset on new round", () => {
    it("should reset round bet availability each round", () => {
      const player = game.players[0]!;

      player.availableActions.roundBet.green = false;
      player.availableActions.roundBet.blue = false;

      game.endRound();

      expect(player.availableActions.roundBet.green).toBe(true);
      expect(player.availableActions.roundBet.blue).toBe(true);
    });

    it("should reset tile placement availability and placed flag each round", () => {
      const player = game.players[0]!;

      player.placedTile = true;
      player.availableActions.placeTile[3] = false;

      game.endRound();

      expect(player.placedTile).toBe(false);
      expect(player.availableActions.placeTile[3]).toBe(true);
    });

    it("should keep winner and loser bets placed across rounds", () => {
      const player = game.players[0]!;

      player.availableActions.winnerBet.green = false;
      player.availableActions.loserBet.yellow = false;

      game.endRound();

      expect(player.availableActions.winnerBet.green).toBe(false);
      expect(player.availableActions.loserBet.yellow).toBe(false);
    });

    it("should reset round bets for every player", () => {
      game.players.forEach((player) => {
        player.availableActions.roundBet.yellow = false;
      });

      game.endRound();

      game.players.forEach((player) => {
        expect(player.availableActions.roundBet.yellow).toBe(true);
      });
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

  describe("getLegalActions", () => {
    it("should include ROLL_DICE for the current player", () => {
      expect(game.getLegalActions("Player1")).toContain("ROLL_DICE");
    });

    it("should not return round bets when that color deck is exhausted", () => {
      for (let i = 0; i < 5; i++) {
        game.cardStorage.grabCard("green");
      }

      const legal = game.getLegalActions("Player1");

      expect(legal).not.toContain("TAKE_ROUND_BET_GREEN");
      expect(legal).toContain("TAKE_ROUND_BET_BLUE");
    });

    it("should not return tile actions for a position adjacent to an existing tile", () => {
      game.board.spaces[6]!.tile.place("Other", TileType.Oasis);

      const legal = game.getLegalActions("Player1");

      expect(legal).not.toContain("PLACE_OASIS_5");
      expect(legal).not.toContain("PLACE_MIRAGE_5");
      expect(legal).toContain("PLACE_OASIS_3");
    });

    it("should not return tile actions if the player already placed a tile", () => {
      game.players[0]!.placedTile = true;

      const legal = game.getLegalActions("Player1");

      expect(legal.some((a) => a.startsWith("PLACE_OASIS"))).toBe(false);
      expect(legal.some((a) => a.startsWith("PLACE_MIRAGE"))).toBe(false);
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
