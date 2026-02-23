import { Cell, ALIVE_CELL, DEAD_CELL, isAlive, willBeAlive } from './Cell';
import { Location, at, allWorldLocations, allNeighbours, locationKey } from './Location';

export const DEFAULT_WIDTH = 10;
export const DEFAULT_HEIGHT = 10;

type CellMap = Map<string, Cell>;

function initCells(width: number, height: number): CellMap {
  const cells: CellMap = new Map();
  for (const loc of allWorldLocations(width, height)) {
    cells.set(locationKey(loc), DEAD_CELL);
  }
  return cells;
}

export class World {
  private readonly cells: CellMap;
  readonly width: number;
  readonly height: number;

  constructor(
    cells?: CellMap,
    width: number = DEFAULT_WIDTH,
    height: number = DEFAULT_HEIGHT
  ) {
    this.width = width;
    this.height = height;
    this.cells = cells ?? initCells(width, height);
  }

  // Returns a NEW World with all cells evolved by one generation.
  // Immutable advance() enables React state updates via reference inequality.
  // Mirrors World.advance() — atomic cell map replacement.
  advance(): World {
    const newCells = initCells(this.width, this.height);
    for (const loc of allWorldLocations(this.width, this.height)) {
      const cell = this.cells.get(locationKey(loc)) ?? DEAD_CELL;
      const nAlive = this.numberOfAliveNeighbours(loc);
      if (willBeAlive(cell, nAlive)) {
        newCells.set(locationKey(loc), ALIVE_CELL);
      }
    }
    return new World(newCells, this.width, this.height);
  }

  // Returns a NEW World with the given location set alive.
  // Replaces Java's mutating setLiving() — immutable to support React state.
  withLiving(loc: Location): World {
    const newCells = new Map(this.cells);
    newCells.set(locationKey(loc), ALIVE_CELL);
    return new World(newCells, this.width, this.height);
  }

  isAlive(loc: Location): boolean {
    return isAlive(this.cells.get(locationKey(loc)) ?? DEAD_CELL);
  }

  isEmpty(): boolean {
    for (const cell of this.cells.values()) {
      if (isAlive(cell)) return false;
    }
    return true;
  }

  numberOfAliveNeighbours(loc: Location): number {
    return allNeighbours(loc, this.width, this.height).filter((n) =>
      this.isAlive(n)
    ).length;
  }
}

// Seeds the Glider pattern matching GameRunner.java initialization:
// locations (7,1),(7,2),(7,3),(8,3),(9,2)
export function initGliderWorld(): World {
  return new World()
    .withLiving(at(7, 1))
    .withLiving(at(7, 2))
    .withLiving(at(7, 3))
    .withLiving(at(8, 3))
    .withLiving(at(9, 2));
}
