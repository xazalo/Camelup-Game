import { Player } from "./index.js";

export enum TileType {
    None,
    Oasis,
    Mirage,
}

export default class Tile {
    owner: Player | null;
    tileType: TileType = TileType.None;

    constructor() {
        this.owner = null;
        this.tileType = TileType.None;
    }
}