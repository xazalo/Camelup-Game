import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function addAI(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("addAI", ({ gameId }) => {
    try {
      const lobby = manager.getLobby(gameId);
      const players = lobby?.getPlayers();

      if (players?.length! >= 6) {
        socket.emit("lobbyError", {
          message: "The game has the maximum number of players",
        });
        return;
      }

      if (!lobby) {
        socket.emit("lobbyError", {
          message: "Lobby not found",
        });
        return;
      }

      const result = lobby.addAI();

      io.to(gameId).emit("lobbyUpdated", {
        result,
        players: lobby.getPlayers(),
      });
    } catch (error) {
      socket.emit("lobbyError", {
        message: "Could not add AI player",
      });
    }
  });
}
