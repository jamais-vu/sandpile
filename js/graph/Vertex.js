import { Point } from './Point';
/* A Vertex in the sandpile. */
export class Vertex extends Point {
    /* Initially a Vertex has no neighbors. We set these after creation. */
    constructor(x, y, grains = 0) {
        super(x, y);
        this.neighbors = [];
        this.grains = grains;
    }
    /* Checks whether the Vertex is stable. */
    isStable() {
        if (this.grains >= 4) { // NOTE: Can swap this out for a `maxGrains` arg to generalize
            return false;
        }
        else {
            return true;
        }
    }
    /* Adds a Vertex to this Vertex's neighbors. Used in LatticeGraph setup. */
    addNeighbor(vertex) {
        this.neighbors.push(vertex);
    }
    getNeighbors() {
        return this.neighbors;
    }
    /* Override toString() method for pretty printing. */
    toString() {
        return `Vertex: (${this.hash()}), grains: ${this.grains}, stable: ${this.isStable()}\n` +
            `        neighbors: ${this.neighborsToString()}`;
    }
    /* Returns a string of the xy-coordinates of this Vertex's neighbors. */
    neighborsToString() {
        let str = '';
        for (let neighbor of this.neighbors) {
            str += `(${neighbor.hash()}), `;
        }
        return str.slice(0, -2); // Cut off the final trailing ', '
    }
}
