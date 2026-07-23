import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function placeLoserBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("placeLoserBet", ({ gameId, playerName, camelColor }) => {
    try {
      const controller = manager.getGame(gameId);

      if (!controller) {
        socket.emit("gameError", {
          message: "Game not found",
        });
        return;
      }

      const result = controller.placeLoserBet(
        playerName,
        camelColor,
      );

      socket.emit("actionResult", result);

      io.to(gameId).emit("gameState", controller.getState());

    } catch (error) {
      socket.emit("gameError", {
        message: error instanceof Error
          ? error.message
          : "Could not place loser bet",
      });
    }
  });
}