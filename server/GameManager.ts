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

  deleteGame(gameId: string): void {
    this.games.delete(gameId);
  }
}
