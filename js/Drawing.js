/** Encapsulates canvas context, cell drawing parameters, and canvas drawing functions. */
export class Drawing {
    /** Create a Drawing.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cellSize - Size (pixels) of each square cell in the grid.
     *   It isn't technically used for size (the next two properties are). But it
     *   is used to figure out the position to draw each cell on the canvas.
     * @param {Map<number, string>} cellColors - A Map of cell states to fillStyle RGB strings.
     */
    constructor(ctx, cellSize, cellColors) {
        this.ctx = ctx;
        this.cellSize = cellSize;
        /* We use `cellSize - 1` as the side lengths when we actually draw cells,
         * because otherwise a cell with upper-left coordinate (x, y) and
         * height/width of `cellSize` will overlap with the cell below it, the cell
         * to right of it, and the cell to the lower-right of it, since those have
         * one of `x + cellSize` or `y + cellSize` in their upper-left coordinate. */
        this.cellWidth = cellSize - 1;
        this.cellHeight = cellSize - 1;
        this.cellColors = cellColors;
    }
    /** Goes through each row and column in currentGrid and draws each cell.
     * @param {'full' | 'next'} option
     * The string option specifies how to draw each cell:
     *  'full':
     *   Draw every cell regardless of whether it changed in the past step.
     *   Use this if the previous state is not already drawn.
     *
     * 'next':
     *   Draw only cells whose states have changed from the previous step.
     *   This should only be used when the previous step has been drawn on the
     *   canvas, otherwise it will incorrectly display the current state of cells.
     *
     *   For example, if we move from step 0 to step 10 without drawing any of the
     *   intermediate steps, then the only cells which will be drawn on the canvas
     *   are those which changed from step 9 to step 10. Cells which changed in
     *   steps 0 through 9 are displayed unchanged from their state at step 0.
     *
     * @modifies {this.ctx}
     */
    drawGrid(option, rows, cols, currentGrid, previousGrid) {
        for (let i = 0; i < rows; i++) { // i is y-axis (row index).
            for (let j = 0; j < cols; j++) { // j is x-axis (column index).
                const cellState = currentGrid[i][j];
                /* The undefined check means even if we called this with 'next', we can
                 * recover from having no previousGrid by simply drawing all cells */
                if (option === 'next' && previousGrid !== undefined) {
                    if (cellState !== previousGrid[i][j]) {
                        // Only draw the cell if its state changed from the previous step.
                        this.drawCell(i, j, cellState);
                    }
                }
                else {
                    this.drawCell(i, j, cellState);
                }
            }
        }
    }
    // TODO: If the frequent changing of ctx.fillStyle is a performance hit maybe
    //       we could split cells into groups by state and color all cells of the
    //       same state at once.
    /** Draws the cell at grid[i]][j] on the canvas, colored based on its state.
     * Empty cells (state === 0) are clear.
     * Non-empty cells are colored by state, as defined in `this.cellColors`.
     * @modifies {this.ctx}
     */
    drawCell(i, j, cellState) {
        /* Arguments for clearRect() and fillRect() */
        const rectArgs = [
            (j * this.cellSize),
            (i * this.cellSize),
            this.cellWidth,
            this.cellHeight, // height (square, so equal to width))
        ];
        if (cellState === 0) {
            // Empty cell has no color.
            this.ctx.clearRect(...rectArgs);
        }
        else {
            // Get non-empty cell color from `this.cellColors`.
            this.ctx.fillStyle = this.cellColors.get(cellState);
            this.ctx.fillRect(...rectArgs);
        }
    }
    /** Draws the gridlines separating each cell.
     * @modifies {this.ctx}
     */
    drawGridLines(color, rows, cols) {
        this.ctx.fillStyle = color;
        for (let i = 0; i < rows; i++) { // i is y-axis (row index).
            for (let j = 0; j < cols; j++) { // j is x-axis (column index).
                this.ctx.strokeRect(j * this.cellSize, i * this.cellSize, this.cellWidth, this.cellHeight);
            }
        }
    }
}
