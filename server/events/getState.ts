import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function getState(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("getState", ({ gameId }) => {
    try {
      const controller = manager.getGame(gameId);

      if (!controller) {
        socket.emit("gameError", {
          message: "Game not found",
        });
        return;
      }

      socket.emit("gameState", controller.getState());

    } catch (error) {
      socket.emit("gameError", {
        message: "Could not get game state",
      });
    }
  });
}