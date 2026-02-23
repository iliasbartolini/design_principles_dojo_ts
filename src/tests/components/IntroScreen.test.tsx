import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { IntroScreen } from '../../components/IntroScreen';

describe('IntroScreen', () => {
  afterEach(() => cleanup());

  it('renders the intro image', () => {
    render(<IntroScreen onStart={vi.fn()} />);
    expect(screen.getByAltText("Conway's Game of Life")).toBeInTheDocument();
  });

  it('calls onStart when clicked', () => {
    const onStart = vi.fn();
    render(<IntroScreen onStart={onStart} />);
    fireEvent.click(screen.getByRole('img'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('calls onStart when any key is pressed', () => {
    const onStart = vi.fn();
    render(<IntroScreen onStart={onStart} />);
    fireEvent.keyDown(window);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('removes keydown listener on unmount', () => {
    const onStart = vi.fn();
    const { unmount } = render(<IntroScreen onStart={onStart} />);
    unmount();
    fireEvent.keyDown(window);
    expect(onStart).not.toHaveBeenCalled();
  });
});
