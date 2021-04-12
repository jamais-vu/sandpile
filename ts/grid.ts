import { Coord, Grid, VertexGroups } from './util/types';
import { randomIntegerArray } from './util/random';

/* Grid functions unrelated to any cellular automata rules. */

/** Returns a rows x cols Grid of zeros.
 * @nosideffects
 */
export function newZerosGrid(rows: number, cols: number): Grid {
  let grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array(cols).fill(0)); // Push a zeros array of length m
  }
  return grid;
}

/** Returns a rows x cols Grid of random values.
 * Each cell has a random integer value v, where 0 <= v <= maxHeight - 1.
 * @nosideffects
 */
export function newRandomGrid(rows: number, cols: number, maxHeight: number = 4): Grid {
  let grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(randomIntegerArray(0, maxHeight - 1, cols));
  }
  return grid;
}

/** Creates a deep copy of the given 2d array. Cannot handle deeper nesting.
 * @nosideeffects
 */
export function copyGrid(grid: Grid): Grid {
  let newGrid: Grid = [];
  for (let i = 0; i < grid.length; i ++) {
    newGrid.push(grid[i].slice());
  }
  return newGrid;
}

/** Returns the sum of all values in the grid.
 * @nosideffects
 */
export function sumGrid(grid: Grid): number {
  let sum: number = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      sum += grid[i][j];
    }
  }
  return sum;
}

/** Returns the outermost i and j indices which are nonempty.)
 *
 * This is ONLY valid for sandpile grids where we add grains to the center. It
 * relies on the dynamics of that model (i.e. that the center row and column)
 * are always the farthest non-empty cells from the center) for bounds checking.
 *
 * (Side note: function returns a Coord, but it's not technically a coordinate
 * corresponding to a vertex on our grid, it's just a 2-tuple of numbers.)
 * @nosideffects
 */
export function findBounds(grid: Grid): Coord {
  const iCenter: number = Math.floor(grid.length / 2);    // center row
  const jCenter: number = Math.floor(grid[0].length / 2); // center column
  /* On an empty grid the for loop will go all the way to the center without
   * hitting a non-empty cell and triggering the if() condition, so in that
   * case we return the center. */
  let iOuter: number = iCenter;
  let jOuter: number = jCenter;
  for (let j = 0; j < jCenter; j++) {
    if (grid[iCenter][j] !== 0) {
      jOuter = j;
      break;
    }
  }
  for (let i = 0; i < iCenter; i++) {
    if (grid[i][jCenter] !== 0) {
      iOuter = i;
      break;
    }
  }
  return [iOuter, jOuter]
}


/** Returns lower and upper bounds for active cells on the grid.
 * @nosideeffects
 */
export function getMinAndMaxBounds(grid: Grid): [Coord, Coord] {
  const bounds = findBounds(grid);
  const iLower = bounds[0];
  const jLower = bounds[1];
  /* Subtract lower bounds from row and col lengths to find upper bounds.
   * We use `length - 1` to get the correct index. */
  const iUpper = (grid.length - 1) - iLower;
  const jUpper = (grid[0].length - 1) - jLower;

  return [[iLower, iUpper], [jLower, jUpper]];
}


/* NOTE: EVerything below this line is experimental. Not in production. */

// This is for constraining the grid indices we check, so we only spend time
// checking indices which could possibly be non-empty.

type Bounds = {
  lower: number;
  upper: number;
}

export type MinAndMaxBounds = {
  i: Bounds;
  j: Bounds
}

export function createMinAndMaxBoundsObj(grid: Grid): MinAndMaxBounds {
  const minAndMaxBounds: [Coord, Coord] = getMinAndMaxBounds(grid);
  return {
    i: {lower: minAndMaxBounds[0][0], upper: minAndMaxBounds[0][1]},
    j: {lower: minAndMaxBounds[1][0], upper: minAndMaxBounds[1][1]},
  }
}


// This is for parallel processing of vertices toppling.

/** Gets the vertex ID as defined by Poghosyan, Poghosyan, and Nahapetyan.
 * They give (i + 2j) mod 5, but we can use % operator, since i,j >= 0.
 * @nosideffects
 */
export function getVertexID(i: number, j: number): number {
  return (i + (2 * j)) % 5;
}

/** Divides grid into five groups of independent vertices.
 * "Independent" means no vertices in the same group share neighbors.
 * The groups are determined by which ij coords are congruent via getVertexID.
 * @nosideffects
 */
export function createVertexGroups(grid: Grid): VertexGroups {
  let groups: VertexGroups = [ [], [], [], [], [] ];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      /* Index should exist, since groups has length 5, and getVertexID returns
       * one of 0, 1, 2, 3, 4. */
      groups[getVertexID(i, j)].push([i, j]);
    }
  }
  return groups;
}

/** TODO: Don't think we'll actually use this. The array one suits our needs fine.
 * Returns Map { vertexId => Array of vertices with that ID }
 * @nosideffects
 */
export function createVertexGroupsMap(grid: Grid): Map<number, Array<Coord>> {
  let groups: Map<number, Array<Coord>> = new Map(
    [
      [0, [] ],
      [1, [] ],
      [2, [] ],
      [3, [] ],
      [4, [] ]
    ]
  );
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const key: number = getVertexID(i, j);
      (groups.get(key) as Array<Coord>).push([i, j]);
    }
  }
  return groups;
}