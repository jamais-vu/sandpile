/** Creates a 1D array of random integers x, where min <= x <= max.
 * Assumes min and max are both integers.
 * @nosideffects
 */
export function randomIntegerArray(min, max, length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(getRandomInteger(min, max));
    }
    return arr;
}
/** Returns a random element from the given array.
 * @nosideffects
 */
export function getRandomElement(arr) {
    return arr[getRandomInteger(0, arr.length - 1)];
}
/** Returns a random integer x, where min <= x <= max.
 * Assumes min and max are both integers.
 * @nosideffects
 */
export function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max + 1) - min) + min;
}
