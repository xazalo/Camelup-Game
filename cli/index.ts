import readline from "node:readline";
import { GameController, HelpController } from "./controllers/index.js";
import { parseCommand } from "./parseCommand.js";
import createRandomId from "./helpers/createRandomId.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const gameController = new GameController();
const helpController = new HelpController();

console.log("CLI ready. Use help for see commands");

rl.on("line", (input: string) => {
  const command = parseCommand(input);
  const gameId = createRandomId();

  switch (command.type) {
    case "start":
      console.log(gameController.startGame(command.players, gameId));
      break;

    case "rollTheDice":
      console.log(gameController.rollTheDice(command.playerName));
      break;

    case "state":
      console.log(JSON.stringify(gameController.getState(), null, 2));
      break;

    case "placeTile":
      console.log(
        gameController.placeTile(
          command.playerName,
          command.position,
          command.tileType,
        ),
      );
      break;

    case "placeWinnerBet":
      console.log(
        gameController.placeWinnerBet(
          command.playerName,
          command.camelColor,
        ),
      );
      break;

    case "placeLoserBet":
      console.log(
        gameController.placeLoserBet(
          command.playerName,
          command.camelColor,
        ),
      );
      break;

    case "takeRoundBet":
      console.log(
        gameController.takeRoundBet(
          command.playerName,
          command.camelColor,
        ),
      );
      break;

    case "help":
      console.log(helpController.showHelp());
      break;

    case "unknown":
      console.log("Unknown command:", command.raw);
      break;
  }
});