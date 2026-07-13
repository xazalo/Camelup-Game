import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function joinGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("joinGame", ({ gameId }) => {
    const controller = manager.getGame(gameId);

    if (!controller) {
      socket.emit("error", "Game not found");
      return;
    }

    socket.join(gameId);

    socket.emit("gameState", controller.getState());
  });
}