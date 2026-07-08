import { Camel, Tile } from "./index.js";
import { Colors } from "../enums/index.js";

/**
 * This class defines one stack for each tile, it contains the camels witch
 * are in a Tile now.
 * @param {camels} Camel[], One array of camels, should be empty or filled
 * @param {tile} Tile, One tile for the stack 
 */

export default class Stack {
  camels: Camel[] = [];
  tile: Tile = new Tile();

  /** 
   * This method add one camel to the stack
   * @param {camel} Camel, The added camel 
   */
  addCamel(camel: Camel): void {
    this.camels.push(camel);
  }

  /**
   * This method add multiple camels to the stack
   * @param {camels} Camel[], The added camels  
   */
  addCamels(camels: Camel[]): void {
    this.camels.push(...camels);
  }

  /**
   * This method remove one Camel from the stack
   * @param {color} Colors; The color of the camel for identify. 
   */
  removeCamel(color: Colors): Camel | null {
    const index = this.camels.findIndex((camel) => camel.color === color);

    if (index === -1) {
      return null;
    }

    return this.camels.splice(index, 1)[0]!;
  }

  /**
   * This method remove all the stack
   * @param {color} Colors, color for identify the camel inside a stack
   */
  removeCamelStack(color: Colors): Camel[] {
    const index = this.camels.findIndex((camel) => camel.color === color);

    if (index === -1) {
      return [];
    }

    return this.camels.splice(index);
  }
}
