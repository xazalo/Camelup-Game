import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

import createGame from "./createGame.js";
import joinGame from "./joinGame.js";
import rollDice from "./rollTheDice.js";
import placeTile from "./placeTile.js";
import placeLoserBet from "./placeLoserBet.js";
import placeWinnerBet from "./placeWinnerBet.js";
import takeRoundBet from "./takeRoundBet.js";
import getState from "./getState.js";

export default function registerEvents(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  createGame(io, socket, manager);
  joinGame(io, socket, manager);
  rollDice(io, socket, manager);
  placeTile(io, socket, manager);
  placeLoserBet(io, socket, manager);
  placeWinnerBet(io, socket, manager);
  takeRoundBet(io, socket, manager);
  getState(io, socket, manager);
}
