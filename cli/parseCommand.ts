export type Command =
    | { type: "start"; players: string[] }
    | { type: "state" }
    | { type: "help" }
    | { type: "unknown"; raw: string };

export function parseCommand(input: string): Command {
    const parts = input.trim().split(" ");

    const cmd = parts[0];

    if (cmd === "start") {
        return {
            type: "start",
            players: parts.slice(1),
        };
    }

    if (cmd === "state") return { type: "state" };
    if (cmd === "help") return { type: "help" };

    return { type: "unknown", raw: input };
}