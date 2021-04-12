import { HashMap } from './HashMap';
import { Vertex } from './Vertex';

// TODO: Not really sure what I want from this class.

/* A Graph, implemented as a HashMap of Vertex hashes to Vertices.
 *
 * We use it as a directed graph, but it could be either, depending on how
 * you set up the edges.
 */
class Graph {
  vertices: HashMap<Vertex>;
  edges: Map<Vertex, Array<Vertex>>;

  constructor(vertices: Array<Vertex>) {
    this.vertices = new HashMap(vertices);
    this.edges = this.createEdges(vertices);
  }

  createNeighbors() {
    // TODO
  }

  createEdges(vertices: Array<Vertex>): Map<Vertex, Array<Vertex>> {
    let edges: Map<Vertex, Array<Vertex>> = new Map();
    for (let vertex of vertices) {
      // this.edges.add(vertex, )
    }
    return edges;
  }

}