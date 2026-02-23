// Discriminated union replacing Java's sealed interface Cell
// with AliveCell and DeadCell records
export type AliveCell = { readonly kind: 'alive' };
export type DeadCell = { readonly kind: 'dead' };
export type Cell = AliveCell | DeadCell;

// Singleton constants mirror Java's no-arg record constructors
export const ALIVE_CELL: AliveCell = { kind: 'alive' };
export const DEAD_CELL: DeadCell = { kind: 'dead' };

// Replaces Cell.isAlive() interface method
export function isAlive(cell: Cell): boolean {
  return cell.kind === 'alive';
}

// Strategy pattern via discriminant dispatch:
// replaces AliveCell.willBeAlive() and DeadCell.willBeAlive() polymorphism
export function willBeAlive(cell: Cell, aliveNeighbors: number): boolean {
  if (cell.kind === 'alive') {
    // Survival rule: alive cell survives with 2 or 3 neighbours
    return aliveNeighbors === 2 || aliveNeighbors === 3;
  } else {
    // Birth rule: dead cell becomes alive with exactly 3 neighbours
    return aliveNeighbors === 3;
  }
}
