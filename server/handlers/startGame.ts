import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

import { assignPlayerIds } from "../operations/game/index.js";
import { emitGameStarted } from "../operations/lobby/index.js";

export default function startGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("startGame", async ({ gameId }) => {
    try {
      io.to(gameId).emit(
        "gameLog",
        log("------Starting game------", "started"),
      );

      const lobby = manager.getLobby(gameId);
      const controller = await manager.startGame(gameId);

      if (typeof lobby === "string") {
        socket.emit("gameLog", lobby);
        return;
      }

      if (typeof controller === "string") {
        socket.emit("gameLog", controller);
        return;
      }

      const error = assignPlayerIds(io, lobby, controller);

      if (error) {
        socket.emit("gameLog", error);
        return;
      }

      socket.join(gameId);

      emitGameStarted(io, gameId, controller);

      io.to(gameId).emit("gameLog", log("Game has been started", "log"));

      io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not start game",
          "error",
        ),
      );
    }
  });
}
