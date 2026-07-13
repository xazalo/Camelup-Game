import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function takeRoundBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("takeRoundBet", ({ gameId, playerName, camelColor }) => {
    const controller = manager.getGame(gameId);

    if (!controller) {
      socket.emit("error", "Game not found");
      return;
    }

    const result = controller.takeRoundBet(playerName, camelColor);

    socket.emit("actionResult", result);

    io.to(gameId).emit("gameState", controller.getState());
  });
}