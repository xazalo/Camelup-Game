import { Server } from "socket.io";
import GameController from "../../../cli/controllers/GameController.js";
import { serializeGame } from "../../../helpers/index.js";
import { Game } from "../../../engine/models/index.js";

export default function emitGameStarted(
    io: Server,
    gameId: string,
    controller: GameController,
) {
    io.to(gameId).emit("gameStarted", {
        state: serializeGame(controller.game as Game),
    });

    io.to(gameId).emit("launchGame");

    io.to(gameId).emit(
        "currentPlayer",
        controller.getCurrentPlayer(),
    );
}