import { describe, it, expect, beforeEach } from "vitest";

import { Tile } from "../../engine/models/index.js";
import { TileType } from "../../engine/enums/TileType.js";

describe("Tile", () => {
  let tile: Tile;

  beforeEach(() => {
    tile = new Tile();
  });

  it("should place a tile", () => {
    tile.place("John", TileType.Oasis);
    expect(tile.owner).toBe("John");
    expect(tile.tileType).toBe(1);
  });

  it("should remove a tile", () => {
    tile.place("John", TileType.Mirage);
    tile.remove();
    expect(tile.owner).toBe(null);
    expect(tile.tileType).toBe(0);
  });

  it("should return false when tile don't has owner", () => {
    const hasTile = tile.hasTile();
    expect(hasTile).toBe(false);
  });

  it("should return true when tile has owner", () => {
    tile.place("John", TileType.Mirage);
    const hasTile = tile.hasTile();
    expect(hasTile).toBe(true);
  });

  it("should return tileType when tile has it", () => {
    tile.place("John", TileType.Mirage);
    const kindOfTile = tile.returnTileType();
    expect(kindOfTile).toBe(2);
  });

  it("should return tileTye when it is None", () => {
    tile.remove();
    const kindOfTile = tile.returnTileType();
    expect(kindOfTile).toBe(0);
  });
});
