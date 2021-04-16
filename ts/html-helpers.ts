import { Controller } from './Controller';

// TODO: How do we work with HTML and TypeScript? There's got to be a better way.

/** Fits the canvas to the window size, as a square or rectangle. */
export function fitCanvasToWindow(canvas: HTMLCanvasElement, square: boolean = true) {
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

const stepInput: HTMLInputElement = document.getElementById('stepInput') as HTMLInputElement;
const stepInputSubmit: HTMLElement = document.getElementById('stepInputSubmit') as HTMLElement;
const pauseButtonElement: HTMLElement = document.getElementById('pauseButton') as HTMLElement;
const stepCountTextElement: HTMLElement = document.getElementById('stepCountText') as HTMLElement;
const windowSizeAlertElement: HTMLElement = document.getElementById('windowSizeAlert') as HTMLElement
const canvasMouseCoords: HTMLElement = document.getElementById('canvasMouseCoords') as HTMLElement
const canvasMouseCell: HTMLElement = document.getElementById('canvasMouseCell') as HTMLElement

/* Adds event listeners for the given Controller instance. */
export function addEventListeners(controller: Controller) {
  /* Pauses/unpauses grid transition. */
  pauseButtonElement.addEventListener('click', () => {
    controller.togglePause();
  });

  /* Transitions the grid forward/backward to user-inputted step.
   * stepInput is the box with the user-inputted step value.
   * steInputSubmit is the box the user clicks to go to that step. */
  stepInputSubmit.addEventListener('click', () => {
    const desiredStep: number = parseInt(stepInput.value);
    if ( !isNaN(desiredStep) ) {
      controller.goToStep(desiredStep);
    }
  });

  /* Pressing "Enter" goes to inputted step without reloading page. */
  stepInput.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      event.preventDefault(); // Disable button submit, which would reload page
      const desiredStep: number = parseInt(stepInput.value);
      if ( !isNaN(desiredStep) ) {
        controller.goToStep(desiredStep);
      }
    }
  });

  // canvas.addEventListener('mousemove', (event: MouseEvent) => {
  //   updateCanvasMouseCoords(event, drawing.cellSize);
  // });
}

/* Updates the text of pauseButton based on whether isPaused is true. */
export function updatePauseButton(isPaused: boolean): void {
  if (isPaused == true) {
    pauseButtonElement.innerHTML = 'Play';
  } else if (isPaused === false) {
    pauseButtonElement.innerHTML = 'Pause';
  }
}

/* Updates the stepCountText HTML element to show current step count. */
export function updateStepCountText(stepCount: number): void {
  stepCountTextElement.innerHTML = `${Number(stepCount).toLocaleString()}`;
}

/* If the window is not wide or tall enough, suggest the user resize it. */
export function windowSizeCheck(width: number, height: number): void {
if (width < 700 || height < 600) {
  windowSizeAlertElement.innerHTML = '<div>(Best viewed in a larger window! <a href="">Reload</a> the page after resizing.)</div>';
  }
}

/* Shows the xy and ij position of the mouse as it moves on the canvas. */
export function updateCanvasMouseCoords(event: MouseEvent, cellSize: number) {
  const mouseCell = getCellFromCoords(event.offsetX, event.offsetY, cellSize);
  canvasMouseCoords.innerHTML = `${event.offsetX}, ${event.offsetY}`;
  canvasMouseCell.innerHTML = `${mouseCell[0]}, ${mouseCell[1]}`;
}

/* Gets the row and column of the cell on the canvas at the xy coordinate. */
export function getCellFromCoords(xPos: number, yPos: number, cellSize: number) {
  return [
    Math.floor(yPos / cellSize), // y is row index
    Math.floor(xPos / cellSize), // x is col index
  ];
}