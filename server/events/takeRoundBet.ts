import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function takeRoundBet(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("takeRoundBet", async ({ gameId, playerName, camelColor }) => {
    try {
      socket.emit("gameLog", log("------Taking round bet------", "started"));

      const controller = manager.getGame(gameId);

      if (typeof controller === "string") {
        socket.emit("gameLog", log(controller, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const result = await controller.takeRoundBet(playerName, camelColor);

      socket.emit("gameLog", log(result, "log"));

      io.to(gameId).emit("gameState", manager.getGame(gameId));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not take round bet",
          "error",
        ),
      );
    }
  });
}