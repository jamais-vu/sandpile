Implementation of [Abelian sandpile](https://en.wikipedia.org/wiki/Abelian_sandpile_model) on a rectangular grid.

# Graph
`LatticeGraph` is a graph formulation of the sandpile. Instead of a grid, we have a collection of vertices, each of which has an array of references to adjacent vertices.

This might be a problem for rendering.

Problem I've been inadvertently stumbling over is how to identify the vertices. So far I've been using their coordinates, but I wonder if there's a better way.