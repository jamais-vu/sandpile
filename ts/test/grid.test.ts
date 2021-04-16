import * as mocha from 'mocha';
import { assert } from 'chai';

import { copyGrid, findBounds, getMinAndMaxBounds, newRandomGrid, newZerosGrid, sumGrid, getVertexID, createVertexGroups, createVertexGroupsMap } from '../grid';
import { Coord, Grid, VertexGroups } from '../util/types';

describe("grid", () => {

  describe("newZerosGrid", () => {
    it("5x7 zeros grid is created as expected", () => {
      const actualGrid: Grid = newZerosGrid(5, 7);
      const expectedGrid: Grid = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ];
      assert.deepEqual(actualGrid, expectedGrid);
    });
  });

  describe("newRandomGrid", () => {
    it("All values in 5x7 newRandomGrid are at least 0 and at most n", () => {
      const n: number = 3;
      const grid: Grid = newRandomGrid(5, 7, n);

      /* We check each value in the grid. */
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          const actual: number = grid[i][j];
          assert.isAtLeast(actual, 0, "Value is greater than or equal to 0");
          assert.isAtMost(actual, n, `Value is less than or equal to ${n}`);
        }
      }
    });

    it("Calling newRandomGrid with n = 0 returns an empty grid", () => {
      const n: number = 0
      const emptyGrid: Grid = newZerosGrid(5, 7);
      const randomGrid: Grid = newRandomGrid(5, 7, n);

      assert.deepEqual(randomGrid, emptyGrid, "randomGrid is all zeros.");
    });
  });

  describe("copyGrid", () => {
    it("copyGrid returns a new grid deeply equal to the given grid", () => {
      const grid: Grid = newRandomGrid(5, 7, 4);
      const copy: Grid = copyGrid(grid);
      assert.deepEqual(grid, copy);
    });
  });

  describe("sumGrid", () => {
    it("new zeros grid has sum of 0", () => {
      const actual: number = sumGrid((newZerosGrid(2, 2)));
      assert.strictEqual(actual, 0);
    });

    it("test grid [[1, 1], [0, 3]] has sum of 5", () => {
      const actual = sumGrid([
        [1, 1],
        [0, 3]
      ]);
      assert.strictEqual(actual, 5);
    });
  });

  describe("findBounds", () => {
    /* `findBounds` is only intended for sandpile grids where we add grains to
     * the center, so every index ij we test is either on the center row or the
     * center column.
     *
     * For these tests specifically, keep in mind the middle index of an array
     * of length 999 is 499:
     *  -  indices 0 through 498 (inclusive) is 499 elements
     *  -  indices 500 through 998 (inclusive) is 499 elements
     * for 998 in total.
     */
    it("Returns center ij indices on an empty grid", () => {
      const emptyGrid: Grid = newZerosGrid(999, 999);
      const actual: Coord = findBounds(emptyGrid);
      const expected: Coord = [499, 499];
      assert.deepEqual(actual, expected);
    });

    it("Returns first non-empty i index, center j index ", () => {
      const grid: Grid = newZerosGrid(999, 999);
      grid[200][499] = 1; // Where it should stop.
      grid[201][499] = 1; // It shouldn't reach this index.
      const actual: Coord  = findBounds(grid);
      const expected: Coord  = [200, 499];
      assert.deepEqual(actual, expected);
    });

    it("Returns center i index, first non-empty j index ", () => {
      const grid: Grid = newZerosGrid(999, 999);
      grid[499][200] = 1; // Where it should stop.
      grid[499][201] = 1; // It shouldn't reach this index.
      const actual: Coord  = findBounds(grid);
      const expected: Coord  = [499, 200];
      assert.deepEqual(actual, expected);
    });

    it("Returns first non-empty i index, first non-empty j index", () => {
      const grid: Grid = newZerosGrid(999, 999);
      grid[200][499] = 1; // Where it should stop for i.
      grid[499][300] = 1; // Where it should stop for j.
      const actual: Coord = findBounds(grid);
      const expected: Coord  = [200, 300];
      assert.deepEqual(actual, expected);
    });
  });

  describe("getMinAndMaxBounds", () => {
    /* Like `findBounds`, this is only intended for sandpile grids where we add
     * grains to the center.
     *
     * See `describe("findBounds"...)` comment for more details, or the function
     * docs themselves. */
    it("Returns center coordinates for an empty grid", () => {
      const emptyGrid: Grid = newZerosGrid(999, 999);
      const actual: [Coord, Coord] = getMinAndMaxBounds(emptyGrid);
      const expected: [Coord, Coord] = [[499, 499], [499, 499]];
      assert.deepEqual(actual, expected);
    });

    it("Returns expected coordinates for non-empty grid", () => {
      const grid: Grid = newZerosGrid(999, 999);
      grid[200][499] = 1; // Where it should stop for i.
      grid[499][300] = 1; // Where it should stop for j.
      const actual: [Coord, Coord] = getMinAndMaxBounds(grid);
      const expected: [Coord, Coord] = [[200, 798], [300, 698]];
      assert.deepEqual(actual, expected);
    });
  });

  describe("experimental features, not in production", () => {

    describe("getVertexID", () => {
      // Does this even need a test, feels like overkill.
      it("vertexID is always one of 0, 1, 2, 3, or 4", () => {
        const expected: [number, number, number, number, number] = [0, 1, 2, 3, 4];
        for (let i = 0; i < 20; i++) {
          for (let j = 0; j < 20; j++) {
            assert.oneOf(getVertexID(i, j), expected, "vertexID is one of 0, 1, 2, 3, or 4");
          }
        }
      });

      it("getVertexID returns expected value for various (i, j)", () => {
        /* Checks every coord in the given coords has the expected vertexID. */
        function makeTest(coords: Array<Coord>, expected: number) {
          for (let coord of coords) {
            const actual: number = getVertexID(...coord);
            assert.strictEqual(actual, expected, `${coord} has vertexID ${expected}`);
          }
        }

        /* `zeros` have vertexID === 0, `ones` have vertexID === 1, etc... */
        const zeros: Array<Coord> = [[0, 0], [1, 2], [2, 4], [3, 1], [4, 3]];  // yellow
        const ones: Array<Coord> = [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]]; // blue
        const twos: Array<Coord> = [[0, 1], [1, 3], [2, 0], [3, 2], [4, 4]];   // red
        const threes: Array<Coord> = [[0, 4], [1, 1], [2, 3], [3, 0], [4, 2]];  // green
        const fours: Array<Coord> = [[0, 2], [1, 4], [2, 1], [3, 3], [4, 0]];   // black

        makeTest(zeros, 0);
        makeTest(ones, 1);
        makeTest(twos, 2);
        makeTest(threes, 3);
        makeTest(fours, 4);
      });
    });

    describe("createVertexGroupsArray", () => {
      it("Creates Array of vertex groups for a 5x5 grid as expected", () => {
        const grid: Grid = newZerosGrid(5, 5);
        const actual: VertexGroups = createVertexGroups(grid);
        // Note the pattern in expected coords
        const expected: VertexGroups = [
          [[0, 0], [1, 2], [2, 4], [3, 1], [4, 3]], // yellow (see pdf)
          [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]], // blue
          [[0, 1], [1, 3], [2, 0], [3, 2], [4, 4]], // red
          [[0, 4], [1, 1], [2, 3], [3, 0], [4, 2]], // green
          [[0, 2], [1, 4], [2, 1], [3, 3], [4, 0]], // black
        ];
        assert.deepEqual(actual, expected);
      });
    });

    describe("createVertexGroupsMap", () => {
      it("Creates Map of vertex groups for a 5x5 grid as expected", () => {
        const grid: Grid = newZerosGrid(5, 5);
        const actual = createVertexGroupsMap(grid);
        // Note the pattern in expected coords
        const expected: Map<number, Array<Coord>> = (new Map())
          .set(0, [[0, 0], [1, 2], [2, 4], [3, 1], [4, 3]]) // yellow
          .set(1, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]]) // blue
          .set(2, [[0, 1], [1, 3], [2, 0], [3, 2], [4, 4]]) // red
          .set(3, [[0, 4], [1, 1], [2, 3], [3, 0], [4, 2]]) // green
          .set(4, [[0, 2], [1, 4], [2, 1], [3, 3], [4, 0]]) // black
        assert.deepEqual(actual, expected);
      });
    });
  });

});