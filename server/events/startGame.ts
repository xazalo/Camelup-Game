import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function startGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("startGame", async ({ gameId }) => {
    const game = manager.startGame(gameId);

    if (!game) {
      socket.emit("error", "Cannot start game");
      return;
    }

    socket.join(gameId);

    io.to(gameId).emit("gameStarted", {
      state: game.getState(),
    });
  });
}