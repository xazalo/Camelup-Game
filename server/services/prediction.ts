// server/services/AIService.ts

import type { Game } from "../../engine/models/index.js";

export type AIAction = {
  type: string;
  playerName: string;
  position?: number;
  tileType?: number;
  camelColor?: string;
};

export async function predict(game: Game): Promise<AIAction> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!response.ok) {
    throw new Error(`Error on AI prediction: ${response.statusText}`);
  }

  return response.json() as Promise<AIAction>;
}