import { Colors } from "../../engine/enums/index.js";
import {
  Game,
  Board,
  Player,
  CardStorage,
  Round,
  DicePool,
  Dice,
  Turn,
  Camel,
} from "../../engine/models/index.js";
import { type DiceValue, type Action } from "../../engine/types/index.js";
import { randomNumber } from "../helpers/index.js";

export default class GameController {
  game: Game | null = null;

  startGame(playerNames: string[]) {
    const board = new Board(16);
    const cardStorage = new CardStorage();

    const players = playerNames.map((name) => new Player(name));

    if (players.length < 2 || players.length > 6) {
      return "This Game must have between 2 and 6 players";
    } else {
      const round = new Round();
      this.game = new Game(board, players, [round], cardStorage);
      this.createCamels(this.game);
      this.setupInitialDice(round);
      return "Game started";
    }
  }

  createCamels(game: Game) {
    const camelGreen = new Camel(Colors.Green);
    const camelBlue = new Camel(Colors.Blue);
    const camelRed = new Camel(Colors.Red);
    const camelYellow = new Camel(Colors.Yellow);
    const camelWhite = new Camel(Colors.White);
    const camelBlack = new Camel(Colors.Black);

    game.board.spaces[0]?.addCamel(camelGreen);
    game.board.spaces[0]?.addCamel(camelBlue);
    game.board.spaces[0]?.addCamel(camelRed);
    game.board.spaces[0]?.addCamel(camelYellow);
    game.board.spaces[0]?.addCamel(camelWhite);
    game.board.spaces[0]?.addCamel(camelBlack);
  }

  setupInitialDice(round: Round) {
    if (!this.game) {
      throw new Error("Game not started");
    }

    const pool = new DicePool();

    for (let i = 0; i < 4; i++) {
      const color = pool.draw();
      const value = (randomNumber(3) + 1) as DiceValue;

      const dice = new Dice(color, value);

      const turn = new Turn("", { type: "RollDice" }, dice);

      round.addTurn(turn);

      this.game.board.moveCamel(color, value);
    }
  }

  getState() {
    return this.game;
  }
}
