import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log, serializeGame, isPlayerValid } from "../../helpers/index.js";
import { Game } from "../../engine/models/index.js";


export default function placeLoserBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on(
    "placeLoserBet",
    async ({ gameId, playerName, playerId, camelColor }) => {
      try {
        io.to(gameId).emit("gameLog", log("------Placing loser bet------", "started", playerName));

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          io.to(gameId).emit("gameLog", log("Game not found", "error"));
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if (!allowed) {
          io.to(gameId).emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.placeLoserBet(playerName, camelColor);

        io.to(gameId).emit("gameLog", log(result, "info"));

        const gameState = manager.getGame(gameId);

        if (typeof gameState === "string" || gameState === null) {
          io.to(gameId).emit("gameLog", log(gameState, "error"));
          io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
          return;
        }

        const parsedGame = serializeGame(gameState.game as Game);

        io.to(gameId).emit("gameState", parsedGame);
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
      } catch (error) {
        socket.emit(
          "gameLog",
          log(
            error instanceof Error
              ? error.message
              : "Could not place loser bet",
            "error",
          ),
        );
      }
    },
  );
}
