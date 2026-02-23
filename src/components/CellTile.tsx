// Replaces AliveCellPresenter and DeadCellPresenter.
// CellToPresenterFactory logic becomes a simple prop-driven ternary.
const TILE_SIZE = 48;

interface CellTileProps {
  alive: boolean;
  x: number;
  y: number;
}

export function CellTile({ alive, x, y }: CellTileProps) {
  return (
    <div
      data-testid={`cell-${x}-${y}`}
      data-alive={alive}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: alive ? '#000000' : '#ffffff',
        boxSizing: 'border-box',
        border: '1px solid #e0e0e0',
      }}
    />
  );
}
