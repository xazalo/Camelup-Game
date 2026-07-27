import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";
import { isPlayerValid } from "../../helpers/index.js";

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

      io.to(gameId).emit("gameState", manager.getGame(gameId));

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
