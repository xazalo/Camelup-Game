import TileType from "../enums/TileType.js";

export type Action =
  | { type: "RollDice" }
  | { type: "Bet"; cardId: string }
  | { type: "PlaceTile"; tileType: TileType; position: number };
