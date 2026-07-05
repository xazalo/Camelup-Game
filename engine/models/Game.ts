import {Board, Player, type Turn} from "./index.js"

enum GamePhase {
    Setup,
    RollingDice,
    Betting,
    MovingCamels,
    RoundEnd,
    Finished
}

export default class Game {
  id: string;

  board: Board;
  players: Player[];

  currentTurn: number;
  currentPlayer: number;
  phase: GamePhase;

  history: Turn[];

  constructor(board: Board, players: Player[], history: Turn[]) {
    
    this.id = 'abg',
    this.currentPlayer = 1;
    this.currentTurn = 1;
    
    this.board = board,
    this.players = players,
    this.phase = GamePhase.Setup,
    this.history = history
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
