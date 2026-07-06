import randomNumber from "./randomNumber.js";

/**
 * This function returns one RandomId, uses the current Date, 
 * including milliseconds, all this make the id practically impossible
 * to repeat 
 */
export default function createRandomId(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let randomPart = "";

  for (let i = 0; i < 16; i++) {
    const index = randomNumber(characters.length);
    randomPart += characters[index];
  }

  const now = new Date();

  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
    String(now.getMilliseconds()).padStart(3, "0"),
  ].join("");


  return `${datePart}-${randomPart}`;
}
