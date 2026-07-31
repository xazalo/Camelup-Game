import { Server } from "socket.io";
import GameManager from "../../GameManager.js";
import { isPlayerValid, log } from "../../../helpers/index.js";

export default function authorizePlayer(
    io: Server,
    manager: GameManager,
    gameId: string,
    playerName: string,
    playerId: string,
) {
    const controller = manager.getGame(gameId);

    if (typeof controller === "string") {
        io.to(gameId).emit("gameLog", controller);
        io.to(gameId).emit(
            "gameLog",
            log("------FINISHED------", "finished"),
        );

        return null;
    }

    if (!isPlayerValid(controller, playerName, playerId)) {
        io.to(gameId).emit(
            "gameLog",
            log("unauthorized", "error"),
        );

        return null;
    }

    return controller;
}