import { Server } from "socket.io";
import GameController from "../../../cli/controllers/GameController.js";
import GameLobby from "../../GameLobby.js";
import { log } from "../../../helpers/index.js";

export default function assignPlayerIds(
    io: Server,
    lobby: GameLobby,
    controller: GameController,
): string | null {
    if (!controller.game) {
        return log("Game is null", "error");
    }

    const lobbyPlayers = lobby.getPlayers();

    if (typeof lobbyPlayers === "string") {
        return lobbyPlayers;
    }

    for (const lobbyPlayer of lobbyPlayers) {
        if (lobbyPlayer.isAI) continue;

        const gamePlayer = controller.game.players.find(
            (player) => player.name === lobbyPlayer.name,
        );

        if (!gamePlayer || gamePlayer.isAI) continue;

        io.to(lobbyPlayer.socketId).emit("playerId", {
            playerId: gamePlayer.getId(),
        });
    }

    return null;
}