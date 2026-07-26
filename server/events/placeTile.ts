import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../cli/helpers/logger.js";

export default function placeTile(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("placeTile", async ({ gameId, playerName, position, tileType }) => {
    try {
      socket.emit("gameLog", log("------Placing tile------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log("Game not found", "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const result = await controller.placeTile(playerName, position, tileType);

      socket.emit("gameLog", log(result, "log"));

      io.to(gameId).emit("gameState", manager.getGame(gameId));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not place tile",
          "error",
        ),
      );
    }
  });
}
