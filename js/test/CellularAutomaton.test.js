import { assert } from 'chai';
import { CellularAutomaton } from '../CellularAutomaton';
import { newZerosGrid } from '../grid';
import { transition } from '../transitions';
/* Tests for CellularAutomaton class.
 * These depend on the `grid` module. If those tests don't pass, these won't.
 */
describe("CellularAutomaton class", () => {
    /* We define this so we don't have to deal with typing for the optional string arg. */
    function transitionCenter(grid) {
        transition(grid);
    }
    // TODO: These are really really messy. But they pass lol.
    // TODO: Should write some for adding random grain too, not just to center.
    //       But random grain appears to be working from what I see in the web app.
    describe("constructor", () => {
        it("new CellularAutomaton() initializes as expected", () => {
            const grid = newZerosGrid(3, 3);
            const CA = new CellularAutomaton(grid, transitionCenter);
            assert.deepEqual(CA.grid, newZerosGrid(3, 3), "grid is correct");
            assert.strictEqual(CA.rows, 3, "rows is correct");
            assert.strictEqual(CA.cols, 3, "cols is correct");
            assert.equal(CA.transitionFunction, transitionCenter, "transitionFunction is correct");
            assert.strictEqual(CA.step, 0, "step is correct");
            assert.deepEqual(CA.history, [], "history is correct");
        });
    });
    describe("step methods", () => {
        describe("previousStep()", () => {
            it("previousStep() changes nothing at step 0", () => {
                const grid = newZerosGrid(3, 3); // step 0
                const CA = new CellularAutomaton(grid, transitionCenter);
                /* TODO: I can't get assert.doesNotChange() working.
                 * The binding seems necessary here, since passing `CA.previousStep`
                 * raises: "TypeError: Cannot read property 'step' of undefined"
                 * and I can't just pass `previousStep`.
                 * Maybe `call()`/`apply()` works? TODO: Try that
                 */
                // for (let propertyName of ['grid', 'step', 'history']) {
                //   assert.doesNotChange(CA.previousStep.bind(CA), CA, propertyName);
                // }
                CA.previousStep();
                assert.strictEqual(CA.step, 0, "Step still 0");
                assert.deepEqual(CA.history, [], "History still empty");
                assert.deepEqual(CA.grid, newZerosGrid(3, 3), "Grid is unchanged");
            });
            it("previousStep() moves back one step.", () => {
                const grid = newZerosGrid(3, 3); // step 0
                const CA = new CellularAutomaton(grid, transitionCenter);
                /* We start at step 0, and move to step 1 then step 2. */
                CA.nextStep(); // step 1
                CA.nextStep(); // step 2
                /* Then we move back to step 1 then step 0, checking as we go. */
                CA.previousStep(); // step 1
                const expectedHistory_1 = [newZerosGrid(3, 3)];
                const expectedGrid_1 = [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0]
                ];
                assert.deepEqual(CA.grid, expectedGrid_1);
                assert.strictEqual(CA.step, 1, "Step is 1");
                assert.deepEqual(CA.history, expectedHistory_1);
                CA.previousStep(); // step 0
                const expectedGrid_0 = [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ];
                assert.deepEqual(CA.grid, expectedGrid_0);
                assert.strictEqual(CA.step, 0, "Step is 0");
                assert.deepEqual(CA.history, [], "At step 0 history is empty.");
            });
        });
        describe("nextStep()", () => {
            it("nextStep() moves forward one step, adds previous grid to history. " +
                "Cells are changed as expected from transitionFunction.", () => {
                const grid = newZerosGrid(3, 3);
                const CA = new CellularAutomaton(grid, transitionCenter);
                /* Expected values for step 1. */
                const expectedGrid_1 = [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0]
                ];
                const expectedHistory_1 = [newZerosGrid(3, 3)];
                const expectedStep_1 = 1;
                /* After 1 step: We check grid, history, and step. */
                CA.nextStep();
                assert.deepEqual(CA.grid, expectedGrid_1, "grid has 1 grain at center, 0 elsewhere");
                assert.strictEqual(CA.getCellState(1, 1), 1, "center (1, 1) has 1 grain");
                assert.strictEqual(CA.step, expectedStep_1, "step advanced by 1");
                assert.deepEqual(CA.history, expectedHistory_1, "history has previous state");
                /* We check again for step 2. */
                const expectedGrid_2 = [
                    [0, 0, 0],
                    [0, 2, 0],
                    [0, 0, 0]
                ];
                const expectedHistory_2 = [newZerosGrid(3, 3), expectedGrid_1];
                const expectedStep_2 = 2;
                CA.nextStep();
                assert.deepEqual(CA.grid, expectedGrid_2, "grid has 2 grains at center, 0 elsewhere");
                assert.strictEqual(CA.getCellState(1, 1), 2, "center (1, 1) has 2 grains");
                assert.strictEqual(CA.step, expectedStep_2, "step advanced by 1");
                assert.deepEqual(CA.history, expectedHistory_2, "history has previous states");
            });
        });
        describe("goToStep", () => {
            // For these tests we basically copy and paste the previousStep and nextStep tests
            it("goToStep moves from step 2 to step 0; grid is as expcted, step is 0, history is empty", () => {
                const grid = newZerosGrid(3, 3);
                const CA = new CellularAutomaton(grid, transitionCenter);
                /* We call CA.nextStep() twice, instead of CA.goToStep(2), so this test
                 * can be run even if goToStep fails for future steps. */
                CA.nextStep();
                CA.nextStep(); // At step 2
                CA.goToStep(0); // Back to step 0
                assert.deepEqual(CA.grid, newZerosGrid(3, 3), "Grid is in original state");
                assert.strictEqual(CA.step, 0, "Step is 0");
                assert.deepEqual(CA.history, [], "History is empty");
            });
            it("goToStep moves from step 0 to step 2; grid, history, and step are as expected", () => {
                const grid = newZerosGrid(3, 3);
                const CA = new CellularAutomaton(grid, transitionCenter);
                CA.goToStep(2);
                /* Expected grid for step 1. */
                const expectedGrid_1 = [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0]
                ];
                /* Expected values for step 1. */
                const expectedGrid_2 = [
                    [0, 0, 0],
                    [0, 2, 0],
                    [0, 0, 0]
                ];
                const expectedHistory_2 = [newZerosGrid(3, 3), expectedGrid_1];
                const expectedStep_2 = 2;
                assert.deepEqual(CA.grid, expectedGrid_2, "grid has 2 grains at center, 0 elsewhere");
                assert.strictEqual(CA.getCellState(1, 1), 2, "center (1, 1) has 2 grains");
                assert.strictEqual(CA.step, expectedStep_2, "step advanced by 1");
                assert.deepEqual(CA.history, expectedHistory_2, "history has previous states");
            });
            it("goToStep changes nothing if we go to current step", () => {
                const grid = newZerosGrid(3, 3);
                const CA = new CellularAutomaton(grid, transitionCenter);
                /* We call CA.nextStep() twice, instead of CA.goToStep(2), so this test
                 * can be run even if goToStep fails for future steps. */
                CA.nextStep();
                CA.nextStep(); // At step 2
                CA.goToStep(2);
                /* Expected grid for step 1. */
                const expectedGrid_1 = [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0]
                ];
                /* Expected values for step 1. */
                const expectedGrid_2 = [
                    [0, 0, 0],
                    [0, 2, 0],
                    [0, 0, 0]
                ];
                const expectedHistory_2 = [newZerosGrid(3, 3), expectedGrid_1];
                const expectedStep_2 = 2;
                assert.deepEqual(CA.grid, expectedGrid_2, "grid has 2 grains at center, 0 elsewhere");
                assert.strictEqual(CA.getCellState(1, 1), 2, "center (1, 1) has 2 grains");
                assert.strictEqual(CA.step, expectedStep_2, "step advanced by 1");
                assert.deepEqual(CA.history, expectedHistory_2, "history has previous states");
            });
        });
    });
    describe("Cell state getters and setters", () => {
        it("getCellState() gets expected cell state", () => {
            const grid_1 = newZerosGrid(3, 3);
            const grid_2 = [
                [0, 0, 0],
                [0, 5, 0],
                [0, 0, 0]
            ];
            const CA_1 = new CellularAutomaton(grid_1, transitionCenter);
            const CA_2 = new CellularAutomaton(grid_2, transitionCenter);
            assert.strictEqual(CA_1.getCellState(1, 1), 0, "Cell has state 0.");
            assert.strictEqual(CA_2.getCellState(1, 1), 5, "Cell has state 5.");
        });
        it("setCellState() sets cell to expected state", () => {
            const grid = newZerosGrid(3, 3);
            const CA = new CellularAutomaton(grid, transitionCenter);
            const stateToSet = 5; // No reason for 5, can be arbitrary.
            const expectedGrid = [
                [0, 0, 0],
                [0, stateToSet, 0],
                [0, 0, 0]
            ];
            assert.strictEqual(CA.getCellState(1, 1), 0, "Cell starts with state 0.");
            /* Then we set the cell state and check that worked. */
            CA.setCellState(1, 1, stateToSet); // Set (1, 1)
            assert.deepEqual(CA.grid, expectedGrid, "Only the specified cell changed.");
            assert.strictEqual(CA.getCellState(1, 1), stateToSet, "Cell has specified state");
        });
        it("getPreviousCellState() returns NaN at step 0", () => {
            const grid = newZerosGrid(3, 3);
            const CA = new CellularAutomaton(grid, transitionCenter);
            assert.isNaN(CA.getPreviousCellState(1, 1));
        });
        it("getPreviousCellState() gets expected previous cell state", () => {
            const grid = newZerosGrid(3, 3);
            const CA = new CellularAutomaton(grid, transitionCenter);
            // We check the center cell (1, 1), because that's where transitionCenter adds grains.
            CA.nextStep(); // Move to step 1. Previous cell state is state at step 0.
            assert.strictEqual(CA.getPreviousCellState(1, 1), 0, "At step 0, cell (1, 1) had state 0");
            CA.nextStep(); // Move to step 2. Previous cell state is state at step 1.
            assert.strictEqual(CA.getPreviousCellState(1, 1), 1, "At step 1, cell (1, 1) had state 1");
        });
    });
});
