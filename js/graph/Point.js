/* Integer point in a 2D space. */
export class Point {
    /* Rest parameter gives greater flexibility in constructor: we can pass two
     * numbers `x` and `y`, or an array of two numbers. */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    ;
    /** Simple hash function for unique identifier string of a Point.
     * @nosideffects
     */
    hash() {
        return `${this.x},${this.y}`;
    }
    /**
     * Returns an array of all 8 points adjacent to this Point.
     * NOTE: Currently this gets the Moore neighbors (eight adjacent cells).
     * The grid version of the sandpile, only the von Neumann neighbors (four
     * directly adjacent cells) are considered.
     * But in the future this graph version will not use coordinates at all.
     * @nosideffects
     */
    getNeighborPoints() {
        let neighborPoints = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i == 0 && j == 0)) { // Don't add this Point's (x, y) coordinate
                    neighborPoints.push(new Point(this.x + i, this.y + j));
                }
            }
        }
        return neighborPoints;
    }
}
