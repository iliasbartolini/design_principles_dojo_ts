import { useEffect, useRef } from 'react';
import { World, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../core/World';
import { allWorldLocations } from '../core/Location';
import { CellTile } from './CellTile';

const TILE_SIZE = 48;

const FRAME_INTERVAL = 250;

interface GameScreenProps {
  world: World;
  onAdvance: (next: World) => void;
}

export function GameScreen({ world, onAdvance }: GameScreenProps) {

  // worldRef prevents stale closure in the interval without re-creating it each render.
  // The interval always reads the latest world via the ref.
  const worldRef = useRef<World>(world);
  useEffect(() => {
    worldRef.current = world;
  }, [world]);

  useEffect(() => {
    const id = setInterval(() => {
      onAdvance(worldRef.current.advance());
    }, FRAME_INTERVAL);
    return () => clearInterval(id);
  }, [onAdvance]);

  const locations = allWorldLocations(DEFAULT_WIDTH, DEFAULT_HEIGHT);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${DEFAULT_WIDTH}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${DEFAULT_HEIGHT}, ${TILE_SIZE}px)`,
        gap: '2px',
        backgroundColor: '#e0e0e0', 
        border: '2px solid #e0e0e0',
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
