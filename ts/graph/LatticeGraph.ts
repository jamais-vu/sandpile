import { Vertex } from './Vertex';
import { HashMap } from './HashMap';

// TODO: For the true graph version of the sandpile, we want a sink vertex.

// TODO: It's confusing we give the LatticeGraph rows and cols, but then use
//       x and y values, since x is cols and y is rows.

// NOTE: FOR THIS ONE EACH VERTEX HAS 8 ADJACENT NEIGHBORS!!

/* Graph where the Vertices represent integer points in a 2D lattice.
 * Each vertex (x, y) has 8 neighbrs: (x +/- 1, y +/- 1). */
export class LatticeGraph {
  rows: number;
  cols: number;
  vertices: Array<Vertex>;
  vertexMap: HashMap<Vertex>; // map of `${Vertex.x},${Vertex.y}` to Vertex`

  /* Creates a LatticeGraph with vertices connected to their neighbors. */
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.vertices = linkVertices(createUnlinkedVertices(rows, cols));
    this.vertexMap = new HashMap(this.vertices); // TODO: We also create one in linkVertices(), can we not repeat this?
  }

  /* Adds a grain to the vertex at xy, if such a vertex exists. */
  addGrainToVertex(x: number, y: number): void {
    let vertex = this.getVertex(x, y);
    if (vertex !== undefined) {
      vertex.grains += 1;
    }
  }

  /* Gets the count of grains at vertex xy. */
  getGrainsAtVertex(x: number, y: number): number | undefined {
    let vertex = this.getVertex(x, y);
    if (vertex !== undefined) {
      return vertex.grains;
    }
  }

  /* Gets the vertex at xy. */
  getVertex(x: number, y: number): Vertex | undefined {
    const key: string = `${x},${y}`;
    return this.vertexMap.get(key);
  }

  /* Gets the neighbors of the vertex at xy. */
  getNeighborsOf(x: number, y: number): Array<Vertex> | undefined {
    const key: string = `${x},${y}`;
    if (this.vertexMap.has(key)) {
      return (this.getVertex(x, y) as Vertex).getNeighbors();
    }
  }

  /* Returns the total number of grains of all vertices. */
  countGrains(): number {
    let sum: number = 0;
    for (let vertex of this.vertices) {
      sum += vertex.grains;
    }
    return sum;
  }

  // None of these class methods are relevant for the dynamics of the sandpile.
  // They're just for printing to console.

  /* Override toString() method for pretty printing. */
  toString(): string {
    let fullString: string = '';
    for (let vertex of this.vertices) {
      fullString += vertex.toString() + '\n';
    }
    return fullString;
  }

  /* Returns a 2d array representation of the LatticeGraph. */
  toGrid(): Array<Array<number>> {
    let grid: Array<Array<number>> = [];

    for (let y = 0; y < this.rows; y++) {
      let row: Array<number> = [];

      for (let x = 0; x < this.cols; x++) {
        let vertex: Vertex | undefined = this.vertexMap.get(`${x},${y}`);
        if (vertex instanceof Vertex) { // We do this bc typescript doesn't wnat us to push undefined
          row.push(vertex.grains as number); // but this should always be a number
        }
      }
      grid.push(row);
    }
    return grid;
  }

  /* Returns a string for easy viewing of grid layout. */
  toGridString(): string {
    let gridAsString = '';
    let grid = this.toGrid();
    for (let row of grid) {
      gridAsString += row.join('') + '\n';
    }
    return gridAsString;
  }

}


// Helper functions for constructor

/* rows+cols specify a rectangular integer lattice, we make vertices from those */
function createUnlinkedVertices(rows: number, cols: number): Array<Vertex> {
  let vertices: Array<Vertex> = [];

  // y is row, x is column.
  // This keeps the matrix representation compliant with how we visualize it.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      vertices.push(new Vertex(x, y));
    }
  }

  return vertices;
}

/* link the vertices we made from the lattice with their adjacent points */
function linkVertices(vertices: Array<Vertex>): Array<Vertex> {
  let vertexMap: HashMap<Vertex> = new HashMap(vertices);
  for (let vertex of vertices) {
    populateVertexNeighbors(vertex, vertexMap);
  }
  return vertices
}

/* Links the given Vertex with its neighbors, if they are in the vertexMap. */
function populateVertexNeighbors(vertex: Vertex, vertexMap: HashMap<Vertex>): void {
  const neighborPoints = vertex.getNeighborPoints();

  for (let point of neighborPoints) {
    // The Vertex corresponding to this Point, if it exists, is mapped to this key
    if (vertexMap.has(point.hash())) {
      // Push it to vertex.neighbors if it exists
      const neighborVertex = vertexMap.get(point.hash());
      vertex.addNeighbor(neighborVertex as Vertex);
    }
  }
}