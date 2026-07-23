import type { PlayerConfig } from "../engine/types/PlayerConfig.js";

export default class GameLobby {
  private players: PlayerConfig[];
  private lastActivity = Date.now();

  constructor(player: PlayerConfig) {
    this.players = [{ ...player }];
  }

  touch(): void {
    this.lastActivity = Date.now();
  }

  isInactive(timeout = 10 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > timeout;
  }

  addPlayer(player: PlayerConfig): string {
    if (this.players.length >= 6) {
      return "Maximum players reached";
    }

    if (this.players.some((p) => p.name === player.name)) {
      return "Player already exists";
    }

    this.players.push({ ...player });
    this.touch();

    return "Player added";
  }

  addAI(): string {
    const aiNumber = this.players.filter((p) => p.isAI).length + 1;

    return this.addPlayer({
      name: `AI_${aiNumber}`,
      isAI: true,
    });
  }

  getPlayers(): PlayerConfig[] {
    return this.players.map((player) => ({ ...player }));
  }
}