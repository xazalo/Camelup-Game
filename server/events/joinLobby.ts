import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function joinLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinLobby", ({ gameId, playerName }) => {
    const lobby = manager.getLobby(gameId);

    if (!lobby) {
      socket.emit("error", "Lobby not found");
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
  });
}