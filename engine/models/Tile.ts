import { TileType } from "../enums/index.js";

/**
 * This class represents a Tile on the board
 * @param {owner}, represents the player witch put a card, can be null.
 * @param {tileType}, represents the tile, can be null or one kind of card.
 */
export default class Tile {
  owner: String | null;
  tileType: TileType = TileType.None;

  constructor() {
    this.owner = null;
    this.tileType = TileType.None;
  }

  /**
   * Returns if this Tile has one card witch can be Oasis or Mirage,
   * This cards make the camel advance(Oasis) or going back(Mirage),
   */
  hasTile() {
    return this.owner !== null;
  }

  /**
   * Returns if this tile is mirage or oasis
   */
  returnTileType() {
    return this.tileType;
  }

  /**
   * This allow the user to place a card in the tile
   * @param {playerName} Player the name of the owner
   * @param {type}
   */
  place(playerName: string, type: TileType) {
    this.owner = playerName;
    this.tileType = type;
  }

  /**
   * This method remove one card placed by one user in this tile
   */
  remove() {
    this.owner = null;
    this.tileType = TileType.None;
  }
}
