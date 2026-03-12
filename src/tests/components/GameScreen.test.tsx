import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { GameScreen } from '../../components/GameScreen';
import { World } from '../../core/World';
import { at } from '../../core/Location';

describe('GameScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('renders a cell tile for every grid location (10x10 = 100 cells)', () => {
    render(<GameScreen world={new World()} onAdvance={vi.fn()} />);
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(100);
  });

  it('renders an alive cell with data-alive="true"', () => {
    const world = new World().withLiving(at(0, 0));
    render(<GameScreen world={world} onAdvance={vi.fn()} />);
    const tile = screen.getByTestId('cell-0-0');
    expect(tile).toHaveAttribute('data-alive', 'true');
  });

  it('renders a dead cell with data-alive="false"', () => {
    render(<GameScreen world={new World()} onAdvance={vi.fn()} />);
    const tile = screen.getByTestId('cell-0-0');
    expect(tile).toHaveAttribute('data-alive', 'false');
  });

  it('calls onAdvance with a new World instance after 250ms', () => {
    const onAdvance = vi.fn();
    render(<GameScreen world={new World()} onAdvance={onAdvance} />);
    act(() => { vi.advanceTimersByTime(250); });
    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(onAdvance.mock.calls[0][0]).toBeInstanceOf(World);
  });

  it('calls onAdvance 3 times after 750ms (one call per 250ms interval)', () => {
    const onAdvance = vi.fn();
    render(<GameScreen world={new World()} onAdvance={onAdvance} />);
    act(() => { vi.advanceTimersByTime(750); });
    expect(onAdvance).toHaveBeenCalledTimes(3);
  });

  it('stops advancing after unmount (interval is cleared)', () => {
    const onAdvance = vi.fn();
    const { unmount } = render(
      <GameScreen world={new World()} onAdvance={onAdvance} />
    );
    unmount();
    act(() => { vi.advanceTimersByTime(500); });
    expect(onAdvance).not.toHaveBeenCalled();
  });
});
