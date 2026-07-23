import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function createGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("createGame", ({ players }) => {
    try {
      const { gameId, game } = manager.createGame();

      const gameLobby = manager.getLobby(gameId);

      if(!gameLobby) {
        socket.emit("gameError", {
          message: "Lobby not exist"
        })
      }

      const result = game.startGame(players, gameId);

      socket.join(gameId);

      socket.emit("gameCreated", {
        gameId,
        result,
        state: game.getState(),
      });
    } catch (error) {
      socket.emit("gameError", {
        message: "Error creating game",
      });
    }
  });
}
