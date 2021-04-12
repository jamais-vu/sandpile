import { CellularAutomaton } from './CellularAutomaton.js';
import { Controller } from './Controller.js';
import { newZerosGrid } from './grid.js';
import { transition } from './transitions.js';
import { addEventListeners, windowSizeCheck } from './html-helpers.js';
import { minusOneIfEven } from './util/minusOneIfEven.js';
/* script sets up sandpile model, drawing controller, and some buttons. */
/* Checks the browser window is large enough for optimal viwewing. */
windowSizeCheck(window.innerWidth, window.innerHeight);
// Canvas setup
/* Get height of the toolbar, then set canvas dimensions to fill remainder.
 * We do this so the user doesn't have to scroll to see the full grid. */
const toolbar = document.getElementById('toolbar');
const canvasSize = Math.min((window.innerWidth), (window.innerHeight - toolbar.offsetHeight));
/* We make the canvas a square, using the lesser of its height and width. */
const canvas = document.getElementById('gridCanvas');
canvas.width = canvasSize;
canvas.height = canvasSize;
// Sandpile Cellular Automaton setup
/* Using a preset cell size, we calculate the maximum number of rows and columns
 * that will fit in the canvas.
 * Since we add grains to the center of the grid, we make sure rows and cols are
 * odd numbers, so the sandpile will look nicely symmetrical. */
const cellSize = 10; // Cell square side length, in pixels.
const rows = minusOneIfEven(Math.floor(canvas.height / cellSize));
const cols = minusOneIfEven(Math.floor(canvas.width / cellSize));
/* We create a square sandpile with a grid of empty cells, and a transition
 * function which adds grains to the center cell. */
let grid = newZerosGrid(Math.min(rows, cols), Math.min(rows, cols));
let sandpile = new CellularAutomaton(grid, transition);
// Drawing setup
/* Map of cell states to fillStyle RGB strings.
 * Cells are colored yellow (it is a sandpile after all).
 * We divide 255 by cellState to determine how dark the cell color is.
 * The brighter a cell is, the more grains it has.
 * Except for white, which means the cell has 0 grains. */
const cellColors = new Map([
    [1, `rgb(${255 / 3}, ${255 / 3}, 0)`],
    [2, `rgb(${255 / 2}, ${255 / 2}, 0)`],
    [3, `rgb(255, 255, 0)`],
]);
/* Create a new Controller instance with everything we just set up.
 * This object handles everything. */
const animationFrameDelay = 0; // Time (ms) between frames. We use 0 for sandpile.
let controller = new Controller(canvas, sandpile, cellSize, cellColors);
addEventListeners(controller);
controller.animationStart(); // And now the web app is fully initialized.
