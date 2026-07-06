import { Board, Player, Round, CardStorage } from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";
import { GamePhase } from "../enums/index.js";

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
}
