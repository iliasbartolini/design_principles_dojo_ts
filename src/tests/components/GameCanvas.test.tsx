import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { GameCanvas } from '../../components/GameCanvas';

describe('GameCanvas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('starts on the intro screen showing the game image', () => {
    render(<GameCanvas />);
    expect(screen.getByAltText("Conway's Game of Life")).toBeInTheDocument();
  });

  it('does not show the game grid on the intro screen', () => {
    render(<GameCanvas />);
    expect(screen.queryByTestId(/^cell-/)).toBeNull();
  });

  it('transitions to game screen on click, showing 100 cells', () => {
    render(<GameCanvas />);
    fireEvent.click(screen.getByRole('img'));
    expect(screen.queryByAltText("Conway's Game of Life")).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(100);
  });

  it('transitions to game screen on any keypress', () => {
    render(<GameCanvas />);
    fireEvent.keyDown(window);
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(100);
  });

  it('game grid continues to be rendered after a tick on game screen', () => {
    render(<GameCanvas />);
    fireEvent.click(screen.getByRole('img'));
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(100);
  });
});
