import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function placeTile(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("placeTile", ({ gameId, playerName, position, tileType }) => {
    try {
      const controller = manager.getGame(gameId);

      if (!controller) {
        socket.emit("gameError", {
          message: "Game not found",
        });
        return;
      }

      const result = controller.placeTile(
        playerName,
        position,
        tileType,
      );

      socket.emit("actionResult", result);

      io.to(gameId).emit("gameState", controller.getState());

    } catch (error) {
      socket.emit("gameError", {
        message: error instanceof Error
          ? error.message
          : "Could not place tile",
      });
    }
  });
}