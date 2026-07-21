import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";

export default function createLobby(
  io: Server,
  socket: Socket,
  manager: GameManager,
) {
  socket.on("createLobby", () => {
    const lobbyId = manager.createLobby();

    socket.join(lobbyId);

    socket.emit("lobbyCreated", {
      lobbyId,
    });
  });
}