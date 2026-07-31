import { Server } from "socket.io";
import { serializeGame } from "../../../helpers/index.js";
import { Game } from "../../../engine/models/index.js";
import GameController from "../../../cli/controllers/GameController.js";

export default function syncGame(
    io: Server,
    gameId: string,
    controller: GameController,
) {
    io.to(gameId).emit(
        "currentPlayer",
        controller.getCurrentPlayer(),
    );

    io.to(gameId).emit(
        "gameState",
        serializeGame(controller.game as Game),
    );

    if (controller.game?.phase === 2) {
        io.to(gameId).emit(
            "winner",
            controller.getPlayerWithMoreMoney(),
        );
    }
}