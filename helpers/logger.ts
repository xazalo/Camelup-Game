type Type = "log" | "error" | "finished" | "started";

export function log(message: string, type: Type, playerName?: string): string {
  let prefix: string;

  console.log(playerName)

  switch (type) {
    case "log":
      prefix = "[LOG]";
      break;

    case "error":
      prefix = "[ERROR]";
      break;

    case "finished":
      prefix = "[FINISHED]";
      break;

    case "started":
      prefix = "[STARTED]";
      break;

    default:
      prefix = "[ERROR]";
      message = "***** Log didn't work properly *****";
      break;
  }

  const date = new Date();

  const formattedDate = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  const playerInfo = playerName ? ` [Player: ${playerName}]` : "";

  const result = `${prefix}${playerInfo} ${message} [${formattedDate}]`;

  console.log(result);

  return result;
}
