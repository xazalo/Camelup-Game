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
      socket.emit("gameLog", log("------Joining game------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log(controller, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      socket.join(gameId);

      const gameState = manager.getGame(gameId);

      if (typeof gameState === "string" || gameState === null) {
        socket.emit("gameLog", log(gameState, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const parsedGame = serializeGame(gameState.game as Game);

      socket.emit("gameState", parsedGame);

      socket.emit("gameLog", log("Player has been joined the game", "log"));
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
