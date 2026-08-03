type Type =
  "log" | "error" | "finished" | "started" | "success" | "warning" | "info";

let logSilenceDepth = 0;

export function silenceLogs(): void {
  logSilenceDepth++;
}

export function restoreLogs(): void {
  logSilenceDepth = Math.max(0, logSilenceDepth - 1);
}

export function log(message: string, type: Type, playerName?: string): string {
  if (logSilenceDepth > 0) {
    return message;
  }

  let prefix: string;

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

    case "success":
      prefix = "[SUCCESS]";
      break;

    case "warning":
      prefix = "[WARNING]";
      break;

    case "info":
      prefix = "[INFO]";
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
