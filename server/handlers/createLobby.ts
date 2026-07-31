import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";
import type { PlayerConfig } from "../../engine/types/index.js";

export default function createLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("createLobby", (player: PlayerConfig) => {
    try {
      socket.emit(
        "gameLog",
        log("------Creating lobby------", "started", player.name),
      );

      const lobbyId = manager.createLobby(player, socket.id);

      const lobby = manager.getLobby(lobbyId);

      if (typeof lobby === "string") {
        socket.emit("gameLog", lobby);
        socket.emit(
          "gameLog",
          log("------FINISHED------", "finished"),
        );
        return;
      }

      socket.join(lobbyId);

      const players = lobby.getPlayers();

      if (typeof players === "string") {
        socket.emit("gameLog", players);
        socket.emit(
          "gameLog",
          log("------FINISHED------", "finished"),
        );
        return;
      }

      socket.emit("lobbyCreated", {
        id: lobbyId,
        players,
      });

      socket.emit(
        "gameLog",
        log("Lobby has been created", "success"),
      );

      socket.emit(
        "gameLog",
        log("------FINISHED------", "finished"),
      );
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error
            ? error.message
            : "Could not create lobby",
          "error",
        ),
      );
    }
  });
}