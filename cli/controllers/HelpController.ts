
/**
 * This class returns a list of the commands witch can be used.
 */

export default class HelpController {
    showHelp(): string {
        return [
            "=== Camel Up CLI ===",
            "",
            "Commands:",
            "  start <name> <name>          -> start a new game (between 2 and 6 players)",
            "  state                        -> show the game state",
            "  help                         -> show all commands.",
            "",
        ].join("\n");
    }
}