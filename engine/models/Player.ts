import {Tile, Card} from "./index.js";

export default class Player {
    name: string;
    money: number;
    cards: Card[];
    tiles: Tile[];

    constructor(name: string) {
        this.name = name;
        this.money = 3; // o el valor inicial del juego
        this.cards = [];
        this.tiles = [];
    }
}