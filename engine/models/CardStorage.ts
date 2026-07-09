import { Colors } from "../../engine/enums/index.js"

interface StorageMap {
  yellow: { remaining: number };
  green: { remaining: number };
  blue: { remaining: number };
  red: { remaining: number };
}

interface BetStorage {
  yellow: string[];
  green: string[];
  blue: string[];
  red: string[];
}

/**
 * Stores the betting cards available during the game.
 *
 * - winnerCards: players who bet on each camel to win the game.
 * - loserCards: players who bet on each camel to lose the game.
 * - storedCards: remaining betting cards available for each camel.
 */
export default class CardStorage {
  winnerCards: BetStorage;
  loserCards: BetStorage;
  storedCards: StorageMap;

  constructor() {
    this.winnerCards = { yellow: [], green: [], blue: [], red: [] };
    this.loserCards = { yellow: [], green: [], blue: [], red: [] };
    this.storedCards = {
      yellow: { remaining: 5 },
      green: { remaining: 5 },
      blue: { remaining: 5 },
      red: { remaining: 5 },
    };
  }

  grabCard(color: string): void {
    if (color === "yellow") this.storedCards.yellow.remaining -= 1;
    if (color === "green") this.storedCards.green.remaining -= 1;
    if (color === "red") this.storedCards.red.remaining -= 1;
    if (color === "blue") this.storedCards.blue.remaining -= 1;
  }

  numberRemainingCards(color: string): number | undefined {
    if (color === "yellow") return this.storedCards.yellow.remaining;
    if (color === "green") return this.storedCards.green.remaining;
    if (color === "red") return this.storedCards.red.remaining;
    if (color === "blue") return this.storedCards.blue.remaining;
  }

  shouldGrabCard(color: string): boolean {
    if (color === "yellow") return this.storedCards.yellow.remaining > 0;
    if (color === "green") return this.storedCards.green.remaining > 0;
    if (color === "red") return this.storedCards.red.remaining > 0;
    if (color === "blue") return this.storedCards.blue.remaining > 0;

    return false;
  }

  addWinner(playerName: string, color: string): void {
    if (color === "yellow") this.winnerCards.yellow.unshift(playerName);
    if (color === "green") this.winnerCards.green.unshift(playerName);
    if (color === "red") this.winnerCards.red.unshift(playerName);
    if (color === "blue") this.winnerCards.blue.unshift(playerName);
  }

  addLoser(playerName: string, color: string): void {
    if (color === "yellow") this.loserCards.yellow.unshift(playerName);
    if (color === "green") this.loserCards.green.unshift(playerName);
    if (color === "red") this.loserCards.red.unshift(playerName);
    if (color === "blue") this.loserCards.blue.unshift(playerName);
  }

  hasWinnerCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow") return this.winnerCards.yellow.includes(playerName);
    if (color === "green") return this.winnerCards.green.includes(playerName);
    if (color === "red") return this.winnerCards.red.includes(playerName);
    if (color === "blue") return this.winnerCards.blue.includes(playerName);

    return false;
  }

  hasLoserCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow") return this.loserCards.yellow.includes(playerName);
    if (color === "green") return this.loserCards.green.includes(playerName);
    if (color === "red") return this.loserCards.red.includes(playerName);
    if (color === "blue") return this.loserCards.blue.includes(playerName);

    return false;
  }

  resetStoredCards(): void {
    this.storedCards = {
      yellow: { remaining: 5 },
      green: { remaining: 5 },
      blue: { remaining: 5 },
      red: { remaining: 5 },
    };
  }
}
