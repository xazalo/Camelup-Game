import { Colors } from "../../engine/enums/index.js";
import { log } from "../../helpers/logger.js";

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

  resetRound(): void {
    this.roundBet.blue = true;
    this.roundBet.green = true;
    this.roundBet.red = true;
    this.roundBet.yellow = true;

    this.placeTile.fill(true);
    this.placeTile[0] = false;
    this.placeTile[15] = false;
  }

  switchPlaceTile(position: number): string {
    if (!Number.isInteger(position) || position < 1 || position > 14) {
      return log("Incorrect Tile Position", "error");
    }

    this.placeTile[position - 1] = false;
    this.placeTile[position] = false;
    this.placeTile[position + 1] = false;

    return log("Tile switched successfully", "success");
  }

  switchRollDice(): string {
    this.rollDice = false;

    return log("Dice switched successfully", "success");
  }

  switchRoundBet(color: Colors): string {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      return log("Incorrect Bet Color", "error");
    }

    this.roundBet[color] = false;

    return log("Round bet switched successfully", "success");
  }

  switchWinnerBet(color: Colors): string {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      return log("Incorrect Bet Color", "error");
    }

    this.winnerBet[color] = false;

    return log("Winner bet switched successfully", "success");
  }

  switchLoserBet(color: Colors): string {
    if (
      color !== Colors.Blue &&
      color !== Colors.Green &&
      color !== Colors.Red &&
      color !== Colors.Yellow
    ) {
      return log("Incorrect Bet Color", "error");
    }

    this.loserBet[color] = false;

    return log("Loser bet switched successfully", "success");
  }
}
