import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import type { PlayerConfig } from "../../engine/types/index.js";

export default function createLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("createLobby", (player: PlayerConfig) => {
    try {
      const lobbyId = manager.createLobby(player);

      const lobby = manager.getLobby(lobbyId);

      if (!lobby) {
        socket.emit("lobbyError", {
          message: "Lobby not found",
        });
        return;
      }

      socket.join(lobbyId);

      socket.emit("lobbyCreated", {
        lobbyId,
        players: lobby.getPlayers(),
      });
    } catch (error) {
      socket.emit("lobbyError", {
        message: "Could not create lobby",
      });
    }
  });
}
