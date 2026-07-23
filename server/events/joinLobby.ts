import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function joinLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinLobby", ({ gameId, playerName }) => {
    try {
      const lobby = manager.getLobby(gameId);

      if (!lobby) {
        socket.emit("lobbyError", {
          message: "Lobby not found",
        });
        return;
      }

      const nameExists = lobby
        .getPlayers()
        .some(
          (player) => player.name.toLowerCase() === playerName.toLowerCase(),
        );

      if (nameExists) {
        socket.emit("lobbyError", {
          message: "A player with that name already exists",
        });
        return;
      }

      const result = lobby.addPlayer({
        name: playerName,
        isAI: false,
      });

      socket.join(gameId);

      io.to(gameId).emit("lobbyUpdated", {
        result,
        players: lobby.getPlayers(),
      });
    } catch (error) {
      socket.emit("lobbyError", {
        message: "Could not join lobby",
      });
    }
  });
}
