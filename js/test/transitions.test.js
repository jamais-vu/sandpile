import { assert } from 'chai';
import { getNeighborCoords } from '../util/getNeighborCoords';
import { newZerosGrid, sumGrid } from '../grid';
import { addGrainCenter, addGrainRandom, getUnstableVertices, topple, toppleUnstableVertices, toppleUntilStable, } from '../transitions';
/* Tests for transitions on Grid version of sandpile, no LatticeGraph or Vertex class. */
describe("transitions", () => {
    describe("addRandomGrain", () => {
        it("calling addRandomGrain n times adds n grains to the grid (no toppling performed)", () => {
            const grainsToAdd = 12; // 12 chosen randomly, can be arbitrary positive integer
            const grid = newZerosGrid(5, 7);
            for (let i = 0; i < grainsToAdd; i++) {
                addGrainRandom(grid);
            }
            assert.strictEqual(sumGrid(grid), grainsToAdd, `grid has ${grainsToAdd} grains`);
        });
    });
    describe("addGrainToCenter", () => {
        it("calling addGrainToCenter n times adds n grains to the center of the grid " +
            "(no toppling performed)", () => {
            const grainsToAdd = 12; // can be arbitrary positive integer
            /* Create a grid (must be odd dimensions) and find the center ij coord. */
            const rows = 5;
            const cols = 7;
            const grid = newZerosGrid(rows, cols);
            const iCenter = Math.floor(rows / 2);
            const jCenter = Math.floor(cols / 2);
            for (let i = 0; i < grainsToAdd; i++) {
                addGrainCenter(grid);
            }
            assert.strictEqual(grid[iCenter][jCenter], grainsToAdd, `grid center has ${grainsToAdd} grains`);
            assert.strictEqual(sumGrid(grid), grainsToAdd, 'Grains were only added to center');
        });
    });
    describe("getUnstableVertices", () => {
        it("new zeros grid has no unstable vertices", () => {
            const unstableVertices = getUnstableVertices(newZerosGrid(5, 5));
            assert.strictEqual(unstableVertices.length, 0);
            assert.deepEqual(unstableVertices, []);
        });
        it("grid [[4, 3], [0, 4]] has 2 unstable vertices: grid[0][0] and grid[1][1]", () => {
            const grid = [
                [4, 3],
                [0, 4]
            ];
            const unstableVertices = getUnstableVertices(grid);
            assert.strictEqual(unstableVertices.length, 2, "2 unstable vertices.");
            assert.deepEqual(unstableVertices, [[0, 0], [1, 1]]);
        });
        it("unstableVertices array has expected ordering of vertices.", () => {
            const grid = [
                [4, 3, 3],
                [0, 4, 4],
                [4, 3, 4]
            ];
            const unstableVertices = getUnstableVertices(grid);
            const expectedVertices = [[0, 0], [1, 1], [1, 2], [2, 0], [2, 2]];
            assert.strictEqual(unstableVertices.length, 5, "5 unstable vertices");
            for (let i = 0; i < unstableVertices.length; i++) {
                assert.deepEqual(unstableVertices[i], expectedVertices[i], "Unstable vertices appear in order we expect.");
            }
        });
    });
    describe("topple removes grains from toppled vertex", () => {
        /* Note in these "topple" tests we don't check grains were properly
        * distributed to neighbors. See the "toppleToNeighbors" test for that. */
        it("Topple a vertex with 4 grains. It now has 0 grains.", () => {
            const grid = [
                [4, 0],
                [0, 0]
            ];
            topple(grid, [0, 0]);
            assert.strictEqual(grid[0][0], 0);
        });
        it("Topple a vertex with 7 grains. It loses 4 grains and now has 3 grains.", () => {
            const grid = [
                [7, 0],
                [0, 0]
            ];
            topple(grid, [0, 0]);
            assert.strictEqual(grid[0][0], 3);
        });
    });
    describe("topple adds grains to toppled vertex's neighbors", () => {
        it("Topple a vertex with 4 grains but only 2 neighbors. " +
            "Each neighbor has 1 grain added, and 2 grains total are lost.", () => {
            /* Here we topple a corner vertex, which has 3 neighbors. */
            const grid = [
                [4, 0],
                [0, 0]
            ];
            const iMax = grid.length - 1;
            const jMax = grid[0].length - 1;
            const neighbors = getNeighborCoords([0, 0], iMax, jMax);
            assert.strictEqual(grid[0][0], 4, "Grid set up properly.");
            /* Topple the vertex and check its neighbors. */
            topple(grid, [0, 0]);
            assert.strictEqual(grid[0][0], 0, "Toppled vertex has 0 grains.");
            for (let coord of neighbors) {
                const neighborGrains = grid[coord[0]][coord[1]];
                assert.strictEqual(neighborGrains, 1, "Each neighbor has 1 grain.");
            }
            assert.strictEqual(sumGrid(grid), 2, "Grid has 2 grains total.");
        });
        it("Topple a vertex with 4 grains and 4 neighbors. " +
            "Each neighbor has 1 grain added, and the total grains in the grid is unchanged.", () => {
            /* Here we topple an interior vertex, which has 4 neighbors. */
            const grid = [
                [0, 0, 0],
                [0, 4, 0],
                [0, 0, 0]
            ];
            const iMax = grid.length - 1;
            const jMax = grid[0].length - 1;
            const neighbors = getNeighborCoords([1, 1], iMax, jMax);
            /* Topple the vertex and check its neighbors. */
            topple(grid, [1, 1]);
            for (let coord of neighbors) {
                const neighborGrains = grid[coord[0]][coord[1]];
                assert.strictEqual(neighborGrains, 1, "Neighbor has 1 grain.");
            }
            const expectedCount = sumGrid(grid);
            assert.strictEqual(expectedCount, 4, `Grid has 4 grains total.`);
        });
    });
    describe("toppleUnstablevertices", () => {
        it("Topples all currently-unstable vertices", () => {
            const grid = [
                [4, 0, 0],
                [0, 4, 0],
                [0, 0, 4]
            ];
            /* Step-by-step:
             * We expect them to topple in the order (0, 0), (1, 1), (2, 2).
             *
             * 1. After toppling (0, 0):
             *   [0, 1, 0]
             *   [1, 4, 0]
             *   [0, 0, 4]
             *
             * 2. After toppling (1, 1):
             *   [0, 2, 0]
             *   [2, 0, 1]
             *   [0, 1, 4]
             *
             * 3. After toppling (2, 2):
             *   [0, 2, 0]
             *   [2, 0, 2]
             *   [0, 2, 0]
             */
            const expectedgrid = [
                [0, 2, 0],
                [2, 0, 2],
                [0, 2, 0]
            ];
            toppleUnstableVertices(grid);
            assert.deepEqual(grid, expectedgrid);
        });
        it("Does not topple newly-created unstable vertices", () => {
            const grid = [
                [4, 3, 4],
                [0, 0, 0],
                [0, 0, 0]
            ];
            /* Step-by-step:
             * We expect them to topple in the order (0, 0), (0, 2).
             *
             * 1. After toppling (0, 0):
             *   [0, 4, 4]
             *   [1, 0, 0]
             *   [0, 0, 0]
             *
             * 2. After toppling (0, 2):
             *   [0, 5, 0]
             *   [1, 0, 1]
             *   [0, 0, 0]
             */
            const expectedGrid = [
                [0, 5, 0],
                [1, 0, 1],
                [0, 0, 0]
            ];
            toppleUnstableVertices(grid);
            assert.strictEqual(grid[0][0], 0, "Vertex (0, 0) toppled and has 0 grains");
            assert.strictEqual(grid[0][1], 5, "Vertex (0, 1) has 5 grains and did not topple");
            assert.strictEqual(grid[0][2], 0, "Vertex (0, 2) toppled and has 0 grains");
            assert.deepEqual(grid, expectedGrid);
        });
    });
    describe("toppleUntilStable", () => {
        it("grid two applications of toppleUnstablevertices()", () => {
            const grid = [
                [4, 3, 4],
                [0, 4, 0],
                [0, 0, 4]
            ];
            /* Step-by-step:
             * We expect them to topple in the order (0, 0), (0, 2), (1, 1), (2, 2).
             * Then on the second iteration, (1, 1) is toppled. Then the grid is stable.
             *
             * 1. After toppling (0, 0):
             *   [0, 4, 4]
             *   [1, 4, 0]
             *   [0, 0, 4]
             *
             * 2. After toppling (0, 2):
             *   [0, 5, 0]
             *   [1, 4, 1]
             *   [0, 0, 4]
             *
             * 3. After toppling (1, 1):
             *   [0, 6, 0]
             *   [2, 0, 2]
             *   [0, 1, 4]
             *
             * 4. After toppling (2, 2):
             *   [0, 6, 0]
             *   [2, 0, 3]
             *   [0, 2, 0]
             *
             * Then toppleUnstableVertices is run again, since (0, 2) is unstable.
             * 5. After toppling (0, 2):
             *   [1, 2, 1] Note that since (0, 2) had 6 grains, it now has 6 - 2 -> 4.
             *   [2, 1, 3]
             *   [0, 2, 0]
             */
            const expectedGrid = [
                [1, 2, 1],
                [2, 1, 3],
                [0, 2, 0]
            ];
            toppleUntilStable(grid);
            assert.deepEqual(grid, expectedGrid, "topple() iterated until grid is stable");
        });
        it("what happens when we topple a sandpile where all vertices have 4 grains?", () => {
            // const grid: Grid = [
            //   [4, 4, 4,],
            //   [4, 4, 4,],
            //   [4, 4, 4,]
            // ];
            // toppleUntilStable(grid);
            // TODO: What general behavior do we expect here?
        });
    });
    // TODO: transition()
});
