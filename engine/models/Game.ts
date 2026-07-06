import { Board, Player, Round, CardStorage } from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";
import { GamePhase } from "../enums/index.js";

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
