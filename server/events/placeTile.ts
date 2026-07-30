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
        io.to(gameId).emit(
          "gameLog",
          log("------Placing tile------", "started", playerName),
        );

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          io.to(gameId).emit("gameLog", log("Game not found", "error"));
          io.to(gameId).emit(
            "gameLog",
            log("------FINISHED------", "finished"),
          );
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if (!allowed) {
          io.to(gameId).emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.placeTile(
          playerName,
          position,
          tileType,
        );

        io.to(gameId).emit("gameLog", result);

        const gameState = manager.getGame(gameId);

        if (typeof gameState === "string") {
          io.to(gameId).emit("gameLog", gameState);
          io.to(gameId).emit(
            "gameLog",
            log("------FINISHED------", "finished"),
          );
          return;
        }

        if (gameState === null) {
          io.to(gameId).emit("gameLog", log("Game is null", "error"));
          io.to(gameId).emit(
            "gameLog",
            log("------FINISHED------", "finished"),
          );
          return;
        }

        const parsedGame = serializeGame(gameState.game as Game);

        const currentPlayer = gameState.getCurrentPlayer();

        io.to(gameId).emit("currentPlayer", currentPlayer);

        io.to(gameId).emit("gameState", parsedGame);

        if ((controller.game?.phase as number) === 2) {
          const winner = controller.getPlayerWithMoreMoney();
          io.to(gameId).emit("winner", winner);
        }

        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
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
