/** Creates a 1D array of random integers x, where min <= x <= max.
 * Assumes min and max are both integers.
 * @nosideffects
 */
export function randomIntegerArray(min: number, max: number, length: number): Array<number> {
  let arr: Array<number> = [];
  for (let i = 0; i < length; i++) {
    arr.push(getRandomInteger(min, max));
  }
  return arr;
}

/** Returns a random element from the given array.
 * @nosideffects
 */
export function getRandomElement(arr: Array<any>) {
  return arr[getRandomInteger(0, arr.length - 1)];
}

/** Returns a random integer x, where min <= x <= max.
 * Assumes min and max are both integers.
 * @nosideffects
 */
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1) - min) + min;
}