export type Command =
  | { type: "start"; players: string[] }
  | { type: "dice"; playerName: string }
  | { type: "state" }
  | { type: "help" }
  | { type: "unknown"; raw: string };

/**
 * This function convert the text inserted on the CMD into a command
 */
export function parseCommand(input: string): Command {
  const parts = input.trim().split(" ");

  const cmd = parts[0];

  if (cmd === "start") {
    return {
      type: "start",
      players: parts.slice(1),
    };
  }

  if (cmd === "dice") {
    if (parts.length < 2) {
      return { type: "unknown", raw: input };
    }

    return {
      type: "dice",
      playerName: parts[1] as string,
    };
  }

  if (cmd === "state") return { type: "state" };
  if (cmd === "help") return { type: "help" };

  return { type: "unknown", raw: input };
}
