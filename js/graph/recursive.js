import { getRandomElement } from '../util/random';
/* Recursive implementation of the sandpile step.
 *
 * We start by calling `step()`, which adds a grain to a random vertex.
 * If that vertex now has 4 or more grains, we topple it.
 *
 * Basically the callstack is a ton of addGrain() topple() addGrain() etc
 * and once we stop meeting the topple condition we work back up, until
 * eventually control flow is back in `step()`, at which point the sandpile
 * is known to be stable and then returned.
 */
// TODO: I don't like how this is modifying the vertices but it feels cleaner
// to do it this way than entirely in class methods.
// This way we separate the modifications from the data structures.
// If we use class methods then it's more confusing I think, since we're not
// just performing operations ON these data structures.
/* Adds one grain to a random vertex of the given sandpile, and topples vertices
 * until the pile is stable.
 */
export function step(sandpile) {
    addRandomGrain(sandpile);
    return sandpile;
}
/* Adds a grain to a vertex at a randomly-chosen index. */
function addRandomGrain(sandpile) {
    addGrain(getRandomElement(sandpile.vertices));
}
/* Adds one grain to the given vertex. If the vertex is unstable, topples it. */
export function addGrain(vertex) {
    // console.log(`grain added to ${vertex.hash()}`);
    vertex.grains += 1;
    if (vertex.isStable() === false) {
        topple(vertex);
    }
}
/* Topples vertex ij. Reduces its grains by 4, and adds 1 grain to up to 4 neighbors. */
function topple(vertex) {
    // console.log(`Toppling! ${vertex.hash()}`);
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
