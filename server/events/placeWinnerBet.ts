import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, isPlayerValid, serializeGame } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";

export default function placeWinnerBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on(
    "placeWinnerBet",
    async ({ gameId, playerName, playerId, camelColor }) => {
      try {
        socket.emit(
          "gameLog",
          log("------Placing winner bet------", "started", playerName),
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

        const result = await controller.placeWinnerBet(playerName, camelColor);

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
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
      } catch (error) {
        socket.emit(
          "gameLog",
          log(
            error instanceof Error
              ? error.message
              : "Could not place winner bet",
            "error",
          ),
        );
      }
    },
  );
}
