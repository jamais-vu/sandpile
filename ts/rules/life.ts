import { CellColors, Coord, Definition, Grid } from '../util/types';

/** @fileoverview This file contains the Game of Life rules, implemented as functions
 * which take an Array<Array<number>> representing the cell states.
 *
 * Each inner array represents a row in the grid, and the numbers in each inner
 * array represents the state of that cell (e.g., grid[i][j] corresponds to the
 * state of the cell in row i, column j).
 */

/* Game of Life only has color for 1 state. */
export const cellColors: CellColors = new Map([
  [1, 'red']
]);

export const definition: Definition = {
  maxInitialCellValue: 1,
  cellColors: cellColors,
  transitionFunction: transition,
}

/* Returns the next state of the given grid. Assumes the grid is a torus. */
export function transition(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;

  let nextGrid = [];

  for (let i = 0; i < rows; i++) {

    let nextRow = [];
    for (let j = 0; j < cols; j++) {
      // Since it's a torus, no cell is technically "on the edge". Cells with
      // such ij coords have neighbors on the other "side" of the grid.
      // We use modular arithmetic for this.
      const neighborCoords = getNeighborCoordsTorus(i, j, rows, cols);
      const countOfLiveNeighbors = countLiveCells(neighborCoords, grid);
      nextRow.push(transitionRule(grid[i][j], countOfLiveNeighbors));
    }
    nextGrid.push(nextRow);
  }

  return nextGrid;
}

/* Gets neighbor coords for cells on a toroidal grid.
 * Unlike our 2d plane grid below, we need only one neighbor function for this,
 * since being on a torus means handling the "edges" is a matter of taking the
 * modulus of neighbor coords which would otherwise be "off" the 2d grid.
 *
 * If we really wanted to optimize this, we might check if the given ij-coord
 * is on the edge of the grid, and only then apply `mod()`. But the application
 * is fast enough that we need not complicate things.
 */
function getNeighborCoordsTorus(i: number, j: number, rows: number, cols: number): Array<Coord> {
  return [
    // The three cells in the row above.
    [mod(i - 1, rows), mod(j - 1, cols)],
    [mod(i - 1, rows), j],
    [mod(i - 1, rows), mod(j + 1, cols)],
    // The two cells in the same row, to the left and right.
    [i, mod(j - 1, cols)],
    [i, mod(j + 1, cols)],
    // The three cells in the row below.
    [mod(i + 1, rows), mod(j - 1, cols)],
    [mod(i + 1, rows), j],
    [mod(i + 1, rows), mod(j + 1, cols)]
  ];
}

/* Returns the integer b, 0 <= b < n, such that b is congruent to a mod n.
 *
 * We don't use `a % n` because that gives remainder, not congruence.
 * For example, `-1 % 5` returns `-1`, whereas `mod(-1, 5)` returns `4`.
 */
function mod(a: number, n: number): number {
  return (((a % n) + n) % n);
}

/* Returns 1 (alive) or 0 (dead) based on the cell's current state and the
 * number of live neighbors it has.
 */
function transitionRule(cellState: number, countOfLiveNeighbors: number): number {
  if (cellState == 1 && (countOfLiveNeighbors == 2 || countOfLiveNeighbors == 3)) {
    // If a live cell has 2 or 3 live neighbors, it stays alive.
    return 1;
  } else if (cellState == 0 && countOfLiveNeighbors == 3) {
    // If a dead cell has 3 live neighbors, it becomes alive.
    return 1;
  } else {
    // Otherwise, the cell dies.
    return 0;
  }
}

/* Returns the number of live cells in a given array of coordinates.
 *
 * This is used to count the number of live neighbors for a cell, but it can
 * count the number of live cells for any arbitrary array of cell coordinates
 * in a given grid.
 */
function countLiveCells(coords: Array<Coord>, grid: Grid): number {
  let sum = 0;
  for (let coord of coords) { // `for..of` loop is much faster than `reduce()`
    sum += grid[coord[0]][coord[1]];
  }
  return sum;
}