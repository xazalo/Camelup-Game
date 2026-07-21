import { Colors } from "../../engine/enums/index.js";
import { Game } from "../../engine/models/index.js";
import { TileType } from "../../engine/enums/TileType.js";
import { type PlayerConfig } from "../../engine/types/PlayerConfig.js";
import { predict } from "../../server/services/index.js";

/**
 * This class creates a controller for the game cli orders
 */
export default class GameController {
  game: Game | null = null;

  private readonly createdAt = Date.now();
  private lastActivity = Date.now();

  private debug<T>(response: T): T {
    console.log("[GameController]", response);
    return response;
  }

  touch(): void {
    this.lastActivity = Date.now();
  }

  isInactive(timeout = 10 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > timeout;
  }

  async startGame(players: PlayerConfig[], id: string): Promise<string> {
    try {
      this.game = Game.create(players, id);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Game started");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  getState() {
    try {
      return this.debug(this.game);
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  private async checkAIPlayer(): Promise<void> {
    if (!this.game) return;

    const currentPlayer = this.game.players[this.game.currentPlayer];

    if (!currentPlayer?.isAI) {
      return;
    }

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.getState()),
    });

    const data = await response.json();

    console.log("AI response body:", data);

    await this.executeAIAction(data.action_name);
  }

  async placeTile(playerName: string, position: number, tileType: TileType) {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      this.game.placeTile(playerName, position, tileType);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Tile placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async rollTheDice(playerName: string) {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      this.game.rollDice(playerName);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Dice rolled successfully");
    } catch (error) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async placeWinnerBet(
    playerName: string,
    camelColor: Colors,
  ): Promise<string> {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.placeWinnerBet(playerName, camel);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Winner bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async placeLoserBet(playerName: string, camelColor: Colors): Promise<string> {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.placeLoserBet(playerName, camel);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Loser bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async takeRoundBet(playerName: string, camelColor: Colors): Promise<string> {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.takeRoundBet(playerName, camel);
      this.touch();

      await this.checkAIPlayer();

      return this.debug("Round bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  private async executeAIAction(action: string): Promise<void> {
    if (!this.game) return;

    const player = this.game.players[this.game.currentPlayer]!;

    switch (action) {
      case "ROLL_DICE":
        console.log(player.name, "ROLL_DICE");
        await this.rollTheDice(player.name);
        break;

      case "TAKE_ROUND_BET_GREEN":
        console.log(player.name, "TAKE_ROUND_BET_GREEN");
        await this.takeRoundBet(player.name, Colors.Green);
        break;

      case "TAKE_ROUND_BET_BLUE":
        console.log(player.name, "TAKE_ROUND_BET_BLUE");
        await this.takeRoundBet(player.name, Colors.Blue);
        break;

      case "TAKE_ROUND_BET_RED":
        console.log(player.name, "TAKE_ROUND_BET_RED");
        await this.takeRoundBet(player.name, Colors.Red);
        break;

      case "TAKE_ROUND_BET_YELLOW":
        console.log(player.name, "TAKE_ROUND_BET_YELLOW");
        await this.takeRoundBet(player.name, Colors.Yellow);
        break;

      case "PLACE_WINNER_GREEN":
        console.log(player.name, "PLACE_WINNER_GREEN");
        await this.placeWinnerBet(player.name, Colors.Green);
        break;

      case "PLACE_WINNER_BLUE":
        console.log(player.name, "PLACE_WINNER_BLUE");
        await this.placeWinnerBet(player.name, Colors.Blue);
        break;

      case "PLACE_WINNER_RED":
        console.log(player.name, "PLACE_WINNER_RED");
        await this.placeWinnerBet(player.name, Colors.Red);
        break;

      case "PLACE_WINNER_YELLOW":
        console.log(player.name, "PLACE_WINNER_YELLOW");
        await this.placeWinnerBet(player.name, Colors.Yellow);
        break;

      case "PLACE_LOSER_GREEN":
        console.log(player.name, "PLACE_LOSER_GREEN");
        await this.placeLoserBet(player.name, Colors.Green);
        break;

      case "PLACE_LOSER_BLUE":
        console.log(player.name, "PLACE_LOSER_BLUE");
        await this.placeLoserBet(player.name, Colors.Blue);
        break;

      case "PLACE_LOSER_RED":
        console.log(player.name, "PLACE_LOSER_RED");
        await this.placeLoserBet(player.name, Colors.Red);
        break;

      case "PLACE_LOSER_YELLOW":
        console.log(player.name, "PLACE_LOSER_YELLOW");
        await this.placeLoserBet(player.name, Colors.Yellow);
        break;

      case "PLACE_OASIS": {
        console.log(player.name, "PLACE_OASIS");
        const position = Math.floor(Math.random() * 15) + 1;
        await this.placeTile(player.name, position, TileType.Oasis);
        break;
      }

      case "PLACE_MIRAGE": {
        console.log(player.name, "PLACE_MIRAGE");
        const position = Math.floor(Math.random() * 15) + 1;
        await this.placeTile(player.name, position, TileType.Mirage);
        break;
      }

      default:
        throw new Error(`Unknown AI action: ${action}`);
    }
  }
}
