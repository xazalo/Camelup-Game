import { Player } from "./index.js";
import { TileType } from "../enums/index.js";

export default class Tile {
    owner: Player | null;
    tileType: TileType = TileType.None;

    constructor() {
        this.owner = null;
        this.tileType = TileType.None;
    }
}