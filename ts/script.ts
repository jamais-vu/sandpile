import { CellularAutomaton } from './CellularAutomaton';
import { Controller } from './Controller';
import { newRandomGrid, newZerosGrid } from './grid';
import { Definition, Grid } from './util/types';
import { addEventListeners, windowSizeCheck } from './html-helpers';
import { minusOneIfEven } from './util/minusOneIfEven';

import { definition as sandpileDefinition } from './rules/sandpile';
import { definition as lifeDefinition } from './rules/life';

/** @fileoverview Sets up canvas, cellular automaton, drawing, and controller.
 *
 * The canvas is fitted to the window, and then a preset size (in pixels) for
 * cells in the grid we draw is used to determine the number of rows and columns
 * the grid can have while still fitting in the canvas.
 *
 * We create a CellularAutomaton which has a grid with that size, and then we
 * create a Controller which controls that CellularAutomaton.
 *
 * The Controller constructor also takes a map of cell states to RGB colors,
 * which it passes to the Drawing it creates.
 */


/* Checks the browser window is large enough for optimal viwewing, and if not,
 * prompts user to resize. */
windowSizeCheck(window.innerWidth, window.innerHeight);

// Canvas setup

let canvas: HTMLCanvasElement = document.getElementById('gridCanvas') as HTMLCanvasElement;
fitCanvasToWindow(canvas, true); // `true` makes it square. `false`, a rectangle

const cellSize: number = 10; // Size, in pixels, of square cells we draw

/* Create a new Controller instance with everything we just set up.
 * The Controller constructor creates the Drawing instance, we don't need to
 * initialize that here explicitly. */
let controller: Controller = createController(canvas, sandpileDefinition, cellSize);

addEventListeners(controller); // HTML buttons will call Controller methods.
controller.animationStart(); // And now the web app is fully initialized.


// Helper functions for setup

/** Fits the canvas to the window size, as a square or rectangle. */
function fitCanvasToWindow(canvas: HTMLCanvasElement, square: boolean = true) {
  const fittedCanvasHeight: number = (window.innerHeight - canvas.offsetTop);
  const fittedCanvasWidth: number = window.innerWidth - canvas.offsetLeft;

  if (square === true) {
    /* We make the canvas a square, using the lesser of its height and width. */
    const canvasSize: number = Math.min(fittedCanvasWidth, fittedCanvasHeight);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
  } else {
    /* We make the canvas a rectangle fitted to the window. */
    canvas.width = fittedCanvasWidth;
    canvas.height = fittedCanvasHeight
  }
}

/** Returns a grid fitted to the canvas, as determined by given cell size in pixels.
 * The grid is randomly-populated with values between 0 and maxCellValue.
 * If maxCellValue is 0, then the grid will be all zeros.
 *
 * TODO: We make sure the rows and cols are odd numbers for the sandpile, since
 * we add grains to the center. But this can be an optional arg.
 */
function createGridFittedToCanvas(canvas: HTMLCanvasElement, cellSize: number, maxCellValue: number = 0 ): Grid {
  const rows: number = minusOneIfEven(Math.floor(canvas.height / cellSize));
  const cols: number = minusOneIfEven(Math.floor(canvas.width / cellSize));
  return newRandomGrid(rows, cols, maxCellValue);
}

// TODO: Maybe this should be a static method of the Controller class.
/** Creates a Controller, with a CellularAutomaton which is fitted to canvas and
 * has rules and cell colors given by definition. */
function createController(canvas: HTMLCanvasElement, definition: Definition<any>, cellSize: number): Controller {
  const grid: Grid = createGridFittedToCanvas(canvas, cellSize, definition.maxInitialCellValue);
  const CA: CellularAutomaton = new CellularAutomaton(grid, definition.transitionFunction);
  return new Controller(canvas, CA, cellSize, definition.cellColors);
}
