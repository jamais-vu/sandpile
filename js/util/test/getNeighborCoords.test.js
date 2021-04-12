import { assert } from 'chai';
import { getNeighborCoords } from '../getNeighborCoords';
/* Tests for getting valid neighbors of coordinates on an nxm grid. */
describe("getNeighborCoords, on a 5x7 grid", () => {
    /* We define parameters for a 5x7 grid.
     * We don't need to define a grid. iMax and jMax are sufficient. */
    const rows = 5;
    const cols = 7;
    const iMax = rows - 1; // 4
    const jMax = cols - 1; // 6
    it("getNeighborCoords for interior coord (3, 3)", () => {
        /* Diagram:
         *
         *     Col:  2   3   4
         *   Row    ___ ___ ___
         *   2     |___|_N_|___| N = neighbor
         *   3     |_N_|3,3|_N_|
         *   4     |___|_N_|___|
         */
        const interiorCoord = [3, 3];
        const actual = getNeighborCoords(interiorCoord, iMax, jMax);
        const expected = [
            [2, 3],
            [3, 2], [3, 4],
            [4, 3]
        ];
        assert.deepEqual(actual, expected, "(3, 3) has the expected neighbors.");
    });
    it("getNeighborCoords for side coord (0, 3)", () => {
        /* Diagram:
         *
         *     Col:  2   3   4
         *   Row    ___ ___ ___
         *   0     |_N_|0,3|_N_| N = neighbor
         *   1     |___|_N_|___|
         */
        const sideCoord = [0, 3];
        const actual = getNeighborCoords(sideCoord, iMax, jMax);
        const expected = [
            [0, 2], [0, 4],
            [1, 3],
        ];
        assert.deepEqual(actual, expected, "(0, 3) has the expected neighbors.");
    });
    it(`getNeighborCoords for corner coord (${iMax}, ${jMax})`, () => {
        /* Diagram:
         *
         *     Col:    jMax-1   jMax
         *   Row       _______ _______
         *   iMax - 1 |_______|___N___| N = neighbor
         *   iMax     |___N___|__4,6__|
         */
        const cornerCoord = [iMax, jMax];
        const actual = getNeighborCoords(cornerCoord, iMax, jMax);
        const expected = [
            [iMax - 1, jMax],
            [iMax, jMax - 1], // Cell to left
        ];
        assert.deepEqual(actual, expected, `(${iMax}, ${jMax}) has the expected neighbors.`);
    });
});
