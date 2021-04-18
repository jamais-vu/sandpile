import { Controller } from './Controller.js';
import { addEventListeners, fitCanvasToWindow, windowSizeCheck } from './html-helpers.js';
import { rules as sandpileRules } from './rules/sandpile.js';
import { rules as lifeRules } from './rules/life.js';
/** @fileoverview Sets up canvas, defines cell size, and creates Controller.
 *
 * The Controller initialization takes care of creating the CellularAutomaton
 * and Drawing. All we need to give the Controller is the canvas, the rules
 * defining the cellular automaton's behavior, and the cell size.
 *
 * Cellular automaton rules are placed in a map, and the name of a specific
 * cellular automaton is used to select which one we use.
 */
/* If the browser window is small, suggest the user resize it. */
windowSizeCheck(window.innerWidth, window.innerHeight);
/* Set up the canvas. */
let canvas = document.getElementById('gridCanvas');
fitCanvasToWindow(canvas, true); // `true` makes it square. `false`, a rectangle
/* A Map of cellular automaton rules. We could use this to select them at runtime. */
const CARules = new Map([
    ['life', lifeRules],
    ['sandpile', sandpileRules],
]);
const selectedRules = CARules.get('sandpile');
/* Create the Controller. */
const cellSize = 10; // Size, in pixels, of square cells we draw
let controller = Controller.createControllerFromRules(canvas, selectedRules, cellSize);
addEventListeners(controller); // HTML buttons will call Controller methods.
controller.animationStart(); // And now the web app is fully initialized.
