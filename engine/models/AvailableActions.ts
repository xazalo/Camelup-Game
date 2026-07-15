import { Colors } from "../../engine/enums/index.js";

export default class AvailableActions {
  rollDice = true;

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

  placeTile = true;

  reset(): void {
    this.rollDice = true;

    this.winnerBet.blue = true;
    this.winnerBet.green = true;
    this.winnerBet.red = true;
    this.winnerBet.yellow = true;

    this.loserBet.blue = true;
    this.loserBet.green = true;
    this.loserBet.red = true;
    this.loserBet.yellow = true;

    this.placeTile = true;
  }

  switchPlaceTile(): void {
    this.placeTile = false;
  }

  switchRollDice(): void {
    this.rollDice = false;
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
