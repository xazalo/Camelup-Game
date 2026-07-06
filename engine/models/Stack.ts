import { Camel, Tile } from "./index.js";
import { Colors } from "../enums/index.js";

export default class Stack {
  camels: Camel[] = [];
  tile: Tile = new Tile();

  addCamel(camel: Camel): void {
    this.camels.unshift(camel);
  }

  addCamels(camels: Camel[]): void {
    this.camels.unshift(...camels);
  }

  removeCamel(color: Colors): Camel | null {
    const index = this.camels.findIndex(camel => camel.color === color);

    if (index === -1) {
      return null;
    }

    return this.camels.splice(index, 1)[0]!;
  }

  removeCamelStack(color: Colors): Camel[] {
    const index = this.camels.findIndex(camel => camel.color === color);

    if (index === -1) {
      return [];
    }

    return this.camels.splice(index);
  }
}