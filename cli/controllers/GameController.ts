import Game from "../../engine/models/Game.js";
import Board from "../../engine/models/Board.js";
import Player from "../../engine/models/Player.js";
import CardStorage from "../../engine/models/CardStorage.js";

export default class GameController {
  game: Game | null = null;

  startGame(playerNames: string[]) {
    const board = new Board(16);
    const cardStorage = new CardStorage();

    const players = playerNames.map((name) => new Player(name));

    if (players.length < 2 || players.length > 6) {
      return "This Game must have between 2 and 6 players"
    } else {
      this.game = new Game(board, players, [], cardStorage);
      return "Game started";
    }
  }

  getState() {
    return this.game;
  }
}
