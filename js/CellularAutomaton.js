import { copyGrid } from './grid.js';
// TODO: Generic typing is to support further args for transition function.
// Defining the class `CellularAutomaton<InputT = void>`, with `void` by default so it's optional,
// would allow us to type it for transitionFunction inputs, instead of `any`.
// But some testing makes me thinks it's way overengineering this, more of a pain
// than it's worth, anything else using this has to be changed to work with that.
// I'll just set input type to `any`.
// Fun idea though.
/** Encapsulates state transitions and history for a 2D grid of cells. */
export class CellularAutomaton {
    /** Create a CellularAutomaton.
     * @param {Grid} grid - A 2D array of cell states, represented as numbers.
     * @param transitionFunction
     */
    constructor(grid, transitionFunction) {
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
        this.transitionFunction = transitionFunction;
        this.step = 0;
        /* `history` is a stack of previous grid states.
         * At step = n, the indices `history[0], ... history[i], ... history[n - 1]`
         * correspond the state of the grid at step = i.
         * Note that the current step n is never in the history. The last index is
         * always `n - 1`, or if step = 0, the history is empty. */
        this.history = [];
    }
    /** Moves the grid state backward one step. If at step 0, does nothing.
     * @modifies {this.grid}
     * @modifies {this.step}
     * @modifies {this.history}
     */
    previousStep() {
        if (this.step > 0) {
            // Remove the most recent state from history and set cells to it.
            this.grid = this.history.pop();
            this.step -= 1;
        }
    }
    /** Moves the grid state forward one step.
     * @modifies {this.grid}
     * @modifies {this.step}
     * @modifies {this.history}
     */
    nextStep() {
        /* We push a deep copy to history because the transition function we use
         * mutates grid, doesn't just return a new grid. In fact we don't really
         * need the return value due ot that. */
        this.history.push(copyGrid(this.grid));
        this.transitionFunction(this.grid);
        this.step += 1;
    }
    /** Transitions grid state to step n, via calls to nextStep/previousStep.
     * If already at step n, does nothing.
     * @modifies {this.grid}
     * @modifies {this.step}
     * @modifies {this.history}
     */
    goToStep(n) {
        if (n > this.step) {
            // Step is in the future.
            const stepsToGo = (n - this.step);
            for (let i = 1; i <= stepsToGo; i++) {
                this.nextStep();
            }
        }
        else if (n < this.step) {
            // Step is in the past.
            const stepsToGo = (this.step - n);
            for (let i = 1; i <= stepsToGo; i++) {
                this.previousStep();
            }
        }
    }
    /** Returns the previous grid state, or undefined if at step 0.
     * @nosideeffects
     */
    getPreviousGrid() {
        if (this.step > 0) {
            return this.history[this.step - 1];
        }
        else {
            return undefined;
        }
    }
    /** Returns the current state of the cell ij.
     * @nosideeffects
     */
    getCellState(i, j) {
        return this.grid[i][j];
    }
    /** Sets the curent state of the cell ij.
     * @modifies {this.grid}
     */
    setCellState(i, j, state) {
        this.grid[i][j] = state;
    }
    /** Returns the previous state of the cell ij, or NaN if there is none.
     * @nosideeffects
     */
    getPreviousCellState(i, j) {
        if (this.step === 0) {
            return NaN;
        }
        else {
            // Element `this.history[this.step - 1]` is the cells at the previous step
            return this.history[this.step - 1][i][j];
        }
    }
    /** Changes transition function, for a cellular automaton that supports more than one.
     * @modifies {this.transitionFunction}
     */
    setTransitionFunction() {
        // TODO: stub
        // In practice this exists to swap between adding grains randomly to the
        // sandpile vs to the center.
    }
}
