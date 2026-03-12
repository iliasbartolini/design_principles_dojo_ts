# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # start Vite dev server
bun run build        # tsc type-check + Vite production build
bun run test         # run all tests once (Vitest)
bun run test:watch   # run tests in watch mode
bun run preview      # preview production build
```

> **Note:** Do NOT use `bun test` — it invokes Bun's built-in test runner, which has no jsdom environment. Component tests will fail with `document is not defined`. Always use `bun run test` to go through Vitest.

Run a single test file:
```bash
bunx vitest run src/tests/core/World.test.ts
```

## Architecture

This is Conway's Game of Life — a TypeScript/React port of a Java implementation. The codebase is split into a pure domain layer and a React UI layer.

### Core domain (`src/core/`)

All game logic lives here with no React dependencies.

- **`Cell.ts`** — Discriminated union (`AliveCell | DeadCell`) with singleton constants `ALIVE_CELL`/`DEAD_CELL`. `willBeAlive(cell, aliveNeighbors)` encodes Conway's survival and birth rules.
- **`Location.ts`** — Grid coordinate type `{ x, y }`. Use `at(x, y)` as the factory. `locationKey(loc)` converts to a string key (`"x,y"`) because JS `Map` compares objects by reference, not value. `allNeighbours()` clamps to grid edges and does not wrap.
- **`World.ts`** — Immutable game state backed by a `Map<string, Cell>`. Both `advance()` and `withLiving()` return a **new** `World` instance; mutation never occurs. This makes React state updates work correctly via reference inequality. `createGliderWorld()` seeds the default Glider pattern.

### React UI (`src/components/`)

- **`GameCanvas.tsx`** — Root component. Owns two state slices: `screen: 'intro' | 'game'` (screen state machine) and `world: World`. Passes stable `useCallback` references down to avoid unnecessary re-renders/re-subscriptions.
- **`IntroScreen.tsx`** — Shows `public/intro.png`. Any click or `keydown` on `window` calls `onStart` to transition to `'game'`.
- **`GameScreen.tsx`** — Renders the 10×10 grid and drives the game loop. Uses `setInterval` at 250ms; advances the world via a `useRef` to avoid stale closure issues. Calls `onAdvance(world.advance())` each tick.
- **`CellTile.tsx`** — Single cell `<div>` with `data-testid="cell-{x}-{y}"` and `data-alive={boolean}`. Black background when alive, white when dead.

### Constants

| Name | Value | Location |
|---|---|---|
| Grid size | 10 × 10 | `World.ts` `DEFAULT_WIDTH/HEIGHT` |
| Tile size | 48px | `GameCanvas.tsx`, `GameScreen.tsx`, `CellTile.tsx` |
| Frame interval | 250ms | `GameScreen.tsx` `FRAME_INTERVAL` |

### Testing

Tests live in `src/tests/` mirroring the `src/` structure. Vitest globals (`describe`, `it`, `expect`, etc.) are enabled via `tsconfig.json` — no imports needed in test files (though some files import them explicitly). `src/tests/setup.ts` imports `@testing-library/jest-dom`.

For component tests that involve the game loop, use `vi.useFakeTimers()` in `beforeEach` and `vi.useRealTimers()` + `cleanup()` in `afterEach`. Advance time with `act(() => { vi.advanceTimersByTime(250); })`.

Cell elements are queried in tests via `data-testid` (`/^cell-/`) and `data-alive` attributes.
