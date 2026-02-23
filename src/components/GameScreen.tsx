import { useEffect, useRef } from 'react';
import { World, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../core/World';
import { allWorldLocations } from '../core/Location';
import { CellTile } from './CellTile';

// Mirrors GameRunner.TILE_SIZE = 48
const TILE_SIZE = 48;
// Mirrors GameRunner.FRAME_INTERVAL = 250ms
const FRAME_INTERVAL = 250;

interface GameScreenProps {
  world: World;
  onAdvance: (next: World) => void;
}

// Mirrors GameScreen.java: renders the grid and drives the game loop.
// GameRunner's Thread.sleep(250) loop becomes setInterval in useEffect.
// GameScreen.getNextScreen() calling world.advance() becomes the interval callback.
export function GameScreen({ world, onAdvance }: GameScreenProps) {
  // worldRef prevents stale closure in the interval without re-creating it each render.
  // The interval always reads the latest world via the ref.
  const worldRef = useRef<World>(world);
  useEffect(() => {
    worldRef.current = world;
  }, [world]);

  useEffect(() => {
    // Mirrors: while(open) { canvas.draw(); Thread.sleep(250); }
    // And: GameScreen.getNextScreen() { world.advance(); return this; }
    const id = setInterval(() => {
      onAdvance(worldRef.current.advance());
    }, FRAME_INTERVAL);
    return () => clearInterval(id);
  }, [onAdvance]);

  const locations = allWorldLocations(DEFAULT_WIDTH, DEFAULT_HEIGHT);

  return (
    // Composite presenter: iterates all locations and delegates to CellTile
    // Mirrors GamePresenter.draw() iterating world locations
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${DEFAULT_WIDTH}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${DEFAULT_HEIGHT}, ${TILE_SIZE}px)`,
        width: DEFAULT_WIDTH * TILE_SIZE,
        height: DEFAULT_HEIGHT * TILE_SIZE,
      }}
    >
      {locations.map((loc) => (
        <CellTile
          key={`${loc.x},${loc.y}`}
          alive={world.isAlive(loc)}
          x={loc.x}
          y={loc.y}
        />
      ))}
    </div>
  );
}
