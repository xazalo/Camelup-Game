import { Colors } from "../../engine/enums/index.js";
import { Game } from "../../engine/models/index.js";
import { TileType } from "../../engine/enums/TileType.js";
import { type PlayerConfig } from "../../engine/types/PlayerConfig.js";
import { predict } from "../../server/services/index.js";
import { log } from "../../helpers/index.js";

/**
 * This class creates a controller for the game cli orders
 */
export default class GameController {
  game: Game | null = null;

  private readonly createdAt = Date.now();
  private lastActivity = Date.now();

  touch(): void {
    this.lastActivity = Date.now();
  }

  isInactive(timeout = 10 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > timeout;
  }

  async startGame(players: PlayerConfig[], id: string): Promise<string> {
    try {
      this.game = Game.create(players, id) as Game;
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Game Created", "log")}\n${aiLog}`;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return log(message, "error");
    }
  }

  getState(): { game: Game; message: string } {
    try {
      return {
        game: this.game as Game,
        message: log("Game successfully returned", "log"),
      };
    } catch (error: unknown) {
      return {
        game: this.game as Game,
        message: log(
          error instanceof Error ? error.message : "Unknown error",
          "error",
        ),
      };
    }
  }

  async placeTile(
    playerName: string,
    position: number,
    tileType: TileType,
  ): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    try {
      this.game.placeTile(playerName, position, tileType);
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Tile placed at " + position + "type " + tileType, "log")}\n${aiLog}`;
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  async rollTheDice(playerName: string): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    try {
      this.game.rollDice(playerName);
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Dice rolled successfully", "log")}\n${aiLog}`;
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  async placeWinnerBet(
    playerName: string,
    camelColor: Colors,
  ): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return log("Camel not found", "error");
      }

      this.game.placeWinnerBet(playerName, camel);
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Winner bet on " + camelColor + " placed", "log")}\n${aiLog}`;
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  async placeLoserBet(playerName: string, camelColor: Colors): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return log("Camel not found", "error");
      }

      this.game.placeLoserBet(playerName, camel);
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Loser bet on " + camelColor + " placed", "log")}\n${aiLog}`;
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  async takeRoundBet(playerName: string, camelColor: Colors): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    const playerExists = this.game.players.some((p) => p.name === playerName);

    if (!playerExists) {
      return log(`Player ${playerName} not found`, "error");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return log("Camel not found", "error");
      }

      this.game.takeRoundBet(playerName, camel);
      this.touch();

      const aiLog = await this.checkAIPlayer();

      return `${log("Round bet on " + camelColor + " placed", "log")}\n${aiLog}`;
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  private async checkAIPlayer(): Promise<string> {
    try {
      const isAI = this.game?.players[this.game.currentPlayer]?.isAI;

      if (isAI) {
        const result = await predict(this.game!);
        console.log(result);
        if (!result.action_name) {
          return log("AI agent don't respond", "error");
        } else {
          await this.executeAIAction(result.action_name);
        }
      }

      return isAI ? log("AI play", "log") : log("AI not play", "log");
    } catch (error: unknown) {
      return log(
        error instanceof Error ? error.message : "Unknown error",
        "error",
      );
    }
  }

  private async executeAIAction(action: string): Promise<string> {
    if (!this.game) {
      return log("Game not started", "error");
    }

    const player = this.game.players[this.game.currentPlayer]!;

    switch (action) {
      case "ROLL_DICE":
        return await this.rollTheDice(player.name);

      case "TAKE_ROUND_BET_GREEN":
        return await this.takeRoundBet(player.name, Colors.Green);

      case "TAKE_ROUND_BET_BLUE":
        return await this.takeRoundBet(player.name, Colors.Blue);

      case "TAKE_ROUND_BET_RED":
        return await this.takeRoundBet(player.name, Colors.Red);

      case "TAKE_ROUND_BET_YELLOW":
        return await this.takeRoundBet(player.name, Colors.Yellow);

      case "PLACE_WINNER_GREEN":
        return await this.placeWinnerBet(player.name, Colors.Green);

      case "PLACE_WINNER_BLUE":
        return await this.placeWinnerBet(player.name, Colors.Blue);

      case "PLACE_WINNER_RED":
        return await this.placeWinnerBet(player.name, Colors.Red);

      case "PLACE_WINNER_YELLOW":
        return await this.placeWinnerBet(player.name, Colors.Yellow);

      case "PLACE_LOSER_GREEN":
        return await this.placeLoserBet(player.name, Colors.Green);

      case "PLACE_LOSER_BLUE":
        return await this.placeLoserBet(player.name, Colors.Blue);

      case "PLACE_LOSER_RED":
        return await this.placeLoserBet(player.name, Colors.Red);

      case "PLACE_LOSER_YELLOW":
        return await this.placeLoserBet(player.name, Colors.Yellow);

      case "PLACE_OASIS": {
        const position = Math.floor(Math.random() * 15) + 1;
        return await this.placeTile(player.name, position, TileType.Oasis);
      }

      case "PLACE_MIRAGE": {
        const position = Math.floor(Math.random() * 15) + 1;
        return await this.placeTile(player.name, position, TileType.Mirage);
      }

      default:
        return log(`Unknown AI action: ${action}`, "error");
    }
  }
}
