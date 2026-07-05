import { Player } from "./index.js";

export enum TileType {
    None,
    Oasis,
    Mirage,
}

export default class Tile {
    owner: Player;
    tileType: TileType;

    constructor(owner: Player, tileType: TileType) {
        this.owner = owner;
        this.tileType = tileType;
    }
}