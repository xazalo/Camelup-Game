import { TileType } from "../enums/index.js";

export type Action =
  | { type: "RollDice" }
  | { type: "Bet"; cardId: string }
  | { type: "PlaceTile"; tileType: TileType; position: number };
