enum TileType {
  None,
  Oasis,
  Mirage,
}

function isTileType(value: string) {
  return (
    value === TileType.Oasis.toString() || value === TileType.Mirage.toString()
  );
}

export { TileType, isTileType };
