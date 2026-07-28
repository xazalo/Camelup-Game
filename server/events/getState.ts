import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, serializeGame } from "../../helpers/index.js";
import { Game} from "../../engine/models/index.js";

export default function getState(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("getState", ({ gameId }) => {
    try {
      io.to(gameId).emit("gameLog", log("------Getting game state------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        io.to(gameId).emit("gameLog", log(controller, "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const gameState = manager.getGame(gameId);

      if (typeof gameState === "string" || gameState === null) {
        io.to(gameId).emit("gameLog", log(gameState, "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const parsedGame = serializeGame(gameState.game as Game)

      io.to(gameId).emit("gameState", parsedGame);

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
