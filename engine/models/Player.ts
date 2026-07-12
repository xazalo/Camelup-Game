import { Tile, Card } from "./index.js";

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
  placedTile: boolean;

  constructor(name: string) {
    this.name = name;
    this.money = 3;
    this.cards = [];
    this.placedTile = false;
  }

  /**
   * Update the money
   */
  updateMoney(amount: number) {
    this.money = this.money + amount;
  }

  /**
   * Flag for know if the user placed a tile
   */
  placeTile() {
    this.placedTile = true;
  }

  /**
   * Reset to the original state
   */
  removePlacedTile() {
    this.placedTile = false;
  }

  /**
   * Returns if the player placed a tile
   */
  hasPlacedTile() {
    return this.placedTile;
  }

  /**
   * Adds a grabbed card to the player's pool
   * @param card Card to be placed in the array
   */
  addCard(card: Card): void {
    this.cards.push(card);
  }

  /**
   * This method reset the storage
   */
  resetCardStorage() {
    this.cards = [];
  }

  /**
   * This method returns the cards of the player
   */
  getCards() {
    return this.cards;
  }
}
