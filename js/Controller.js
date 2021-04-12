import { Drawing } from './Drawing.js';
import { updatePauseButton, updateStepCountText } from './html-helpers.js';
/** Layer between the user interface and the model.
 * Separates the CellularAutomaton from the Drawing.
 */
export class Controller {
    /** Create a Controller.
     * @param {HTMLCanvasElement} canvas
     * @param {CellularAutomaton} CA
     * @param {number} cellsize - The size (px) of square cells to draw.
     * @param {Map<number, string>} cellColors - A Map of cell states to fillStyle RGB strings.
     * @param {number} delay - The time (ms) between each animation frame.
     */
    constructor(canvas, CA, cellSize, cellColors) {
        this.canvas = canvas;
        this.CA = CA;
        this.drawing = new Drawing(canvas.getContext('2d'), cellSize, cellColors);
        this.delay = 0;
        this.drawingPaused = true;
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
