// TODO: How do we work with HTML and TypeScript? There's got to be a better way.
const stepInput = document.getElementById('stepInput');
const stepInputSubmit = document.getElementById('stepInputSubmit');
const pauseButtonElement = document.getElementById('pauseButton');
const stepCountTextElement = document.getElementById('stepCountText');
const windowSizeAlertElement = document.getElementById('windowSizeAlert');
const canvasMouseCoords = document.getElementById('canvasMouseCoords');
const canvasMouseCell = document.getElementById('canvasMouseCell');
/* Adds event listeners for the given Drawing instance. */
export function addEventListeners(controller) {
    /* Pauses/unpauses grid transition. */
    pauseButtonElement.addEventListener('click', () => {
        controller.togglePause();
    });
    /* Transitions the grid forward/backward to user-inputted step.
     * stepInput is the box with the user-inputted step value.
     * steInputSubmit is the box the user clicks to go to that step. */
    stepInputSubmit.addEventListener('click', () => {
        const desiredStep = parseInt(stepInput.value);
        if (!isNaN(desiredStep)) {
            controller.goToStep(desiredStep);
        }
    });
    /* Disable pressing "Enter" key on step input, since that causes page reload. */
    stepInput.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
        }
    });
    // canvas.addEventListener('mousemove', (event: MouseEvent) => {
    //   updateCanvasMouseCoords(event, drawing.cellSize);
    // });
}
/* Updates the text of pauseButton based on whether isPaused is true. */
export function updatePauseButton(isPaused) {
    if (isPaused == true) {
        pauseButtonElement.innerHTML = 'Play';
    }
    else if (isPaused === false) {
        pauseButtonElement.innerHTML = 'Pause';
    }
}
/* Updates the stepCountText HTML element to show current step count. */
export function updateStepCountText(stepCount) {
    stepCountTextElement.innerHTML = `${Number(stepCount).toLocaleString()}`;
}
/* If the window is not wide or tall enough, suggest the user resize it. */
export function windowSizeCheck(width, height) {
    if (width < 700 || height < 600) {
        windowSizeAlertElement.innerHTML = '<div>(Best viewed in a larger window! <a href="">Reload</a> the page after resizing.)</div>';
    }
}
/* Shows the xy and ij position of the mouse as it moves on the canvas.
 *
 * This information is displayed in the `debugInfoTable` element.
 */
export function updateCanvasMouseCoords(event, cellSize) {
    const mouseCell = getCellFromCoords(event.offsetX, event.offsetY, cellSize);
    canvasMouseCoords.innerHTML = `${event.offsetX}, ${event.offsetY}`;
    canvasMouseCell.innerHTML = `${mouseCell[0]}, ${mouseCell[1]}`;
}
/* Gets the row and column of the cell on the canvas at the xy coordinate. */
export function getCellFromCoords(xPos, yPos, cellSize) {
    return [
        Math.floor(yPos / cellSize),
        Math.floor(xPos / cellSize), // x is col index
    ];
}
