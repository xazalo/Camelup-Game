import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

import addAI from "./addAI.js";
import createGame from "./createGame.js";
import createLobby from "./createLobby.js";
import getState from "./getState.js";
import joinGame from "./joinGame.js";
import joinLobby from "./joinLobby.js";
import placeLoserBet from "./placeLoserBet.js";
import placeTile from "./placeTile.js";
import placeWinnerBet from "./placeWinnerBet.js";
import rollDice from "./rollTheDice.js";
import startGame from "./startGame.js";
import takeRoundBet from "./takeRoundBet.js";

export default function registerEvents(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  addAI(io, socket, manager);
  createLobby(io, socket, manager);
  joinLobby(io, socket, manager);
  startGame(io, socket, manager);
  createGame(io, socket, manager);
  joinGame(io, socket, manager);
  rollDice(io, socket, manager);
  placeTile(io, socket, manager);
  placeLoserBet(io, socket, manager);
  placeWinnerBet(io, socket, manager);
  takeRoundBet(io, socket, manager);
  getState(io, socket, manager);
}
