import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function addAI(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("addAI", ({ gameId }) => {
    try {
      const lobby = manager.getLobby(gameId);

      if (typeof lobby === "string") {
        io.to(gameId).emit("gameLog", lobby);
        return;
      }

      const players = lobby?.getPlayers();

      if (typeof players === "string" || typeof players) {
        io.to(gameId).emit("gameLog", players);
        return;
      }

      if (players?.length as number >= 6) {
        socket.emit(
          "gameLog",
          log("The game has the maximum number of players", "error"),
        );
        return;
      }

      socket.emit(
        "gameLog",
        log("------Adding AI player------", "started", players[0]!.name),
      );

      if (!lobby) {
        io.to(gameId).emit("gameLog", log("Lobby not found", "error"));
        return;
      }

      const result = lobby.addAI();

      io.to(gameId).emit("lobbyUpdated", {
        result,
        players: lobby.getPlayers(),
      });

      io.to(gameId).emit(
        "gameLog",
        log("Added AI player", "info"),
      );

      io.to(gameId).emit(
        "gameLog",
        log("------FINISHED------", "finished"),
      );
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