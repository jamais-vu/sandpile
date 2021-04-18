import { getRandomElement } from '../util/random.js';
// TODO: This uses a lot of the same logic as the recursive implementation.
// Maybe we could factor that out. Or maybe I just don't use the recursive
// one, since it hits the call stack limit pretty fast.
let unstableVertices = [];
/* Adds one grain to a random vertex of the given sandpile, and topples vertices
 * until the pile is stable.
 */
export function step(sandpile) {
    addRandomGrain(sandpile);
    while (unstableVertices.length > 0) {
        // TODO: What happens if we added a Vertex to unstableVertices more than once?
        topple(unstableVertices.pop()); // Since length > 0, this will always be Vertex
    }
    return sandpile;
}
/* Adds a grain to a vertex at a randomly-chosen index. */
function addRandomGrain(sandpile) {
    addGrain(getRandomElement(sandpile.vertices));
}
/* Adds one grain to the vertex at ij, and if the vertex is now unstable, adds
 * it to unstableVertices.
 */
function addGrain(vertex) {
    console.log(`grain added to ${vertex.hash()}`);
    vertex.grains += 1;
    if (vertex.isStable() === false) {
        unstableVertices.push(vertex);
    }
}
/* Topples vertex ij. Reduces its grains by 4, and adds 1 grain to up to 4 neighbors. */
function topple(vertex) {
    console.log(`Toppling! ${vertex.hash()}`);
    vertex.grains = Math.max(0, vertex.grains - 4);
    let i = 1;
    for (let neighbor of vertex.neighbors) {
        if (i >= 4) {
            break; // NOTE: For grid we only want 4 max neighbors, but for graph with sink we have no limit
        }
        else {
            addGrain(neighbor);
        }
    }
}
