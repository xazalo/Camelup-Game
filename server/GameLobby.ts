import type { PlayerConfig } from "../engine/types/PlayerConfig.js";
import { log } from "../helpers/logger.js";

export default class GameLobby {
  private readonly players: PlayerConfig[];
  private lastActivity = Date.now();

  constructor(player: PlayerConfig) {
    this.players = [{ ...player }];
  }

  touch(): string {
    this.lastActivity = Date.now();
    return log("Activity updated", "info");
  }

  isInactive(timeout = 10 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > timeout;
  }

  addPlayer(player: PlayerConfig): string {
    if (this.players.length >= 6) {
      return log("Maximum players reached", "error");
    }

    if (this.players.some((p) => p.name === player.name)) {
      return log("Player already exists", "error");
    }

    this.players.push({ ...player });
    this.touch();

    return log("Player added", "success");
  }

  addAI(): string {
    const aiNumber = this.players.filter((p) => p.isAI).length + 1;

    return this.addPlayer({
      name: `AI_${aiNumber}`,
      isAI: true,
      socketId: "none",
    });
  }

  getPlayers(): PlayerConfig[] | string {
    const result = this.players.map((player) => ({ ...player }));

    if (result.length === 0) {
      return log("No players", "error");
    }

    return result;
  }

  playerExists(playerName: string): boolean {
    return this.players.some(
      (player) => player.name.toLowerCase() === playerName.toLowerCase(),
    );
  }
}
