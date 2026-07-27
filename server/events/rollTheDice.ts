import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, isPlayerValid, serializeGame } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";

export default function rollTheDice(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("rollTheDice", async ({ gameId, playerName, playerId }) => {
    try {
      socket.emit("gameLog", log("------Rolling the dice------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log(controller, "error"));
        return;
      }

      const allowed = isPlayerValid(controller, playerName, playerId);

      if (!allowed) {
        socket.emit("gameLog", log("unauthorized", "error"));
        return;
      }

      const result = await controller.rollTheDice(playerName);

      socket.emit("gameLog", result);

      const gameState = manager.getGame(gameId);

      if (typeof gameState === "string" || gameState === null) {
        socket.emit("gameLog", log(gameState, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const parsedGame = serializeGame(gameState.game as Game);

      socket.emit("gameState", parsedGame);

      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error: unknown) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not roll the dice",
          "error",
        ),
      );
    }
  });
}
