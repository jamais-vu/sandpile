import { assert } from 'chai';
import { Point } from '../Point';
/* Tests for Point class. */
describe("Point", () => {
    const point = new Point(0, 0);
    describe("hash()", () => {
        const expected = '0,0';
        it(`new Point(0, 0) has hash ${expected}`, () => {
            assert.strictEqual(point.hash(), expected);
        });
    });
    // TODO: This is actually a tricky one because we want to compare Points, not [number, number].
    // Point class might be more of a headache than it's worth.
    describe("getNeighborPoints()", () => {
        const point = new Point(0, 0);
        const neighborCoords = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1] // x === 1
        ];
        const expectedNeighborPoints = [];
        for (let coord of neighborCoords) {
            expectedNeighborPoints.push(new Point(...coord));
        }
        assert.deepEqual(point.getNeighborPoints(), expectedNeighborPoints);
    });
});
