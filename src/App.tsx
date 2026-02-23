import { GameCanvas } from './components/GameCanvas';

export function App() {
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <GameCanvas />
    </main>
  );
}
