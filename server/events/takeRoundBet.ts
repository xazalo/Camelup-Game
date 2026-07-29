import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, isPlayerValid, serializeGame } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";

export default function takeRoundBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on(
    "takeRoundBet",
    async ({ gameId, playerName, playerId, camelColor }) => {
      try {
        io.to(gameId).emit("gameLog", log("------Taking round bet------", "started"));

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          io.to(gameId).emit("gameLog", log(controller, "error"));
          io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if (!allowed) {
          io.to(gameId).emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.takeRoundBet(playerName, camelColor);

        io.to(gameId).emit("gameLog", log(result, "info"));

        const gameState = manager.getGame(gameId);

        if (typeof gameState === "string" || gameState === null) {
          io.to(gameId).emit("gameLog", log(gameState, "error"));
          io.to(gameId).emit("gameLog", log("------FINISHED------", "finished", playerName));
          return;
        }

        const parsedGame = serializeGame(gameState.game as Game);

        io.to(gameId).emit("gameState", parsedGame);
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
      } catch (error) {
        socket.emit(
          "gameLog",
          log(
            error instanceof Error ? error.message : "Could not take round bet",
            "error",
          ),
        );
      }
    },
  );
}
