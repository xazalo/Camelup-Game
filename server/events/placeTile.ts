import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, isPlayerValid, serializeGame } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";

export default function placeTile(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on(
    "placeTile",
    async ({ gameId, playerName, playerId, position, tileType }) => {
      try {
        socket.emit("gameLog", log("------Placing tile------", "started"));

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          socket.emit("gameLog", log("Game not found", "error"));
          socket.emit("gameLog", log("------FINISHED------", "finished"));
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if (!allowed) {
          socket.emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.placeTile(
          playerName,
          position,
          tileType,
        );

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
            error instanceof Error ? error.message : "Could not place tile",
            "error",
          ),
        );
      }
    },
  );
}
