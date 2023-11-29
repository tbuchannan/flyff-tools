export enum MaterialType {
  Eron,
  Mineral,
}

export enum GearType {
  Helmet,
  Chest,
  Gloves,
  Boots,
}

export type UpgradeLevelType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type UpgradeLevelMap<T> = { [LEVEL in UpgradeLevelType]: T }
