import { Server, Socket } from "socket.io";
import GameManager from "../GameManager.js";
import { log } from "../../helpers/index.js";

import { syncGame } from "../operations/game/index.js"
import { authorizePlayer } from "../operations/lobby/index.js";

export default function takeRoundBet(
    io: Server,
    socket: Socket,
    manager: GameManager,
) {
    socket.on(
        "takeRoundBet",
        async ({ gameId, playerName, playerId, camelColor }) => {
            try {
                io.to(gameId).emit(
                    "gameLog",
                    log("------Taking round bet------", "started"),
                );

                const controller = authorizePlayer(
                    io,
                    manager,
                    gameId,
                    playerName,
                    playerId,
                );

                if (!controller) return;

                const result = await controller.takeRoundBet(
                    playerName,
                    camelColor,
                );

                io.to(gameId).emit("gameLog", result);

                syncGame(io, gameId, controller);

                io.to(gameId).emit(
                    "gameLog",
                    log("------FINISHED------", "finished"),
                );
            } catch (error) {
                socket.emit(
                    "gameLog",
                    log(
                        error instanceof Error
                            ? error.message
                            : "Could not take round bet",
                        "error",
                    ),
                );
            }
        },
    );
}