import { Board, Player, Round, CardStorage, Dice, Turn } from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";
import { GamePhase } from "../enums/index.js";
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
   * This method ends the round or the game depends on the position of the advanced camel.
   */
  private endRound() {
    this.addRound(); 
    //TODO create the end of game just here.
  }

  /**
   * This game starts a new turn
   */
  private nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }
}
