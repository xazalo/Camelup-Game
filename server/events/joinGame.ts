import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../cli/helpers/logger.js";

export default function joinGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinGame", ({ gameId }) => {
    try {
      socket.emit("gameLog", log("------Joining game------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log(controller, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      socket.join(gameId);

      socket.emit("gameState", manager.getGame(gameId));

      
      socket.emit("gameLog", log("Player has been joined the game", "log"))
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not join game",
          "error",
        ),
      );
    }
  });
}