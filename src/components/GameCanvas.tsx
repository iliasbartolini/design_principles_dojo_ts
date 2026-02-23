import { useCallback, useState } from 'react';
import { World, DEFAULT_WIDTH, DEFAULT_HEIGHT, createGliderWorld } from '../core/World';
import { IntroScreen } from './IntroScreen';
import { GameScreen } from './GameScreen';

// Screen state machine replacing Java's Screen interface + getNextScreen() pattern.
// Java used object polymorphism; here a string union + useState achieves the same transitions.
type ScreenName = 'intro' | 'game';

const TILE_SIZE = 48;

export function GameCanvas() {
  const [screen, setScreen] = useState<ScreenName>('intro');
  const [world, setWorld] = useState<World>(() => createGliderWorld());

  // Mirrors: IntroScreen.getNextScreen() returning GameScreen when startGame = true
  const handleStart = useCallback(() => setScreen('game'), []);

  // Mirrors: GameScreen.getNextScreen() calling world.advance() and returning self
  // useCallback ensures stable reference so GameScreen's setInterval isn't re-created
  const handleAdvance = useCallback((next: World) => setWorld(next), []);

  return (
    <div
      style={{
        width: DEFAULT_WIDTH * TILE_SIZE,
        height: DEFAULT_HEIGHT * TILE_SIZE,
        overflow: 'hidden',
      }}
    >
      {screen === 'intro' && <IntroScreen onStart={handleStart} />}
      {screen === 'game' && (
        <GameScreen world={world} onAdvance={handleAdvance} />
      )}
    </div>
  );
}
