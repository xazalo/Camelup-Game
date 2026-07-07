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

/**
 * This class creates a controller for the game cli orders
 */

export default class GameController {
  game: Game | null = null;

  /**
   * Takes the names of the players, create a game, and define the initial position of the camels.
   * @param playerNames
   */
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

  /**
   * Create the needed camels for play de game.
   */
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

  /**
   * Set the initial position of the camels through the Board
   */
  setupInitialDice(round: Round) {
    if (!this.game) throw new Error("Game not started");
    round.prepareInitialMoves(this.game.board);
    this.game.addRound();
  }

  /**
   * Return the state of the game.
   */
  getState() {
    return this.game;
  }

  /**
   * Roll the dice and moves camels across the board
   */
  //warn this is only a schema needs ro be refactored using the methods across the project
  /*rollTheDice(playerName: string) {
    if (!this.game) return "Game not started";

    //take the player
    const index = this.game.players.findIndex((p) => p.name === playerName);
    const currentPlayer = this.game.players[index];

    //validate if the player === current player
    const validTurn = this.game.currentTurn === index;
    if (!validTurn) return "Is not your turn, please wait";

    //update money
    currentPlayer?.updateMoney(1);

    //roll the dice and push it to the dice pool
    const currentTurn = this.game.getCurrentRound();

    //generate turn
    //const newTurn = new Turn(currentPlayer?.name, {type: "RollDice"},  );

    //move camels

    //if dice pool length !== 5
    // increase the turn in game
    //end this turn and then change current player

    //if dice pool length === 5
    // reset the turn in game to 1
    //call to the function for end the round instead of turn
    //take the first player and pass it to the last position
    //this is for move the turn
  }*/
}
