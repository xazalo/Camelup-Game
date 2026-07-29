import GameController from "../cli/controllers/GameController.js";
import type Game from "../engine/models/Game.js";
import { createRandomId } from "../helpers/index.js";
import GameLobby from "./GameLobby.js";
import { log } from "../helpers/index.js";

export default class GameManager {
  private games = new Map<string, GameController>();
  private lobbies = new Map<string, GameLobby>();

  createLobby(
    player: { name: string; isAI: boolean },
    socketId: string,
  ): string {
    const gameId = createRandomId();
    const playerConfig = { name: player.name, isAI: player.isAI, socketId };
    this.lobbies.set(gameId, new GameLobby(playerConfig));
    return gameId;
  }

  getLobby(gameId: string): GameLobby | string {
    const result = this.lobbies.get(gameId);
    if (typeof result === "string" || result === undefined)
      return log("Cannot get the lobby", "error");
    return result;
  }

  getCurrentPlayer(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      return log("Game not found", "error");
    }
    return game.getCurrentPlayer();
  }

  async startGame(gameId: string): Promise<GameController | string> {
    const lobby = this.lobbies.get(gameId);

    if (!lobby) {
      return log("There is no lobby", "error");
    }

    const game = new GameController();

    this.games.set(gameId, game);

    const players = lobby.getPlayers();

    if (typeof players === "string") {
      return players;
    }

    if (players.length < 2 || players.length > 6) {
      return log("Players must be between 2 and 6", "info");
    }

    await game.startGame(players, gameId);

    return game;
  }

  getGame(gameId: string): GameController | string {
    const game = this.games.get(gameId);

    if (!game) {
      return log("Game not found", "error");
    }

    return game;
  }

  touchGame(gameId: string): string {
    const game = this.games.get(gameId);

    if (!game) {
      return log("Game not found", "error");
    }

    game.touch();

    return log("Game activity updated", "info");
  }

  deleteGame(gameId: string): string {
    if (!this.games.has(gameId)) {
      return log("Game not found", "error");
    }

    this.games.delete(gameId);

    return log("Game deleted successfully", "success");
  }

  cleanup(): string {
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

    return log("Cleanup completed", "success");
  }
}
