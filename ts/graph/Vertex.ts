import { Point } from './Point';

/* A Vertex in the sandpile. */
export class Vertex extends Point {
  neighbors: Array<Vertex>;
  grains: number;

  /* Initially a Vertex has no neighbors. We set these after creation. */
  constructor(x: number, y: number, grains: number = 0) {
    super(x, y);
    this.neighbors = [];
    this.grains = grains;
  }

  /* Checks whether the Vertex is stable. */
  isStable(): boolean {
    if (this.grains >= 4) { // NOTE: Can swap this out for a `maxGrains` arg to generalize
     return false;
    } else {
      return true;
    }
  }

  /* Adds a Vertex to this Vertex's neighbors. Used in LatticeGraph setup. */
  addNeighbor(vertex: Vertex): void {
    this.neighbors.push(vertex);
  }

  getNeighbors(): Array<Vertex> {
    return this.neighbors;
  }

  /* Override toString() method for pretty printing. */
  toString(): string {
    return `Vertex: (${this.hash()}), grains: ${this.grains}, stable: ${this.isStable()}\n` +
           `        neighbors: ${this.neighborsToString()}`;
  }

  /* Returns a string of the xy-coordinates of this Vertex's neighbors. */
  neighborsToString(): string {
    let str: string = '';
    for (let neighbor of this.neighbors) {
      str += `(${neighbor.hash()}), `;
    }
    return str.slice(0, -2); // Cut off the final trailing ', '
  }
}