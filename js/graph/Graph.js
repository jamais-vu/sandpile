import { HashMap } from './HashMap';
// TODO: Not really sure what I want from this class.
/* A Graph, implemented as a HashMap of Vertex hashes to Vertices.
 *
 * We use it as a directed graph, but it could be either, depending on how
 * you set up the edges.
 */
class Graph {
    constructor(vertices) {
        this.vertices = new HashMap(vertices);
        this.edges = this.createEdges(vertices);
    }
    createNeighbors() {
        // TODO
    }
    createEdges(vertices) {
        let edges = new Map();
        for (let vertex of vertices) {
            // this.edges.add(vertex, )
        }
        return edges;
    }
}
