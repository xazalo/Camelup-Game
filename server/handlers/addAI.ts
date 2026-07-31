import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

import getLobby from "../operations/lobby/get_lobby.js";
import getPlayers from "../operations/lobby/get_players.js";

export default function addAI(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("addAI", ({ gameId }) => {
    try {
      const lobby = getLobby(io, manager, gameId);

      if (!lobby) {
        return;
      }

      const players = getPlayers(io, gameId, lobby);

      if (!players) {
        return;
      }

      if (players.length >= 6) {
        socket.emit(
          "gameLog",
          log("The game has the maximum number of players", "error"),
        );
        return;
      }

      if (players.length === 0) {
        socket.emit("gameLog", log("No players in the lobby", "error"));
        return;
      }

      const result = lobby.addAI();

      io.to(gameId).emit("lobbyUpdated", {
        result,
        players: lobby.getPlayers(),
      });

      io.to(gameId).emit("gameLog", log("Added AI player", "info"));

      io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
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
