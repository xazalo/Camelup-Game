import type Player from "../engine/models/Player.js";
import type { GameState } from "../engine/types/index.js"
import type { Game } from "../engine/models/index.js";

export function serializeGame(game: Game): GameState {
  return {
    id: game.id,
    board: game.board,
    players: game.players.map((player: Player) => ({
      name: player.name,
      money: player.money,
      cards: player.cards,
      placedTile: player.placedTile,
      availableActions: player.availableActions,
      isAI: player.isAI,
    })),
    currentTurn: game.currentTurn,
    currentPlayer: game.currentPlayer,
    phase: game.phase,
    history: game.history,
  };
}