import { Tile, Camel } from "./index.js"
import { TileType } from "./Tile.js";

export default class Stack {
  camels: Camel[] = [];
  tile: Tile = new Tile();
}