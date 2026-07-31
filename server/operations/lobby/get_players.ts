import { Server } from "socket.io";
import GameLobby from "../../GameLobby.js";
import { log } from "../../../helpers/logger.js";

export default function getPlayers(
  io: Server,
  gameId: string,
  lobby: GameLobby,
) {
  const players = lobby.getPlayers();

  if (typeof players === "string") {
    io.to(gameId).emit("gameLog", players);
    return null;
  }

  if (!players) {
    io.to(gameId).emit(
      "gameLog",
      log("No players", "error"),
    );
    return null;
  }

  return players;
}