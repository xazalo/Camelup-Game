import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, serializeGame } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";

export default function joinGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinGame", ({ gameId }) => {
    try {
      io.to(gameId).emit(
        "gameLog",
        log("------Joining game------", "started"),
      );

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        io.to(gameId).emit("gameLog", controller);
        io.to(gameId).emit(
          "gameLog",
          log("------FINISHED------", "finished"),
        );
        return;
      }

      socket.join(gameId);

      socket.emit(
        "gameState",
        serializeGame(controller.game as Game),
      );

      io.to(gameId).emit(
        "gameLog",
        log("Player has been joined the game", "log"),
      );

      io.to(gameId).emit(
        "gameLog",
        log("------FINISHED------", "finished"),
      );
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error
            ? error.message
            : "Could not join game",
          "error",
        ),
      );
    }
  });
}