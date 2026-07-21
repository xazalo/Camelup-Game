import { TileType } from "../engine/enums/index.js";
import { Colors } from "../engine/enums/index.js";
import { type PlayerConfig } from "../engine/types/PlayerConfig.js";

export type Command =
  | { type: "start"; players: PlayerConfig[] }
  | { type: "rollTheDice"; playerName: string }
  | { type: "state" }
  | {
      type: "placeTile";
      playerName: string;
      position: number;
      tileType: TileType;
    }
  | {
      type: "placeWinnerBet";
      playerName: string;
      camelColor: Colors;
    }
  | {
      type: "placeLoserBet";
      playerName: string;
      camelColor: Colors;
    }
  | {
      type: "takeRoundBet";
      playerName: string;
      camelColor: Colors;
    }
  | { type: "help" }
  | { type: "unknown"; raw: string };
/**
 * This function convert the text inserted on the CMD into a command
 */
export function parseCommand(input: string): Command {
  const parts = input.trim().split(" ");

  const cmd = parts[0];

  if (cmd === "start") {
    const players: PlayerConfig[] = parts.slice(1).map((player) => {
      const [name, type] = player.split(":");

      if (!name) {
        throw new Error("Invalid player format");
      }

      return {
        name,
        isAI: type?.toLowerCase() === "ai",
      };
    });

    return {
      type: "start",
      players,
    };
  }

  if (cmd === "rollTheDice") {
    if (parts.length < 2) {
      return { type: "unknown", raw: input };
    }

    return {
      type: "rollTheDice",
      playerName: parts[1] as string,
    };
  }

  if (cmd === "placeTile") {
    if (parts.length !== 4) {
      return { type: "unknown", raw: input };
    }

    const [, playerName, position, tile] = parts as [
      string,
      string,
      string,
      string,
    ];

    const positionNb = Number(position);

    if (Number.isNaN(positionNb)) {
      return { type: "unknown", raw: input };
    }

    let tileType: TileType;

    if (tile === TileType.Oasis.toString()) {
      tileType = TileType.Oasis;
    } else if (tile === TileType.Mirage.toString()) {
      tileType = TileType.Mirage;
    } else {
      return { type: "unknown", raw: input };
    }

    return {
      type: "placeTile",
      playerName,
      position: positionNb,
      tileType,
    };
  }

  if (cmd === "state") return { type: "state" };
  if (cmd === "help") return { type: "help" };

  return { type: "unknown", raw: input };
}
