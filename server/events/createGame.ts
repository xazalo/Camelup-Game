import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function createGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("createGame", ({ players }) => {
    const { gameId, game } = manager.createGame();

    const result = game.startGame(players, gameId);

    socket.join(gameId);

    socket.emit("gameCreated", {
      gameId,
      result,
      state: game.getState(),
    });
  });
}