import type { Game } from "../../engine/models/index.js";
import config from "../../config.js";

export type AIAction = {
  action_idx: number;
  action_name: string;
};

export async function predict(game: Game): Promise<AIAction> {
    const response = await fetch(`${config.aiHost}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      throw new Error(
        `AI request failed (${response.status})`,
      );
    }

    return await response.json() as AIAction;
}