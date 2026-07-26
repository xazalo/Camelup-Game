import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../cli/helpers/logger.js";

export default function addAI(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("addAI", ({ gameId }) => {
    try {
      socket.emit("gameLog", log("------Adding AI player------", "started"));

      const lobby = manager.getLobby(gameId);

      if (typeof lobby === "string") {
        socket.emit("gameLog", log(lobby, "error"));
        return;
      }

      const players = lobby?.getPlayers();

      if (players?.length! >= 6) {
        socket.emit(
          "gameLog",
          log("The game has the maximum number of players", "error"),
        );
        return;
      }

      if (!lobby) {
        socket.emit("gameLog", log("Lobby not found", "error"));
        return;
      }

      const result = lobby.addAI();

      io.to(gameId).emit("lobbyUpdated", {
        result,
        players: lobby.getPlayers(),
      });

      socket.emit("gameLog", log("Added AI player", "log"));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not add AI player",
          "error",
        ),
      );
    }
  });
}
