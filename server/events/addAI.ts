import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function addAI(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("addAI", ({ gameId }) => {
    const lobby = manager.getLobby(gameId);

    if (!lobby) {
      socket.emit("error", "Lobby not found");
      return;
    }

    const result = lobby.addAI();

    io.to(gameId).emit("lobbyUpdated", {
      result,
      players: lobby.getPlayers(),
    });
  });
}