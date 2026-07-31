import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, serializeGame } from "../../helpers/index.js";

export default function getState(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("getState", ({ gameId }) => {
    try {
      io.to(gameId).emit(
        "gameLog",
        log("------Getting game state------", "started"),
      );

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        io.to(gameId).emit("gameLog", controller);
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      if (!controller.game) {
        io.to(gameId).emit("gameLog", log("Game is null", "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      io.to(gameId).emit("gameState", serializeGame(controller.game));

      io.to(gameId).emit("gameLog", log("Got game state", "log"));

      io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not get game state",
          "error",
        ),
      );
    }
  });
}
