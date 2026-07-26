type Type = "log" | "error" | "finished" | "started";

export function log(message: string, type: Type): string {
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

    default:
      prefix = "[ERROR]";
      message = "***** Log didn't work properly *****";
      break;
  }

  const result = `${prefix}${message}`;

  console.log(result);

  return result;
}