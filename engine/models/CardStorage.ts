interface StorageMap {
  yellow: { remaining: number };
  green: { remaining: number };
  blue: { remaining: number };
  red: { remaining: number };
}

interface Bet {
  player: string;
  order: number;
}

interface BetStorage {
  yellow: Bet[];
  green: Bet[];
  blue: Bet[];
  red: Bet[];
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

  private betOrder: number;

  constructor() {
    this.betOrder = 0;

    this.winnerCards = { yellow: [], green: [], blue: [], red: [] };
    this.loserCards = { yellow: [], green: [], blue: [], red: [] };

    this.storedCards = {
      yellow: { remaining: 5 },
      green: { remaining: 5 },
      blue: { remaining: 5 },
      red: { remaining: 5 },
    };
  }

  grabCard(color: string): number | void {
    if (color === "yellow") {
      this.storedCards.yellow.remaining--;
      return this.storedCards.yellow.remaining + 1;
    }
    if (color === "green") {
      this.storedCards.green.remaining--;
      return this.storedCards.green.remaining + 1;
    }
    if (color === "red") {
      this.storedCards.red.remaining--;
      return this.storedCards.red.remaining + 1;
    }
    if (color === "blue") {
      this.storedCards.blue.remaining--;
      return this.storedCards.blue.remaining + 1;
    }

    throw new Error("Bug in grab card!!!.");
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
    const bet: Bet = {
      player: playerName,
      order: this.betOrder++,
    };

    if (color === "yellow") this.winnerCards.yellow.push(bet);
    if (color === "green") this.winnerCards.green.push(bet);
    if (color === "red") this.winnerCards.red.push(bet);
    if (color === "blue") this.winnerCards.blue.push(bet);
  }

  addLoser(playerName: string, color: string): void {
    const bet: Bet = {
      player: playerName,
      order: this.betOrder++,
    };

    if (color === "yellow") this.loserCards.yellow.push(bet);
    if (color === "green") this.loserCards.green.push(bet);
    if (color === "red") this.loserCards.red.push(bet);
    if (color === "blue") this.loserCards.blue.push(bet);
  }

  hasWinnerCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow")
      return this.winnerCards.yellow.some((b) => b.player === playerName);
    if (color === "green")
      return this.winnerCards.green.some((b) => b.player === playerName);
    if (color === "red")
      return this.winnerCards.red.some((b) => b.player === playerName);
    if (color === "blue")
      return this.winnerCards.blue.some((b) => b.player === playerName);

    return false;
  }

  hasLoserCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow")
      return this.loserCards.yellow.some((b) => b.player === playerName);
    if (color === "green")
      return this.loserCards.green.some((b) => b.player === playerName);
    if (color === "red")
      return this.loserCards.red.some((b) => b.player === playerName);
    if (color === "blue")
      return this.loserCards.blue.some((b) => b.player === playerName);

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

  getWinnerCards() {
    return this.winnerCards;
  }

  getLoserCards() {
    return this.loserCards;
  }
}