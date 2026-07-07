import {Tile, Card} from "./index.js";

/**
 * This class is a representation of the player across the game
 * @param {name} string, Name for identify the player,
 * @param {money} number, Number of money that they have actually
 * @param {cards} Card[], The purchased cards
 * @param {tiles} Tile[], The player should put a special card for making the
 *                        camels advance or going back instead. This is a
 *                        register of the card position.
 */

export default class Player {
    name: string;
    money: number;
    cards: Card[];
    tiles: Tile[];

    constructor(name: string) {
        this.name = name;
        this.money = 3;
        this.cards = [];
        this.tiles = [];
    }

    updateMoney(amount: number) {
        this.money = this.money + amount
    }
}