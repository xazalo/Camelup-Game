import type { PlayerState } from "./PlayerState.js";
import type { Board, Round } from "../models/index.js";
import GamePhase from "../enums/GamePhase.js";
import type { Probabilities } from "../models/Probabilities.js";

export type GameState = {
  id: string;

  board: Board;
  players: PlayerState[];

  currentTurn: number;
  currentPlayer: number;
  phase: GamePhase;

  history: Round[];

  probabilities: Probabilities;
};
