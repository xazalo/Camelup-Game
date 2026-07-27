import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

export default function startGame(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("startGame", async ({ gameId }) => {
    try {
      socket.emit("gameLog", log("------Starting game------", "started"));

      const lobby = manager.getLobby(gameId);
      const game = await manager.startGame(gameId);

      if (typeof lobby === "string") {
        socket.emit("gameLog", log(lobby, "error"));
        return;
      }

      if (typeof game === "string") {
        socket.emit("gameLog", log(game, "error"));
        return;
      }

      const lobbyPlayers = lobby.getPlayers();

      if (typeof lobbyPlayers === "string") {
        socket.emit("gameLog", log(lobbyPlayers, "error"));
        return;
      }

      for (const lobbyPlayer of lobbyPlayers) {
        if (lobbyPlayer.isAI) continue;

        if(!game.game) {
          console.log("Game is null X/")
          return
        }

        const gamePlayer = game.game.players.find(
          (p) => p.name === lobbyPlayer.name,
        );

        if (!gamePlayer) continue;

        if (gamePlayer.isAI === true) continue;

        io.to(lobbyPlayer.socketId).emit("playerId", {
          playerId: gamePlayer.getId(),
        });
      }

      socket.join(gameId);

      io.to(gameId).emit("gameStarted", {
        state: manager.getGame(gameId),
      });

      io.to(gameId).emit("launchGame");

      socket.emit("gameLog", log("Game has been started", "log"));
      socket.emit("gameLog", log("------FINISHED------", "finished"));
    } catch (error) {
      socket.emit(
        "gameLog",
        log(
          error instanceof Error ? error.message : "Could not start game",
          "error",
        ),
      );
    }
  });
}
