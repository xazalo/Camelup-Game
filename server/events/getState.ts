import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function getState(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("getState", ({ gameId }) => {
    const controller = manager.getGame(gameId);

    if (!controller) {
      socket.emit("error", "Game not found");
      return;
    }

    socket.emit("gameState", controller.getState());
  });
}