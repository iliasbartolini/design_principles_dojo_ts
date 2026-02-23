// Direct port of WorldTest.java
// Each Java @Test method maps to a bun:test it() block.
// @Before setUp() maps to beforeEach().
import { describe, it, expect, beforeEach } from 'bun:test';
import { World } from '../../core/World';
import { at } from '../../core/Location';

describe('World', () => {
  let world: World;

  // Mirrors: @Before public void setUp() { world = new World(); }
  beforeEach(() => {
    world = new World();
  });

  // Mirrors: world_should_be_initially_empty
  it('should be initially empty', () => {
    expect(world.isEmpty()).toBe(true);
  });

  // Mirrors: world_should_be_non_empty_after_adding_a_live_cell
  it('should be non-empty after adding a live cell', () => {
    world = world.withLiving(at(1, 1));
    expect(world.isEmpty()).toBe(false);
  });

  // Mirrors: empty_world_should_be_empty_after_advancing
  it('empty world should be empty after advancing', () => {
    world = world.advance();
    expect(world.isEmpty()).toBe(true);
  });

  // Mirrors: live_cells_with_fewer_than_two_live_neighbours_dies
  it('live cells with fewer than two live neighbours dies (underpopulation)', () => {
    // Two isolated cells — each has only 1 neighbour
    world = world.withLiving(at(2, 2)).withLiving(at(2, 3));
    world = world.advance();
    expect(world.isEmpty()).toBe(true);
  });

  // Mirrors: live_cells_with_two_live_neighbours_survives
  it('live cells with two live neighbours survives', () => {
    // Vertical line of 3: centre cell at (2,3) has 2 neighbours
    world = world.withLiving(at(2, 2)).withLiving(at(2, 3)).withLiving(at(2, 4));
    world = world.advance();
    expect(world.isAlive(at(2, 3))).toBe(true);
    expect(world.isEmpty()).toBe(false);
  });

  // Mirrors: live_cells_with_three_live_neighbours_survives
  it('live cells with three live neighbours survives', () => {
    world = world
      .withLiving(at(2, 3))
      .withLiving(at(2, 2))
      .withLiving(at(2, 4))
      .withLiving(at(3, 3));
    world = world.advance();
    expect(world.isAlive(at(2, 3))).toBe(true);
  });

  // Mirrors: live_cells_with_more_than_three_live_neighbours_dies
  it('live cells with more than three live neighbours dies (overpopulation)', () => {
    // Centre cell at (2,3) surrounded by 4 live neighbours
    world = world
      .withLiving(at(2, 3))
      .withLiving(at(2, 2))
      .withLiving(at(2, 4))
      .withLiving(at(3, 3))
      .withLiving(at(1, 3));
    world = world.advance();
    expect(world.isAlive(at(2, 3))).toBe(false);
  });

  // Mirrors: dead_cell_with_exactly_three_live_neighbours_becomes_alive
  it('dead cell with exactly three live neighbours becomes alive (reproduction)', () => {
    // (2,3) is dead; its 3 live neighbours trigger birth
    world = world
      .withLiving(at(2, 2))
      .withLiving(at(2, 4))
      .withLiving(at(3, 3));
    world = world.advance();
    expect(world.isAlive(at(2, 3))).toBe(true);
  });
});
