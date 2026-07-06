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
 * This class is an storage of the cards witch can be purchased for the players
 *
 * @param {winnerCard} BetStorage, Storage of bet cards, this bet is for the
 *                                  winner of the game, the player should add
 *                                  bets inside the storage
 *
 * @param {loserCard} BetStorage, Storage of bet cards, this bet is for the
 *                                  loser of the game, the player should add
 *                                  bets inside the storage
 *
 * @param {storedCards} StorageMap, Storage off cards that can be purchased by
 *                                  the players
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
      red: { remaining: 5 },
      blue: { remaining: 5 },
    };
  }
}
