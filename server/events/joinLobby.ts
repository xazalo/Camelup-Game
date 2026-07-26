import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../cli/helpers/logger.js";

export default function joinLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinLobby", ({ gameId, playerName }) => {
    try {
      socket.emit("gameLog", log("------Joining lobby------", "started"));

      const lobby = manager.getLobby(gameId);

      if (typeof lobby === "string") {
        socket.emit("gameLog", log(lobby, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const players = lobby.getPlayers();

      if (typeof players === "string") {
        socket.emit("gameLog", log(players, "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      if (!players) {
        socket.emit("gameLog", log("Not players", "error"));
        socket.emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const nameExists = lobby.playerExists(playerName);

      if (nameExists) {
        socket.emit(
          "gameLog",
          log("A player with that name already exists", "error"),
        );
        return;
      }

      const addedPlayer = lobby.addPlayer({
        name: playerName,
        isAI: false,
      });

      socket.join(gameId);

      socket.emit("lobbyJoined", {
        lobbyId: gameId,
        playerName,
      });

      io.to(gameId).emit("lobbyUpdated", {
        addedPlayer,
        players: lobby.getPlayers(),
      });

      socket.emit("gameLog", log("Player has been joined the lobby", "log"));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not join lobby",
          "error",
        ),
      );
    }
  });
}
