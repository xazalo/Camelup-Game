import { Board, Player, type Turn, CardStorage } from "./index.js";
import createRandomId from "../../cli/helpers/createRandomId.js";

enum GamePhase {
  Setup,
  RollingDice,
  Betting,
  MovingCamels,
  RoundEnd,
  Finished,
}

export default class Game {
  id: string;

  board: Board;
  players: Player[];

  currentTurn: number;
  currentPlayer: number;
  phase: GamePhase;

  cardStorage: CardStorage;

  history: Turn[];

  constructor(board: Board, players: Player[], history: Turn[], cardStorage: CardStorage) {
    ((this.id = createRandomId()), (this.currentPlayer = 1));
    this.currentTurn = 1;

    ((this.board = board),
      (this.players = players),
      (this.phase = GamePhase.Setup),
      (this.history = history));

      this.cardStorage = cardStorage
  }

  updateTurn() {
    if (this.currentPlayer < 4) {
      this.currentPlayer = this.currentPlayer + 1;
    } else {
      this.currentPlayer = 1;
      this.currentTurn = this.currentTurn + 1;
    }
  }
}
