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

  /**
   * This methods allow the user to chose one card bet card of the CardStorage
   * @param color The camel color
   */
  grabCard(color: string): number | void {
    if (color === "yellow") {
      this.storedCards.yellow.remaining -= 1;
      return this.storedCards.yellow.remaining + 1;
    }
    if (color === "green") {
      this.storedCards.green.remaining -= 1;
      return this.storedCards.green.remaining + 1;
    }
    if (color === "red") {
      this.storedCards.red.remaining -= 1;
      return this.storedCards.red.remaining + 1;
    }
    if (color === "blue") {
      this.storedCards.blue.remaining -= 1;
      return this.storedCards.blue.remaining + 1;
    }

    throw new Error("Bug in grab card!!!.");
  }

  /**
   * This method return the remaining cards of each camel
   * @param color The camel color
   */
  numberRemainingCards(color: string): number | undefined {
    if (color === "yellow") return this.storedCards.yellow.remaining;
    if (color === "green") return this.storedCards.green.remaining;
    if (color === "red") return this.storedCards.red.remaining;
    if (color === "blue") return this.storedCards.blue.remaining;
  }

  /**
   * This method returns if there are cards to grab of the chosen camel
   * @param color The camel color
   */
  shouldGrabCard(color: string): boolean {
    if (color === "yellow") return this.storedCards.yellow.remaining > 0;
    if (color === "green") return this.storedCards.green.remaining > 0;
    if (color === "red") return this.storedCards.red.remaining > 0;
    if (color === "blue") return this.storedCards.blue.remaining > 0;

    return false;
  }

  /**
   *  This method add a winner bet.
   * @param playerName The name of the player who bets.
   * @param color The camel color
   */
  addWinner(playerName: string, color: string): void {
    if (color === "yellow") this.winnerCards.yellow.push(playerName);
    if (color === "green") this.winnerCards.green.push(playerName);
    if (color === "red") this.winnerCards.red.push(playerName);
    if (color === "blue") this.winnerCards.blue.push(playerName);
  }

  /**
   * This method add a loser bet
   * @param playerName The name of the player who bets
   * @param color The camel color
   */
  addLoser(playerName: string, color: string): void {
    if (color === "yellow") this.loserCards.yellow.push(playerName);
    if (color === "green") this.loserCards.green.push(playerName);
    if (color === "red") this.loserCards.red.push(playerName);
    if (color === "blue") this.loserCards.blue.push(playerName);
  }

  /**
   * This method returns one boolean witch indicates if the player has a winner bet for one camel
   * @param playerName The name of the player who make the bet
   * @param color The camel color
   */
  hasWinnerCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow") return this.winnerCards.yellow.includes(playerName);
    if (color === "green") return this.winnerCards.green.includes(playerName);
    if (color === "red") return this.winnerCards.red.includes(playerName);
    if (color === "blue") return this.winnerCards.blue.includes(playerName);

    return false;
  }

  /**
   * This method returns one boolean witch indicates if the player has loser a bet for one camel
   * @param playerName The name of the player who make the bet
   * @param color The camel color
   */
  hasLoserCardPlaced(playerName: string, color: string): boolean {
    if (color === "yellow") return this.loserCards.yellow.includes(playerName);
    if (color === "green") return this.loserCards.green.includes(playerName);
    if (color === "red") return this.loserCards.red.includes(playerName);
    if (color === "blue") return this.loserCards.blue.includes(playerName);

    return false;
  }

  /**
   * This method reset the storage to default
   */
  resetStoredCards(): void {
    this.storedCards = {
      yellow: { remaining: 5 },
      green: { remaining: 5 },
      blue: { remaining: 5 },
      red: { remaining: 5 },
    };
  }

  /**
   * This method return the winner cards
   */
  getWinnerCards() {
    return this.winnerCards;
  }

  /**
   * This method return the loser cards
   */
  getLoserCards() {
    return this.loserCards;
  }
}
