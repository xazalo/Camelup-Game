import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

import { authorizePlayer } from "../operations/lobby/index.js";
import { syncGame } from "../operations/game/index.js";

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

        const controller = authorizePlayer(
          io,
          manager,
          gameId,
          playerName,
          playerId,
        );

        if (!controller) {
          io.to(gameId).emit(
            "gameLog",
            log("------FINISHED------", "finished"),
          );
          return;
        }

        const result = await controller.placeWinnerBet(
          playerName,
          camelColor,
        );

        io.to(gameId).emit("gameLog", result);

        syncGame(io, gameId, controller);

        io.to(gameId).emit(
          "gameLog",
          log("------FINISHED------", "finished"),
        );
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