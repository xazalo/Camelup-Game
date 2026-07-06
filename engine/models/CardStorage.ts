interface StorageMap {
  yellow: { remaining: number };
  green: { remaining: number };
  blue: { remaining: number };
  red: { remaining: number };
}

interface BetStorage {
    yellow: string[]
    green: string[]
    blue: string[]
    red: string[]
}

export default class CardStorage {
  winnerCards: BetStorage;
  loserCards: BetStorage;
  storedCards: StorageMap;

  constructor() {
    this.winnerCards = {yellow: [], green: [], blue: [], red: []};
    this.loserCards = {yellow: [], green: [], blue: [], red: []};
    this.storedCards = {
      yellow: { remaining: 5 },
      green: { remaining: 5 },
      red: { remaining: 5 },
      blue: { remaining: 5 }
    };
  }
}
