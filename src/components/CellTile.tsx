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
        backgroundColor: '#ffffff',
      }}
    ><div
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: alive ? '#000000' : '#ffffff',
        borderRadius: '50%',
      }}
      ></div>
    </div>
  );
}
