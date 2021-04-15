import { getNeighborCoords } from './util/getNeighborCoords';
import { copyGrid, createMinAndMaxBoundsObj, getMinAndMaxBounds } from './grid';
import { Coord, Grid } from './util/types';
import { getRandomInteger } from './util/random';

/** @fileoverview Encapsulates logic for Abelian Sandpile transition function.
 * `transition()` is a wrapper for determining the next state of the grid. The
 * various steps in the transition are non-pure functions, so `transition()`
 * creates a copy of the given grid. This permits `transition()` to be treated
 * as a pure function, so we can export it without worrying about mutation. */

/* TODO: Future: consolidate these into something which gives us more flexibility.
 * Ideally we could create a transition function which passes options to several
 * of the helper functions we have here. */

/* TODO: Naming issue: we use "vertex" interchangeably with "cell".
 * "Vertex" is what we called them back when we were doing graph implementation;
 * but "cell" is what we shifted to for the 2D array implementation. */

/* TODO: I don't exporting every function for tests.
 * Makes it difficult to tell which functions are used in non-test modules.
 * Find a solution. */

/** Goes through one "stable, add grain, topple until stable" iteration.
 * This assumes the given grid is stable (but works in either case? IDK).
 *
 * By default adds grains to the center. Optional arg 'random' will instead add
 * to random vertex.
 *
 * Grid is not mutated. A copy of the given grid is created, and then modified
 * according to the sandpile's transition rules.
 */
export function transition(grid: Grid, addGrainFunctionName?: string): Grid {
  let nextGrid: Grid = copyGrid(grid);
  /* Add one grain to the grid. */
  if (addGrainFunctionName === 'random') {
    addGrainRandom(nextGrid);
  } else {
    addGrainCenter(nextGrid);
  }
  /* Then find and return the stable configuration. */
  toppleUntilStable(nextGrid);
  return nextGrid;
}

/** Adds one grain to the center of the grid.
 * For example, a 5x7 grid has the center (2, 3).
 * Assumes grid dimensions are odd. Otherwise won't technically be "center".
 * For example, a 4x6 grid would also have the "center" (2, 3).
 * @modifies {grid}
 */
export function addGrainCenter(grid: Grid): void {
  const i: number = Math.floor(grid.length / 2);    // center row
  const j: number = Math.floor(grid[0].length / 2); // center column
  grid[i][j] += 1;
}

/** Adds 1 grain to a random vertex ij in the grid.
 * @modifies {grid}
 */
export function addGrainRandom(grid: Grid): void {
  const i: number = getRandomInteger(0, grid.length - 1); // length - 1 is max valid index
  const j: number = getRandomInteger(0, grid[0].length - 1);
  grid[i][j] += 1;
}

/** Checks whether the given grid is stable.
 * @nosideffects
 */
function gridIsStable(grid: Grid): boolean {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] >= 4) { // Vertex ij has >= 4 grains
       return false
      }
    }
  }
  return true;
}

/** Repeatedly topples all unstable vertices in the grid until grid is stable.
 * @modifies {grid}
 */
export function toppleUntilStable(grid: Grid, center?: boolean): void {
  /* Grid is stable if it has 0 unstable vertices. */
  let isStable: boolean = gridIsStable(grid);
  while (isStable === false) {
    /* Topple all unstable vertices and check if grid is now stable.
     * If not, we topple all the newly-unstable vertices, and repeat. */
    toppleUnstableVertices(grid);
    isStable = gridIsStable(grid);
  }
}

/** Topples all CURRENTLY unstable vertices.
 * Does NOT guarantee end state is stable, since toppling may produce new
 * unstable vertices.
 * @modifies {grid}
 */
export function toppleUnstableVertices(grid: Grid): void {
  let unstableVertices: Array<Coord> = getUnstableVertices(grid);
  while (unstableVertices.length > 0) {
    const unstableVertex: Coord = unstableVertices.pop() as Coord;
    topple(grid, unstableVertex);
  }
}

/** Returns all indices ij where grid[i][j] is greater than or equal to 4.
 * The returned array of ij-coordinates has ascending order of i, and if i values
 * are equal, ascending order of j.
 * @nosideffects
 */
export function getUnstableVertices(grid: Grid): Array<Coord> {
  let unstableVertices: Array<Coord> = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] >= 4) { // Vertex ij has >= 4 grains
        unstableVertices.push([i, j]);
      }
    }
  }
  return unstableVertices;
}

/** Topples the vertex at the given coord, adding 1 grain to up to 4 neighbors.
 * @modifies {grid}
 */
export function topple(grid: Grid, coord: Coord): void {
  const i: number = coord[0];
  const j: number = coord[1];
  grid[i][j] = grid[i][j] - 4; // Reduce toppled vertex grain count by 4.

  /* Add 1 grain to each of the neighbors.
   * Note that the order doesn't matter, since we always have 4 grains to add,
   * and each vertex has at most 4 neighbors. So if a vertex topples, every
   * valid neighbor will get 1 grain added. */
  let neighbors: Array<Coord> = getNeighborCoords(coord, grid.length - 1, grid[0].length - 1);
  for (let coord of neighbors) {
    grid[coord[0]][coord[1]] += 1; // Add 1 grain to this neighbor
  }
}