import { TileType } from "./Tile.js";

export type Action =
    | { type: "RollDice" }
    | { type: "Bet"; cardId: string }
    | { type: "PlaceTile"; tileType: TileType; position: number };

export default interface Turn {
    index: number;
    playerId: string;
    action: Action;
}