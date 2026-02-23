import { useEffect } from 'react';

// Mirrors IntroScreen.java: shows intro image, any click or keypress triggers transition
interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  useEffect(() => {
    // Mirrors IntroScreen.keyPressed(): startGame = true
    const handleKey = () => onStart();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <div
      onClick={onStart}
      style={{ cursor: 'pointer', width: '100%', height: '100%' }}
    >
      <img
        src="/intro.png"
        alt="Conway's Game of Life"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
