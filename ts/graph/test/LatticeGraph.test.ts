import * as mocha from 'mocha';
import { assert } from 'chai';

import { LatticeGraph } from '../LatticeGraph';
import { Vertex } from '../Vertex';

describe("LatticeGraph", () => {

  describe("constructor", () => {
    it("new LatticeGraph has expected `this.vertices` and expected `this.vertexmap`", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(2, 2);
      const expectedVertexCoords: Array<[number, number]> = [[0, 0], [0, 1], [1, 0], [1, 1]];
      assert.strictEqual(latticeGraph.vertices.length, 4, "Has expected number of vertices");

      for (let coord of expectedVertexCoords) {
        assert.isDefined(latticeGraph.getVertex(...coord), "Contains expected coord");
      }
    });

    it("new LatticeGraph has vertex neighbors initalized", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(5, 5);

      /* Neighbors of Vertex (0, 0). NOTE: THIS IS USING 8 ADJACENT NEIGHBORS, NOT 4.
       * Should be array containing Vertex (0, 1), Vertex (1, 0), and Vertex (1, 1). */
      const neighbors: Array<Vertex> = latticeGraph.getNeighborsOf(0, 0) as Array<Vertex>;
      const expectedHashes: [string, string, string] = ['0,1', '1,0', '1,1'];
      assert.strictEqual(neighbors.length, 3, "Vertex (0, 0) has three neighbors");

      // Since the only identifier is their coordinates, we check the hash.
      for (let neighbor of neighbors) {
        assert.oneOf(neighbor.hash(), expectedHashes, "Neighbor has one of expected coords");
      }
    });

    // TODO: Maybe stricter testing of `createUnlinkedVertices` and linkVertices`,
    // which are used in constructor. But the neighbors test might suffice.
  });

  describe(" this.addGrainToVertex(), this.getGrainsAtVertex(), and this.countGrains()", () => {
    it("Add 3 grains to Vertex (0, 0). It now has 3 grains.", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(2, 2);
      // Add 3 grains to vertex (0, 0)
      latticeGraph.addGrainToVertex(0, 0);
      latticeGraph.addGrainToVertex(0, 0);
      latticeGraph.addGrainToVertex(0, 0);
      const actual: number = latticeGraph.getGrainsAtVertex(0, 0) as number;
      assert.strictEqual(actual, 3, "Vertex (0, 0) has 3 grains.");
    });

    it("Add 1 grain to three different vertices. Each has 1 grain, and " +
       "this.countGrains() counts 3 grains total.", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(2, 2);
      latticeGraph.addGrainToVertex(0, 0);
      latticeGraph.addGrainToVertex(0, 1);
      latticeGraph.addGrainToVertex(1, 0);
      assert.strictEqual(latticeGraph.getGrainsAtVertex(0, 0), 1);
      assert.strictEqual(latticeGraph.getGrainsAtVertex(0, 1), 1);
      assert.strictEqual(latticeGraph.getGrainsAtVertex(1, 0), 1);
      assert.strictEqual(latticeGraph.getGrainsAtVertex(1, 1), 0, "No grains were added to (1, 1)");
      assert.strictEqual(latticeGraph.countGrains(), 3, "latticeGraph has 3 grains total");
    });

    it("Add grains to a coordinate not in the graph. Total grain count doesn't change.", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(2, 2);
      // Neither of these coords corresponds to a Vertex in the latticeGraph.
      latticeGraph.addGrainToVertex(-1, -1);
      latticeGraph.addGrainToVertex(2, 2);
      assert.strictEqual(latticeGraph.countGrains(), 0);
    });

    it("Get grains from a coordinate not in the graph. Returns undefined.", () => {
      const latticeGraph: LatticeGraph = new LatticeGraph(2, 2);
      assert.isUndefined(latticeGraph.getGrainsAtVertex(-1, -1));
      assert.isUndefined(latticeGraph.getGrainsAtVertex(2, 2));
    });
  });


});