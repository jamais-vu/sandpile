import { assert } from 'chai';
import { Vertex } from '../Vertex';
/* Tests for Vertex class. */
describe("Vertex", () => {
    // TODO: Maybe we don't need this since it's inherited from Point (which we
    //       test) and is not overriden.
    describe("this.hash()", () => {
        const actual = (new Vertex(0, 0)).hash();
        const expected = '0,0';
        it(`new Vertex(0,0) has hash ${expected}`, () => {
            assert.strictEqual(actual, expected);
        });
    });
    describe("this.isStable()", () => {
        const stableVertex = new Vertex(0, 0); // default: 0 grains -> stable
        const unstableVertex = new Vertex(0, 0, 4); // 4 grains -> unstable
        assert.isTrue(stableVertex.isStable());
        assert.isFalse(unstableVertex.isStable());
    });
    describe("this.addNeighbor(), this.getNeighbors()", () => {
        const vertex = new Vertex(0, 0);
        const neighbor = new Vertex(1, 1);
        assert.deepEqual(vertex.getNeighbors(), [], "Vertex (0, 0) has no neigbhors");
        vertex.addNeighbor(neighbor);
        assert.deepEqual(vertex.getNeighbors(), [neighbor], "Vertex (0,0) has one neighbor: Vertex (1, 1)");
    });
    describe("this.toString()", () => {
        // We add some stuff to this to make it more interesting than plain (0, 0).
        const vertex = new Vertex(12, 9, 5);
        vertex.addNeighbor(new Vertex(1, 1));
        vertex.addNeighbor(new Vertex(2, 2));
        const expected = `Vertex: (12,9), grains: 5, stable: false\n` +
            `        neighbors: (1,1), (2,2)`;
        assert.strictEqual(vertex.toString(), expected);
    });
    describe("this.neighborsToString()", () => {
        const vertex = new Vertex(0, 0);
        vertex.addNeighbor(new Vertex(1, 1));
        vertex.addNeighbor(new Vertex(2, 2));
        const expected = '(1,1), (2,2)';
        assert.strictEqual(vertex.neighborsToString(), expected);
    });
});
