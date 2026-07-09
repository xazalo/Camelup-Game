//@ts-expect-error
import readline from "node:readline";
import { GameController, HelpController } from "./controllers/index.js";
import { parseCommand } from "./parseCommand.js";

const rl = readline.createInterface({
  //@ts-expect-error
  input: process.stdin,
  //@ts-expect-error
  output: process.stdout,
});

const gameController = new GameController();
const helpController = new HelpController();

console.log("CLI ready. Use help for see commands");

rl.on("line", (input: any) => {
  const command = parseCommand(input);

  switch (command.type) {
    case "start":
      console.log(gameController.startGame(command.players));
      break;

    case "rollTheDice":
      console.log(gameController.rollTheDice(command.playerName));

    case "state":
      console.log(JSON.stringify(gameController.getState(), null, 2));
      break;

    case "placeTile":
      console.log(gameController.placeTile(command.playerName, command.position, command.tileType));
      break;

    case "help":
      console.log(helpController.showHelp());
      break;

    case "unknown":
      console.log("Unknown command:", command.raw);
      break;
  }
});
