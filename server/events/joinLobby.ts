import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function joinLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinLobby", ({ gameId, playerName }) => {
    try {
      io.to(gameId).emit("gameLog", log("------Joining lobby------", "started", playerName));

      const lobby = manager.getLobby(gameId);

      if (typeof lobby === "string") {
        io.to(gameId).emit("gameLog", log(lobby, "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      const players = lobby.getPlayers();

      if (typeof players === "string") {
        io.to(gameId).emit("gameLog", log(players, "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
        return;
      }

      if (!players) {
        io.to(gameId).emit("gameLog", log("Not players", "error"));
        io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
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
        socketId: socket.id,
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

      io.to(gameId).emit("gameLog", log("Player has been joined the lobby", "log"));
      io.to(gameId).emit("gameLog", log("------FINISHED------", "finished"));
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
