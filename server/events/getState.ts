import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function getState(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("getState", ({ gameId }) => {
    try {
      socket.emit("gameLog", log("------Getting game state------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log(controller, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      socket.emit("gameState", manager.getGame(gameId));

      socket.emit("gameLog", log("Got game state", "log"));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
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
