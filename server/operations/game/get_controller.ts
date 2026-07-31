// operations/game/get_controller.ts
import GameManager from "../../GameManager.js";
import { Server } from "socket.io";

export default function getController(
  io: Server,
  manager: GameManager,
  gameId: string,
) {
  const controller = manager.getGame(gameId);

  if (typeof controller === "string") {
    io.to(gameId).emit("gameLog", controller);
    return null;
  }

  return controller;
}