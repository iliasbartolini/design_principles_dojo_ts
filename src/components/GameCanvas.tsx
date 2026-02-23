import { useCallback, useState } from 'react';
import { World, initGliderWorld } from '../core/World';
import { IntroScreen } from './IntroScreen';
import { GameScreen } from './GameScreen';

// Rudimentary switch between IntroScreen and GameScreen.
type ScreenName = 'intro' | 'game';

export function GameCanvas() {
  const [screen, setScreen] = useState<ScreenName>('intro');
  const [world, setWorld] = useState<World>(() => initGliderWorld());

  const handleStart = useCallback(() => setScreen('game'), []);

  // Mirrors: GameScreen.getNextScreen() calling world.advance() and returning self
  // useCallback ensures stable reference so GameScreen's setInterval isn't re-created
  const handleAdvance = useCallback((next: World) => setWorld(next), []);

  const renderScreen = () => {
    if (screen === 'intro') {
      return <IntroScreen onStart={handleStart} />;
    }
    return <GameScreen world={world} onAdvance={handleAdvance} />;
  };

  return (
    <div>
      {renderScreen()}
    </div>
  );
}
