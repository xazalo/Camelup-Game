import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function placeWinnerBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("placeWinnerBet", async ({ gameId, playerName, camelColor }) => {
    try {
      socket.emit("gameLog", log("------Placing winner bet------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log("Game not found", "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const result = await controller.placeWinnerBet(playerName, camelColor);

      socket.emit("gameLog", log(result, "log"));

      io.to(gameId).emit("gameState", manager.getGame(gameId));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not place winner bet",
          "error",
        ),
      );
    }
  });
}
