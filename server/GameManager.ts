import GameController from "../cli/controllers/GameController.js";
import createRandomId from "../cli/helpers/createRandomId.js";
import GameLobby from "./GameLobby.js";

export default class GameManager {
  private games = new Map<string, GameController>();
  private lobbies = new Map<string, GameLobby>();

  createLobby(): string {
    const gameId = createRandomId();

    this.lobbies.set(gameId, new GameLobby());

    return gameId;
  }

  getLobby(gameId: string): GameLobby | undefined {
    return this.lobbies.get(gameId);
  }

  createGame(): { gameId: string; game: GameController } {
    const gameId = createRandomId();
    const game = new GameController();

    this.games.set(gameId, game);

    return {
      gameId,
      game,
    };
  }

  startGame(gameId: string): GameController | undefined {
    const lobby = this.lobbies.get(gameId);

    if (!lobby) return;

    const game = new GameController();

    this.games.set(gameId, game);

    game.startGame(lobby.getPlayers(), gameId);

    this.lobbies.delete(gameId);

    return game;
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

    for (const [lobbyId, lobby] of this.lobbies) {
      if (lobby.isInactive()) {
        console.log(`Deleting lobby ${lobbyId} due to inactivity.`);
        this.lobbies.delete(lobbyId);
      }
    }
  }
}
