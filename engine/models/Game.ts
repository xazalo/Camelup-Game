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
import { generatePayoutTable } from "../../cli/helpers/index.js";
import { GamePhase, Colors, TileType, BetType } from "../enums/index.js";
import { type DiceValue } from "../types/index.js";

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

  constructor(
    id: string,
    board: Board,
    players: Player[],
    history: Round[],
    cardStorage: CardStorage,
  ) {
    this.id = id;

    this.currentPlayer = 0;
    this.currentTurn = 1;

    this.board = board;
    this.players = players;
    this.phase = GamePhase.Setup;
    this.history = history;

    this.cardStorage = cardStorage;
  }

  static create(playerNames: string[], id: string) {
    if (playerNames.length < 2 || playerNames.length > 6) {
      throw new Error("This Game must have between 2 and 6 players");
    }

    const board = new Board(16);
    const storage = new CardStorage();
    const players = playerNames.map((name) => new Player(name));
    const round = new Round();

    const game = new Game(id, board, players, [round], storage);

    game.board.createCamels();
    round.prepareInitialMoves(board);
    game.phase = GamePhase.Playing

    return game;
  }

  addRound() {
    const newRound = new Round();

    this.history = [...this.history, newRound];
    this.currentTurn = 1;

    const firstPlayer = this.players.shift();

    if (firstPlayer) {
      this.players.push(firstPlayer);
    }

    this.currentPlayer = 0;
  }

  getCurrentRound(): Round {
    return this.history[this.history.length - 1]!;
  }

  rollDice(playerName: string) {
    this.ensureGameIsActive();
    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    if (!this.playerHasTurn(playerIndex)) {
      throw new Error("It is not this player's turn");
    }

    const player = this.players[playerIndex] as Player;

    player.updateMoney(1);

    this.processDiceRoll(player as Player);
  }

  placeTile(playerName: string, position: number, tileType: TileType) {
    this.ensureGameIsActive();
    if (position === 0)
      throw new Error("Tile cannot be placed on the first position");
    const playerIndex = this.getPlayerIndexByName(playerName);
    if (!this.playerHasTurn(playerIndex)) throw new Error("Is not your turn");
    if (this.players[playerIndex]?.hasPlacedTile())
      throw new Error("Tile already placed");
    this.board.spaces[position]?.tile.place(playerName, tileType);
    this.players[playerIndex]?.placeTile();
    this.nextTurn();
  }

  private processDiceRoll(player: Player) {
    const round = this.getCurrentRound();

    const color = round.dicePool.draw();
    const value = Math.floor(Math.random() * 3 + 1) as DiceValue;

    const dice = new Dice(color, value);

    this.board.moveCamelStack(color, value);

    round.addTurn(new Turn(player.name, { type: "RollDice" }, dice));

    if (this.board.hasCamelReachedFinish()) {
      this.endGame();
      return;
    }

    if (round.isFinished()) {
      this.endRound();
      return;
    }

    this.nextTurn();
  }

  getPlayerIndexByName(name: string): number {
    return this.players.findIndex((player) => player.name === name);
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
        correctCount < payouts.length
          ? payouts[correctCount]!
          : 2,
      );

      correctCount++;
    } else {
      player.updateMoney(-1);
    }
  }
}

  placeWinnerBet(playerName: string, camel: Camel): void {
    this.ensureGameIsActive();
    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    if (!this.playerHasTurn(playerIndex)) {
      throw new Error("It is not your turn");
    }

    this.players[playerIndex]?.availableActions.switchWinnerBet(camel.color);
    this.cardStorage.addWinner(playerName, camel.color.toString());

    this.nextTurn();
  }

  placeLoserBet(playerName: string, camel: Camel): void {
    this.ensureGameIsActive();
    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    if (!this.playerHasTurn(playerIndex)) {
      throw new Error("It is not your turn");
    }

    this.players[playerIndex]?.availableActions.switchLoserBet(camel.color);
    this.cardStorage.addLoser(playerName, camel.color.toString());

    this.nextTurn();
  }

  takeRoundBet(playerName: string, camel: Camel): void {
    this.ensureGameIsActive();
    const playerIndex = this.getPlayerIndexByName(playerName);

    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    if (!this.playerHasTurn(playerIndex)) {
      throw new Error("It is not your turn");
    }

    if (!this.cardStorage.shouldGrabCard(camel.color.toString())) {
      throw new Error("No cards remaining for this camel");
    }

    const grabbedCard = this.cardStorage.grabCard(camel.color.toString());
    if (!grabbedCard) throw new Error("There is a bug on the game!!!.");

    const rewardTable = generatePayoutTable(grabbedCard);

    const card = new Card(BetType.TurnWinner, camel, rewardTable);

    this.players[playerIndex]?.addCard(card);

    this.nextTurn();
  }

  private ensureGameIsActive(): void {
    if (this.phase === GamePhase.Finished) {
      throw new Error("Game has already finished");
    }
  }

  playerHasTurn(index: number): boolean {
    return this.currentPlayer === index;
  }

  endRound() {
    this.calculateRoundIncomes();
    this.addRound();
    this.cardStorage.resetStoredCards();

    const playersLength = this.players.length - 1;
    for (let i = 0; i < playersLength; i++) {
      this.players[playersLength]?.resetCardStorage();
    }
  }

  endGame() {
    this.calculateRoundIncomes();
    this.calculateGameIncomes();
    this.phase = GamePhase.Finished;

    const playersLength = this.players.length - 1;

    for (let i = 0; i < playersLength; i++) {
      this.players[i]?.availableActions.switchRollDice();
    }
  }

  private nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    this.currentTurn++;
  }
}