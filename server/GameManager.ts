import GameController from "../cli/controllers/GameController.js";
import createRandomId from "../cli/helpers/createRandomId.js";
import GameLobby from "./GameLobby.js";
import { type PlayerConfig } from "../engine/types/index.js";

export default class GameManager {
  private games = new Map<string, GameController>();
  private lobbies = new Map<string, GameLobby>();

  createLobby(player: {name: string, isAI: boolean}, socketId: string): string {
    const gameId = createRandomId();
    const playerConfig = {name: player.name, isAI: player.isAI, socketId}
    this.lobbies.set(gameId, new GameLobby(playerConfig));
    return gameId;
  }

  getLobby(gameId: string): GameLobby | string {
    const result = this.lobbies.get(gameId);
    if (!result) return "cannot get the lobby";
    return result;
  }

  async startGame(gameId: string): Promise<GameController | string> {
    const lobby = this.lobbies.get(gameId);

    if (!lobby) return "There are no lobby";

    const game = new GameController();

    this.games.set(gameId, game);

    const players = lobby.getPlayers();

    if(typeof players === "string") return players

    if (players.length < 2 || players.length > 6) {
      return "players must be between 2 and 6";
    }

    await game.startGame(players, gameId);

    return game;
  }

  getGame(gameId: string): GameController | string {
    const result = this.games.get(gameId);
    if(!result) return "Game not found"
    return result;
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
