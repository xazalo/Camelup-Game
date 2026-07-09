
/**
 * This class returns a list of the commands witch can be used.
 */

export default class HelpController {
    showHelp(): string {
        return [
            "=== Camel Up CLI ===",
            "",
            "Commands:",
            "  start <name> <name>...                   -> start a new game (between 2 and 6 players)",
            "  state                                    -> show the game state",
            "  placeTile <name> <position> <number>     -> Place a new tile in the X position. This tile should be 1 (Oasis) or 2 (Mirage).",
            "  rollTheDice <name>                       -> create a new dice",
            "  help                                     -> show all commands.",
            "",
        ].join("\n");
    }
}