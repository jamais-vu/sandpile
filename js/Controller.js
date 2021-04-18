import { CellularAutomaton } from './CellularAutomaton.js';
import { Drawing } from './Drawing.js';
import { createGridFittedToCanvas } from './grid.js';
import { updatePauseButton, updateStepCountText } from './html-helpers.js';
/** Layer between the user interface and the CellularAutomaton/Drawing.
 * Passes data from the CellularAutomaton to the Drawing for rendering on canvas.
 * TODO: Docs
 */
export class Controller {
    /** Create a Controller.
     * @param {HTMLCanvasElement} canvas
     * @param {CellularAutomaton} CA
     * @param {Drawing} drawing
     */
    constructor(canvas, CA, drawing) {
        this.canvas = canvas;
        this.CA = CA;
        this.drawing = drawing;
        this.delay = 0; // For now we don't use delay, just render next frame immediately.
        this.drawingPaused = true;
    }
    /** Creates a Controller, with new CellularAutomaton and Drawing instances,
     * from a canvas, cellular automaton rules, and cell size.
     * @param {HTMLCanvasElement} canvas - The canvas on which we draw the grid of cells.
     * @param {Rules} rules - Rules object defining how the cellular automaton
     *   should behave: the maximum initial value its cell should have, the color
     *   each cell state should be drawn with, and its transition function.
     * @param {cellSize} number - The size in pixels of the square cells we draw.
     */
    static createControllerFromRules(canvas, rules, cellSize) {
        /* Create a grid fitted to the canvas with the given cellSize. */
        const grid = createGridFittedToCanvas(canvas, cellSize, rules.maxInitialCellValue);
        /* Then create a CellularAutomaton instance with that grid and the
         * transition function from the cellular automaton rules. */
        const CA = new CellularAutomaton(grid, rules.transitionFunction);
        /* Create a Drawing for the canvas with given cellSize and cellColors. */
        const drawing = new Drawing(canvas.getContext('2d'), cellSize, rules.cellColors);
        return new Controller(canvas, CA, drawing);
    }
    /** Draws the gridlines and calls the animation loop.*/
    animationStart() {
        this.drawing.drawGridLines('black', this.CA.rows, this.CA.cols);
        this.drawing.drawGrid('full', this.CA.rows, this.CA.cols, this.CA.grid);
        this.animationLoop();
    }
    /** Animation frame loop for drawing the grid.
     * If not paused, moves the grid and drawing forward one step.
     * And whether or not it's paused, calls itself again with a delay.
     * @modifies {this.CA}
     */
    animationLoop() {
        if (this.drawingPaused === false) {
            this.moveToNextStep();
        }
        // Bind `this` to maintain context when passing the function to setTimeout.
        setTimeout(() => {
            requestAnimationFrame(this.animationLoop.bind(this));
        }, this.delay);
    }
    /** Moves Cellular Automaton to next step and calls Drawing to draw it.
     * @modifies {this.CA}
     */
    moveToNextStep() {
        this.CA.nextStep();
        this.drawing.drawGrid('next', this.CA.rows, this.CA.cols, this.CA.grid, this.CA.getPreviousGrid());
        updateStepCountText(this.CA.step);
    }
    goToStep(n) {
        this.pause();
        this.CA.goToStep(n);
        this.drawing.drawGrid('full', this.CA.rows, this.CA.cols, this.CA.grid);
        updateStepCountText(this.CA.step);
    }
    /** Pauses drawing.
     * @modifies {this.isPaused}
     */
    pause() {
        this.drawingPaused = true;
        updatePauseButton(this.drawingPaused);
    }
    /** Unpauses drawing.
     * @modifies {this.isPaused}
     */
    unpause() {
        this.drawingPaused = false;
        updatePauseButton(this.drawingPaused);
    }
    /** If drawing is paused, unpause it. If drawing is unpaused, pause it.
     * @modifies {this.isPaused}
     */
    togglePause() {
        if (this.drawingPaused) {
            this.unpause();
        }
        else {
            this.pause();
        }
    }
}
