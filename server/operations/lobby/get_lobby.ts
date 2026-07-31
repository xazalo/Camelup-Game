import { Server } from "socket.io";
import GameManager from "../../GameManager.js";

export default function getLobby(
  io: Server,
  manager: GameManager,
  gameId: string,
) {
  const lobby = manager.getLobby(gameId);

  if (typeof lobby === "string") {
    io.to(gameId).emit("gameLog", lobby);
    return null;
  }

  return lobby;
}