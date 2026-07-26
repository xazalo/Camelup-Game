import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../cli/helpers/logger.js";

export default function startGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("startGame", async ({ gameId }) => {
    try {
      socket.emit("gameLog", log("------Starting game------", "started"));

      const game = manager.startGame(gameId);

      if (typeof game === "string") {
        socket.emit("gameLog", log(game, "error"));
        return;
      }

      socket.join(gameId);

      io.to(gameId).emit("gameStarted", {
        state: manager.getGame(gameId),
      });

      io.to(gameId).emit("launchGame");

      socket.emit("gameLog", log("Game has been started", "log"));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not start game",
          "error",
        ),
      );
    }
  });
}
