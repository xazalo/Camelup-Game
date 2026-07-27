import { Card, AvailableActions } from "../models/index.js";

export type PlayerState = {
  name: string;
  money: number;
  cards: Card[];
  placedTile: boolean;
  availableActions: AvailableActions;
  isAI: boolean;
}