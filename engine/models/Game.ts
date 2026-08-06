import {
  Board,
  Player,
  Round,
  CardStorage,
  Dice,
  Turn,
  Camel,
  Card,
} from "./index.js";
import { generatePayoutTable } from "../../helpers/index.js";
import { GamePhase, Colors, TileType, BetType } from "../enums/index.js";
import { type DiceValue } from "../types/index.js";
import { type PlayerConfig } from "../types/index.js";
import { log } from "../../helpers/index.js";
import { Probabilities } from "./Probabilities.js";

type Bet = {
  player: string;
  order: number;
};

export default class Game {
  id: string;

  board: Board;
  players: Player[];

  currentTurn: number;
  currentPlayer: number;
  phase: GamePhase;

  cardStorage: CardStorage;

  history: Round[];

  probabilities: Probabilities;

  constructor(
    id: string,
    board: Board,
    players: Player[],
    history: Round[],
    cardStorage: CardStorage,
    probabilities: Probabilities,
  ) {
    this.id = id;

    this.currentPlayer = 0;
    this.currentTurn = 1;

    this.board = board;
    this.players = players;
    this.phase = GamePhase.Setup;
    this.history = history;

    this.cardStorage = cardStorage;

    this.probabilities = probabilities;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer]?.name;
  }

  getPlayerWithMoreMoney(): string {
    const player = this.players.reduce((richest, player) =>
      player.money > richest.money ? player : richest,
    );

    return player.name;
  }

  static create(playersConfig: PlayerConfig[], id: string): Game | string {
    if (playersConfig.length < 2 || playersConfig.length > 6) {
      return log("This Game must have between 2 and 6 players", "error");
    }

    const board = new Board(16);
    const storage = new CardStorage();

    const players = playersConfig.map(
      ({ name, isAI }) => new Player(name, isAI),
    );

    const round = new Round();

    const game = new Game(id, board, players, [round], storage, new Probabilities());

    game.board.createCamels();
    round.prepareInitialMoves(board);
    game.phase = GamePhase.Playing;
    game.recomputeProbabilities();

    return game;
  }

  addRound(): string {
    const newRound = new Round();

    this.history = [...this.history, newRound];
    this.currentTurn = 1;

    const firstPlayer = this.players.shift();

    if (firstPlayer) {
      this.players.push(firstPlayer);
    }

    for (const player of this.players) {
      player.availableActions.resetRound();
      player.removePlacedTile();
    }

    this.currentPlayer = 0;

    return log("Round added successfully", "success");
  }

  getCurrentRound(): Round {
    return this.history[this.history.length - 1]!;
  }

  rollDice(playerName: string): string {
    const active = this.ensureGameIsActive();

    if (!active) return log("Game has already finished", "info");

    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      return log("Player not found", "error");
    }

    if (!this.playerHasTurn(playerIndex)) {
      return log("It is not this player's turn", "error");
    }

    const player = this.players[playerIndex] as Player;

    player.updateMoney(1);

    this.processDiceRoll(player);

    return log("Dice rolled successfully", "info");
  }

  placeTile(playerName: string, position: number, tileType: TileType): string {
    const active = this.ensureGameIsActive();

    if (!active) return log("Game has already finished", "info");

    if (position === 0) {
      return log("Tile cannot be placed on the first position", "error");
    }

    const playerIndex = this.getPlayerIndexByName(playerName);

    if (!this.playerHasTurn(playerIndex)) {
      return log("Is not your turn", "error");
    }

    if (this.players[playerIndex]?.hasPlacedTile()) {
      return log("Tile already placed", "error");
    }

    const boardSize = this.board.spaces.length;

    if (position < 1 || position >= boardSize) {
      return log("Invalid tile position", "error");
    }

    if (!this.players[playerIndex]?.availableActions.placeTile[position]) {
      return log("Tile position not available", "error");
    }

    if (this.board.spaces[position]?.tile.hasTile()) {
      return log("There is already a tile in this space", "error");
    }

    if (this.board.spaces[position - 1]?.tile.hasTile()) {
      return log("A tile cannot be placed next to an existing tile", "error");
    }

    if (this.board.spaces[position + 1]?.tile.hasTile()) {
      return log("A tile cannot be placed next to an existing tile", "error");
    }

    this.board.spaces[position]?.tile.place(playerName, tileType);

    for (const player of this.players) {
      player?.updateAvailableTiles(position);
    }

    this.players[playerIndex]?.switchTilePlaced();
    this.recomputeProbabilities();
    this.nextTurn();

    return log("Tile placed successfully", "info");
  }

  private processDiceRoll(player: Player): string | void {
    const round = this.getCurrentRound();

    const color = round.dicePool.draw();
    const value = Math.floor(Math.random() * 3 + 1) as DiceValue;

    const dice = new Dice(color, value);

    this.board.moveCamelStack(color, value, player);

    this.recomputeProbabilities();

    round.addTurn(new Turn(player.name, { type: "RollDice" }, dice));

    if (this.board.hasCamelReachedFinish()) {
      this.endGame();
      return log("Game finished", "finished");
    }

    if (round.isFinished()) {
      this.endRound();
      return log("Round finished", "finished");
    }

    this.nextTurn();
  }

  getPlayerIndexByName(name: string): number {
    return this.players.findIndex((player) => player.name === name);
  }

  /**
   * Returns the concrete AI action names currently legal for the player.
   * This is the single source of truth used to validate AI predictions, so
   * an invalid/stale AI move is never executed (prevents turn desyncs).
   */
  getLegalActions(playerName: string): string[] {
    if (this.phase === GamePhase.Finished) {
      return [];
    }

    const index = this.getPlayerIndexByName(playerName);

    if (index === -1 || !this.playerHasTurn(index)) {
      return [];
    }

    const player = this.players[index]!;
    const actions: string[] = [];

    if (player.availableActions.rollDice) {
      actions.push("ROLL_DICE");
    }

    const roundBet = player.availableActions.roundBet;
    if (roundBet.green && this.cardStorage.shouldGrabCard("green"))
      actions.push("TAKE_ROUND_BET_GREEN");
    if (roundBet.blue && this.cardStorage.shouldGrabCard("blue"))
      actions.push("TAKE_ROUND_BET_BLUE");
    if (roundBet.red && this.cardStorage.shouldGrabCard("red"))
      actions.push("TAKE_ROUND_BET_RED");
    if (roundBet.yellow && this.cardStorage.shouldGrabCard("yellow"))
      actions.push("TAKE_ROUND_BET_YELLOW");

    const winnerBet = player.availableActions.winnerBet;
    if (winnerBet.green) actions.push("PLACE_WINNER_GREEN");
    if (winnerBet.blue) actions.push("PLACE_WINNER_BLUE");
    if (winnerBet.red) actions.push("PLACE_WINNER_RED");
    if (winnerBet.yellow) actions.push("PLACE_WINNER_YELLOW");

    const loserBet = player.availableActions.loserBet;
    if (loserBet.green) actions.push("PLACE_LOSER_GREEN");
    if (loserBet.blue) actions.push("PLACE_LOSER_BLUE");
    if (loserBet.red) actions.push("PLACE_LOSER_RED");
    if (loserBet.yellow) actions.push("PLACE_LOSER_YELLOW");

    if (!player.placedTile) {
      for (let position = 1; position < 16; position++) {
        const targetTile = this.board.spaces[position]?.tile;
        const leftTile = this.board.spaces[position - 1]?.tile;
        const rightTile = this.board.spaces[position + 1]?.tile;

        const isFree =
          player.availableActions.placeTile[position] &&
          !targetTile?.hasTile() &&
          !leftTile?.hasTile() &&
          !rightTile?.hasTile();

        if (isFree) {
          actions.push(`PLACE_OASIS_${position}`);
          actions.push(`PLACE_MIRAGE_${position}`);
        }
      }
    }

    return actions;
  }

  private calculateRoundIncomes(): void {
    const ranking = this.board.getRaceRanking();

    for (const player of this.players) {
      for (const card of player.getCards()) {
        const position = ranking.indexOf(card.camel.color);

        if (position === -1) continue;

        const payout = card.payouts[(position + 1) as 1 | 2 | 3 | 4];

        player.updateMoney(payout as number);
      }
    }
  }

  private calculateGameIncomes(): void {
    const ranking = this.board.getRaceRanking();

    const winner = ranking[0];
    const loser = ranking[ranking.length - 1];

    this.payGameBets(this.cardStorage.getWinnerCards(), winner as Colors);
    this.payGameBets(this.cardStorage.getLoserCards(), loser as Colors);
  }

  private payGameBets(
    bets: {
      yellow: Bet[];
      green: Bet[];
      blue: Bet[];
      red: Bet[];
    },
    correctColor: Colors,
  ): void {
    const payouts = [8, 5, 3];

    const orderedBets = Object.entries(bets)
      .flatMap(([color, entries]) =>
        entries.map((bet) => ({
          color: color as Colors,
          ...bet,
        })),
      )
      .sort((a, b) => a.order - b.order);

    let correctCount = 0;

    for (const bet of orderedBets) {
      const player = this.players.find((p) => p.name === bet.player);

      if (!player) continue;

      if (bet.color === correctColor) {
        player.updateMoney(
          correctCount < payouts.length ? payouts[correctCount]! : 2,
        );

        correctCount++;
      } else {
        player.updateMoney(-1);
      }
    }
  }

  placeWinnerBet(playerName: string, camel: Camel): string {
    const active = this.ensureGameIsActive();

    if (!active) return log("Game has already finished", "info");

    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      return log("Player not found", "error");
    }

    if (!this.playerHasTurn(playerIndex)) {
      return log("It is not your turn", "error");
    }

    this.players[playerIndex]?.availableActions.switchWinnerBet(camel.color);
    this.cardStorage.addWinner(playerName, camel.color.toString());

    this.nextTurn();

    return log("Winner bet placed successfully", "info");
  }

  placeLoserBet(playerName: string, camel: Camel): string {
    const active = this.ensureGameIsActive();

    if (!active) return log("Game has already finished", "info");

    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      return log("Player not found", "error");
    }

    if (!this.playerHasTurn(playerIndex)) {
      return log("It is not your turn", "error");
    }

    this.players[playerIndex]?.availableActions.switchLoserBet(camel.color);
    this.cardStorage.addLoser(playerName, camel.color.toString());

    this.nextTurn();

    return log("Loser bet placed successfully", "info");
  }

  takeRoundBet(playerName: string, camel: Camel): string {
    const active = this.ensureGameIsActive();

    if (!active) return log("Game has already finished", "info");

    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      return log("Player not found", "error");
    }

    if (!this.playerHasTurn(playerIndex)) {
      return log("It is not your turn", "error");
    }

    const color = camel.color.toString();

    if (!this.cardStorage.shouldGrabCard(color)) {
      return log("No cards remaining for this camel", "error");
    }

    const grabbedCard = this.cardStorage.grabCard(color);

    if (!grabbedCard) {
      return log("There is a bug on the game!!!.", "error");
    }

    const remaining = this.cardStorage.numberRemainingCards(color);

    if (remaining === 0) {
      for (const player of this.players) {
        player.availableActions.switchRoundBet(camel.color);
      }
    }

    const rewardTable = generatePayoutTable(grabbedCard);

    const card = new Card(BetType.TurnWinner, camel, rewardTable);

    this.players[playerIndex]?.addCard(card);

    this.nextTurn();

    return log("Card drawn successfully.", "info");
  }

  private ensureGameIsActive(): boolean {
    return this.phase !== GamePhase.Finished;
  }

  playerHasTurn(index: number): boolean {
    return this.currentPlayer === index;
  }

  endRound(): string {
    this.calculateRoundIncomes();
    this.addRound();
    this.recomputeProbabilities();
    this.cardStorage.resetStoredCards();

    for (const player of this.players) {
      player.resetCardStorage();
    }

    return log("Round ended successfully", "info");
  }

  endGame(): string {
    this.calculateRoundIncomes();
    this.calculateGameIncomes();
    this.phase = GamePhase.Finished;

    const ranking = this.board.getRaceRanking();
    const winner = ranking[0];

    this.probabilities.red = 0;
    this.probabilities.blue = 0;
    this.probabilities.yellow = 0;
    this.probabilities.green = 0;

    if (winner === Colors.Red) this.probabilities.red = 1;
    else if (winner === Colors.Blue) this.probabilities.blue = 1;
    else if (winner === Colors.Yellow) this.probabilities.yellow = 1;
    else if (winner === Colors.Green) this.probabilities.green = 1;

    for (const player of this.players) {
      player.availableActions.switchRollDice();
    }

    return log("Game ended successfully", "finished");
  }

  private nextTurn(): void {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    this.currentTurn++;
  }

  private recomputeProbabilities(): void {
    this.probabilities.defineProbabilities(
      this.getCurrentRound().dicePool,
      this.board,
    );
  }
}
