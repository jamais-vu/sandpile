/**
 * @fileoverview Gets von Neumann neighbors of cells on a 2D square lattice.
 *
 * Def: Given a cell C with coordinates (x, y), its VON NEUMANN NEIGHBORS are
 * the cells directly above, left, right, and below cell C.
 *
 * Diagram:
 *             x - 1           x           x + 1
 *  y - 1  |            | (x, y - 1)  |            |
 *  y      | (x - 1, y) | C = (x, y)  | (x + 1, y) |
 *  y + 1  |            | (x, y + 1)  |            |
 *
 * The cell C = (x, y) has neighbors: (x, y-1), (x-1, y), (x+1, y) and (x, y+1).
 */
/** Gets von Neumann neighbors of the given coordinate ij.
 * @nosideffects
 */
export function getNeighborCoords(coord, iMax, jMax) {
    if (coordOnEdge(coord, iMax, jMax)) {
        // If the coord is on an edge of the grid, we need to filter its neighbors.
        return filterNeighborCoords(getNeighborCoordsInterior(coord), iMax, jMax);
    }
    else {
        // Otherwise all its neighbors are valid.
        return getNeighborCoordsInterior(coord);
    }
}
/** Gets all neighbors of a coordinate on the interior of the grid.
 * @nosideffects
 */
function getNeighborCoordsInterior(coord) {
    const i = coord[0];
    const j = coord[1];
    return [
        [i - 1, j],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j] // directly below
    ];
}
/** Returns all given coords ij for which 0 <= i <= iMax, 0 <= j <= jMax.
 * Note: This could be a one-liner,
 *   `neighborCoords.filter(coord => coordInBounds(coord, iMax, jMax))`
 * but if we're running this often, the `for..of` loop is typically faster.
 * @nosideffects
 */
function filterNeighborCoords(neighborCoords, iMax, jMax) {
    let filteredCoords = [];
    for (let coord of neighborCoords) {
        if (coordInBounds(coord, iMax, jMax)) {
            filteredCoords.push(coord);
        }
    }
    return filteredCoords;
}
/** Checks if the given coord [i, j] has 0 <= i <= iMax and 0 <= j <= jMax.
 * @nosideffects
 */
function coordInBounds(coord, iMax, jMax) {
    return ((0 <= coord[0] && coord[0] <= iMax)
        && (0 <= coord[1] && coord[1] <= jMax));
}
/** Checks if given coord is on an edge.
 * Assumes coord is not below (0, 0) or above (iMax, jMax), i.e. that the coord
 * is still "on" the grid.
 * @nosideeffects
 */
function coordOnEdge(coord, iMax, jMax) {
    return (coord[0] === 0
        || coord[0] === iMax
        || coord[1] === 0
        || coord[1] === jMax);
}
