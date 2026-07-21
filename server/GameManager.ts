// server/GameManager.ts

import GameController from "../cli/controllers/GameController.js";
import createRandomId from "../cli/helpers/createRandomId.js";

export default class GameManager {
  private games = new Map<string, GameController>();

  createGame(): { gameId: string; game: GameController } {
    const gameId = createRandomId();
    const game = new GameController();

    this.games.set(gameId, game);

    return {
      gameId,
      game,
    };
  }

  getGame(gameId: string): GameController | undefined {
    return this.games.get(gameId);
  }

  touchGame(gameId: string): void {
    this.games.get(gameId)?.touch();
  }

  deleteGame(gameId: string): void {
    this.games.delete(gameId);
  }

  cleanup(): void {
    for (const [gameId, game] of this.games) {
      if (game.isInactive()) {
        console.log(`Deleting game ${gameId} due to inactivity.`);
        this.games.delete(gameId);
      }
    }
  }
}