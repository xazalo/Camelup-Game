import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";
import { isPlayerValid } from "../../helpers/index.js";

export default function placeLoserBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on(
    "placeLoserBet",
    async ({ gameId, playerName, playerId, camelColor }) => {
      try {
        socket.emit("gameLog", log("------Placing loser bet------", "started"));

        const controller = manager.getGame(gameId);

        if (typeof controller === "string") {
          socket.emit("gameLog", log("Game not found", "error"));
          return;
        }

        const allowed = isPlayerValid(controller, playerName, playerId);

        if(!allowed) {
            socket.emit("gameLog", log("unauthorized", "error"));
          return;
        }

        const result = await controller.placeLoserBet(playerName, camelColor);

        socket.emit("gameLog", log(result, "log"));

        io.to(gameId).emit("gameState", manager.getGame(gameId));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
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
