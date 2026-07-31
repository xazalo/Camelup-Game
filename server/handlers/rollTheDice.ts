import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

import { authorizePlayer } from "../operations/lobby/index.js";
import { syncGame } from "../operations/game/index.js";

export default function rollTheDice(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("rollTheDice", async ({ gameId, playerName, playerId }) => {
    try {
      io.to(gameId).emit(
        "gameLog",
        log("------Rolling the dice------", "started", playerName),
      );

      const controller = authorizePlayer(
        io,
        manager,
        gameId,
        playerName,
        playerId,
      );

      if (!controller) return;

      const result = await controller.rollTheDice(playerName);

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
            : "Could not roll the dice",
          "error",
        ),
      );
    }
  });
}