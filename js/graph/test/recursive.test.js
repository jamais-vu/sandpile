import { assert } from 'chai';
import { LatticeGraph } from '../LatticeGraph';
import { addGrain as recursiveAddGrain } from '../recursive';
/* Tests for recursive solution, using LatticeGraph class. */
describe("Recursive Sandpile, 2x2 grid", () => {
    describe("addGrain (recursive)", () => {
        let sandpile = new LatticeGraph(2, 2);
        let vertex_00 = sandpile.getVertex(0, 0); // We know it exists.
        it("Vertex (0, 0) has 0 grains", () => {
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 0);
        });
        it("Vertex (0, 0) has 1 grain", () => {
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 1);
        });
        it("Vertex (0, 0) has 2 grains", () => {
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 2);
        });
        it("Vertex (0, 0) has 3 grains", () => {
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 3);
        });
        it("Sandpile has 3 grains in total", () => {
            assert.strictEqual(sandpile.countGrains(), 3);
        });
    });
    // This is a tricky one. Double-check it.
    // Best understood by walking through it in order.
    describe("topple (recursive)", () => {
        let sandpile = new LatticeGraph(2, 2);
        let vertex_00 = sandpile.getVertex(0, 0);
        let vertex_01 = sandpile.getVertex(0, 1);
        let vertex_10 = sandpile.getVertex(1, 0);
        let vertex_11 = sandpile.getVertex(1, 1);
        it("All vertices have 0 grains", () => {
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 0);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 0);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 0);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 0);
        });
        it("Vertex (0, 0) has 3 grains; others have 0 grains", () => {
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 3); // Vertex (0, 0)
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 0);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 0);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 0);
        });
        it("Vertex (0, 0) hits 4 grains and topples. It has 0 grains and others " +
            "each have 1 grain", () => {
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 0); // Vertex (0, 0)
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 1);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 1);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 1);
        });
        it("4 grains added to Vertex (0, 0). It topples again so it has 0 grains " +
            "and others each have 2 grains.", () => {
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 0); // Vertex (0, 0)
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 2);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 2);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 2);
        });
        it("Add grains until all vertices have 3 grains each. We have 12 grains in total.", () => {
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_00);
            recursiveAddGrain(vertex_01);
            recursiveAddGrain(vertex_10);
            recursiveAddGrain(vertex_11);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 3);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 3);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 3);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 3);
            assert.strictEqual(sandpile.countGrains(), 12);
        });
        it("Add 1 grain to (0, 0), triggering an 'avalanche' (cascade of topples). " +
            "Vertex (0, 0) ends up with 3 grains, and the others each have 2. We " +
            "lose 3 grains, from 12 total to 9 total.", () => {
            recursiveAddGrain(vertex_00);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 0), 3);
            assert.strictEqual(sandpile.getGrainsAtVertex(0, 1), 2);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 0), 2);
            assert.strictEqual(sandpile.getGrainsAtVertex(1, 1), 2);
            assert.strictEqual(sandpile.countGrains(), 9); // 3+2+2+2 grains total
        });
    });
});
