import GameController from "../cli/controllers/GameController.js";

export default function isPlayerValid(
  controller: GameController,
  playerName: string,
  playerId: string,
): boolean | string {
  const playerIndex = controller.game?.getPlayerIndexByName(playerName);

  if (!playerIndex) return "There is a bug at the index in valid player";

  const isPlayerValid = controller.game?.players[playerIndex]?.validateId(playerId);

  if (!isPlayerValid) {
    return "Unauthorized player";
  }

  return isPlayerValid;
}
