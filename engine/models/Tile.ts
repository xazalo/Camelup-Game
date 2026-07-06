import { Player } from "./index.js";
import { TileType } from "../enums/index.js";

/**
 * This class represents a Tile on the board
 * @param {owner}, represents the player witch put a card, can be null.
 * @param {tileType}, represents the tile, can be null or one kind of card.
 */
export default class Tile {
    owner: Player | null;
    tileType: TileType = TileType.None;

    constructor() {
        this.owner = null;
        this.tileType = TileType.None;
    }
}