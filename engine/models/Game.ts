import {
  Board,
  Player,
  Round,
  CardStorage,
  Dice,
  Turn,
  Camel,
} from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";
import { GamePhase, Colors, TileType } from "../enums/index.js";
import { type DiceValue } from "../types/index.js";

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
    this.id = createRandomId();

    this.currentPlayer = 0;
    this.currentTurn = 1;

    this.board = board;
    this.players = players;
    this.phase = GamePhase.Setup;
    this.history = history;

    this.cardStorage = cardStorage;
  }

  /**
   * Creates a new game instance.
   */
  static create(playerNames: string[]) {
    if (playerNames.length < 2 || playerNames.length > 6) {
      throw new Error("This Game must have between 2 and 6 players");
    }

    const board = new Board(16);
    const storage = new CardStorage();
    const players = playerNames.map((name) => new Player(name));
    const round = new Round();

    const game = new Game(board, players, [round], storage);

    game.board.createCamels();
    round.prepareInitialMoves(board);

    return game;
  }

  /**
   * Creates a new round and rotates player order.
   */
  addRound() {
    const newRound = new Round();

    this.history = [...this.history, newRound];
    this.currentTurn = 1;

    const firstPlayer = this.players.shift();

    if (firstPlayer) {
      this.players.push(firstPlayer);
    }

    this.currentPlayer = 0;
  }

  /**
   * Get the current round
   */
  getCurrentRound(): Round {
    return this.history[this.history.length - 1]!;
  }

  /**
   * Handles a player's dice roll action.
   */
  rollDice(playerName: string) {
    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    if (!this.playerHasTurn(playerIndex)) {
      throw new Error("It is not this player's turn");
    }

    const player = this.players[playerIndex] as Player;

    player.updateMoney(1);

    this.processDiceRoll(player as Player);
  }

  /**
   * This method place one tile
   * @param {playerName} string The name of the player who places the tile
   * @param {tileType} TileType The kind of card placed on the tile
   */
  placeTile(playerName: string, position: number, tileType: TileType) {
    if (position === 0) throw new Error("Tile cannot be placed on the first position");
    const playerIndex = this.getPlayerIndexByName(playerName);
    if (!this.playerHasTurn(playerIndex)) throw new Error("Is not your turn");
    if (this.players[playerIndex]?.hasPlacedTile()) throw new Error("Tile already placed")
    this.board.spaces[position]?.tile.place(playerName, tileType);
    this.players[playerIndex]?.placeTile();
  }

  /**
   * Rolls a dice and applies the movement to the board.
   */
  private processDiceRoll(player: Player) {
    const round = this.getCurrentRound();

    const color = round.dicePool.draw();
    const value = Math.floor(Math.random() * 3 + 1) as DiceValue;

    const dice = new Dice(color, value);

    this.board.moveCamelStack(color, value);

    round.addTurn(new Turn(player.name, { type: "RollDice" }, dice));

    if (round.isFinished()) {
      this.endRound();
    } else {
      this.nextTurn();
    }
  }

  /**
   * Returns the player index by name.
   */
  getPlayerIndexByName(name: string): number {
    return this.players.findIndex((player) => player.name === name);
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
   * Moves the turn to the next player.
   */
  private nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    this.currentTurn++;
  }

  /**
   * Return a bool witch represents if player has turn
   */
  playerHasTurn(index: number): boolean {
    return this.currentPlayer === index;
  }
}
