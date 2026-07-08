import { Board, Player, Round, CardStorage, Dice, Turn, Camel } from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";
import { GamePhase, Colors } from "../enums/index.js";
import { type DiceValue } from "../types/index.js";

/**
 * This class represents an instance of the game.
 *
 * @param {id} string, A random value, contain the date for be unique
 * @param {board} Board, One array with the tiles, representing the board.
 * @param {players} Player[], One array within the players
 * @param {currentTurn} number, The turn of the Round
 * @param {currentPlayer} number, The position of the player with the current turn
 * @param {phase} GamePhase, Describes the current phase of the game
 * @param {cardStorage} CardStorage, Defines a storages within the cards
 * @param {history} Round[], An array whit the past rounds.
 */

export default class Game {
  id: string;

  board: Board;
  players: Player[];

  currentTurn: number;
  currentPlayer: number;
  phase: GamePhase;

  cardStorage: CardStorage;

  history: Round[];

  constructor(
    board: Board,
    players: Player[],
    history: Round[],
    cardStorage: CardStorage,
  ) {
    ((this.id = createRandomId()), (this.currentPlayer = 1));
    this.currentTurn = 1;

    ((this.board = board),
      (this.players = players),
      (this.phase = GamePhase.Setup),
      (this.history = history));

    this.cardStorage = cardStorage;
  }

  /**
   * This method start the game
   */
   static create(playerNames: string[]) {

        if(playerNames.length < 2 || playerNames.length > 6){
            throw new Error("Game must have between 2 and 6 players");
        }

        const board = new Board(16);
        const storage = new CardStorage();
        const players = playerNames.map(name => new Player(name));
        const round = new Round();

        const game = new Game(board, players, [round], storage);

        game.createCamels();
        game.setupInitialDice(round);

        return game;
    }

  /**
   *  This method create the first dice 
   * */
  setupInitialDice(round: Round) {
    round.prepareInitialMoves(this.board);
    this.addRound();
  }

  /**
   * This method create the camels for start the game
   */
  createCamels() {
    const camelGreen = new Camel(Colors.Green);
    const camelBlue = new Camel(Colors.Blue);
    const camelRed = new Camel(Colors.Red);
    const camelYellow = new Camel(Colors.Yellow);
    const camelWhite = new Camel(Colors.White);
    const camelBlack = new Camel(Colors.Black);

    this.board.spaces[0]?.addCamel(camelGreen);
    this.board.spaces[0]?.addCamel(camelBlue);
    this.board.spaces[0]?.addCamel(camelRed);
    this.board.spaces[0]?.addCamel(camelYellow);
    this.board.spaces[0]?.addCamel(camelWhite);
    this.board.spaces[0]?.addCamel(camelBlack);
  }

  /**
   * Adds a new round to the game history.
   */
  addRound() {
    //create the new round
    const newRound = new Round();
    this.history = [...this.history, newRound];
    this.currentTurn = 1;

    //send the first player to the last position, creating a rotation.
    const firstPlayer = this.players.shift();
    if (firstPlayer) this.players.push(firstPlayer);

    this.currentPlayer = 1;
  }

  getCurrentRound() {
    return this.history[-1];
  }

  /**
   * This is the method for roll the dice and move camels
   */
  processDiceRoll(player: Player) {
    const round = this.getCurrentRound() as Round;

    // 1. Obtain the color and value, then make the dice
    const color = round.dicePool.draw();
    const value = (Math.random() * 3 + 1) as DiceValue;
    const dice = new Dice(color, value);

    // 2. Move the camels through the board
    this.board.moveCamelStack(color, value);

    // 3. Register the turn
    round.addTurn(new Turn(player.name, { type: "RollDice" }, dice));

    // 4. End the turn
    if (round.isFinished()) {
      this.endRound(); // If round is finished create another or may end the game
    } else {
      this.nextTurn(); // If the round is not finished then create one new Turn
    }
  }

  /**
   * This method return the index of one player using his name
   */
  getPlayerIndexByName(name: string): number {
    const index = this.players.findIndex((p) => p.name === name);
    return index;
  }

  /**
   * This method ends the round or the game depends on the position of the advanced camel.
   */
  private endRound() {
    //verify if game ends
    //if not calculate round incomes
    //if yes calculate round incomes, and game incomes
    this.addRound();
    //reset the dice,
    //pass the player from first position to last one
    //TODO create the end of game just here.
  }

  /**
   * This game starts a new turn
   */
  private nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }

  playerHasTurn(index: number): boolean {
    return this.currentPlayer === index;
  }
}
