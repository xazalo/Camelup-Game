import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function placeWinnerBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("placeWinnerBet", ({ gameId, playerName, camelColor }) => {
    const controller = manager.getGame(gameId);

    if (!controller) {
      socket.emit("error", "Game not found");
      return;
    }

    const result = controller.placeWinnerBet(playerName, camelColor);

    socket.emit("actionResult", result);

    io.to(gameId).emit("gameState", controller.getState());
  });
}