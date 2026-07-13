import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function rollTheDice(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("rollTheDice", ({ gameId, playerName }) => {
    const controller = manager.getGame(gameId);

    if (!controller) {
      socket.emit("error", "Game not found");
      return;
    }

    const result = controller.rollTheDice(playerName);

    socket.emit("actionResult", result);

    io.to(gameId).emit("gameState", controller.getState());
  });
}