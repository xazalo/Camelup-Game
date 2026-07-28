import { Colors } from "../../engine/enums/index.js";

export default class AvailableActions {
  rollDice = true;

  roundBet = {
    blue: true,
    green: true,
    red: true,
    yellow: true,
  };

  winnerBet = {
    blue: true,
    green: true,
    red: true,
    yellow: true,
  };

  loserBet = {
    blue: true,
    green: true,
    red: true,
    yellow: true,
  };

  placeTile: boolean[] = Array(16).fill(true);

  constructor() {
    this.placeTile[0] = false;
    this.placeTile[15] = false;
  }

  reset(): void {
    this.rollDice = true;

    this.roundBet.blue = true;
    this.roundBet.green = true;
    this.roundBet.red = true;
    this.roundBet.yellow = true;

    this.winnerBet.blue = true;
    this.winnerBet.green = true;
    this.winnerBet.red = true;
    this.winnerBet.yellow = true;

    this.loserBet.blue = true;
    this.loserBet.green = true;
    this.loserBet.red = true;
    this.loserBet.yellow = true;

    this.placeTile.fill(true);
    this.placeTile[0] = false;
    this.placeTile[15] = false;
  }

  switchPlaceTile(position: number): void {
    if (!Number.isInteger(position) || position < 1 || position > 14) {
      throw new Error("Incorrect Tile Position");
    }

    this.placeTile[position - 1] = false;
    this.placeTile[position] = false;
    this.placeTile[position + 1] = false;
  }

  switchRollDice(): void {
    this.rollDice = false;
  }

  switchRoundBet(color: Colors): void {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      throw new Error("Incorrect Bet Color");
    }

    this.roundBet[color] = false;
  }

  switchWinnerBet(color: Colors): void {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      throw new Error("Incorrect Bet Color");
    }

    this.winnerBet[color] = false;
  }

  switchLoserBet(color: Colors): void {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      throw new Error("Incorrect Bet Color");
    }

    this.loserBet[color] = false;
  }
}
