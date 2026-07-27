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
        socket.emit("gameLog", log("------Taking round bet------", "started"));

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          socket.emit("gameLog", log(controller, "error"));
          socket.emit("gameLog", log("------FINISHED------", "finished"));
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if (!allowed) {
          socket.emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.takeRoundBet(playerName, camelColor);

        socket.emit("gameLog", log(result, "log"));

        const gameState = manager.getGame(gameId);

        if (typeof gameState === "string" || gameState === null) {
          socket.emit("gameLog", log(gameState, "error"));
          socket.emit("gameLog", log("------FINISHED------", "finished"));
          return;
        }

        const parsedGame = serializeGame(gameState.game as Game);

        socket.emit("gameState", parsedGame);
        socket.emit("gameLog", log("------FINISHED------", "finished"));
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
