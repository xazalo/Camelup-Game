import { Colors } from "../../engine/enums/index.js";
import { Game } from "../../engine/models/index.js";
import { TileType } from "../../engine/enums/TileType.js";

/**
 * This class creates a controller for the game cli orders
 */
export default class GameController {
  game: Game | null = null;

  private debug<T>(response: T): T {
    console.log("[GameController]", response);
    return response;
  }

  startGame(playerNames: string[], id: string): string {
    try {
      this.game = Game.create(playerNames, id);
      return this.debug("Game started");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  getState() {
    try {
      return this.debug(this.game);
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  placeTile(playerName: string, position: number, tileType: TileType) {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      this.game.placeTile(playerName, position, tileType);
      return this.debug("Tile placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  rollTheDice(playerName: string) {
    if (!this.game) return this.debug("Game not started");

    try {
      this.game.rollDice(playerName);
      return this.debug("Dice rolled successfully");
    } catch (error) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  placeWinnerBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.placeWinnerBet(playerName, camel);
      return this.debug("Winner bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  placeLoserBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.placeLoserBet(playerName, camel);
      return this.debug("Loser bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  takeRoundBet(playerName: string, camelColor: Colors): string {
    if (!this.game) {
      return this.debug("Game not started");
    }

    try {
      const camel = this.game.board.findCamelByColor(camelColor);

      if (!camel) {
        return this.debug("Camel not found");
      }

      this.game.takeRoundBet(playerName, camel);
      return this.debug("Round bet placed");
    } catch (error: unknown) {
      return this.debug(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}
