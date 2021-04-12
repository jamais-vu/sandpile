import { assert } from 'chai';
import { getRandomInteger, getRandomElement, randomIntegerArray } from '../random';
/* Helper function for repeated testing of functions which use random numbers. */
function runTest(numberOfRuns, testFunc, ...argsToPass) {
    for (let i = 0; i <= numberOfRuns; i++) {
        testFunc(...argsToPass);
    }
}
/* Tests for functions which rely on generating random integers in a given interval. */
describe("Functions using random integers", () => {
    describe("getRandomInteger", () => {
        function makeTest(min, max) {
            const randomInteger = getRandomInteger(min, max);
            it(`${randomInteger} is at least ${min} and at most ${max}`, () => {
                assert.isAtLeast(randomInteger, min);
                assert.isAtMost(randomInteger, max);
            });
        }
        runTest(10, makeTest, 0, 10);
    });
    describe("getRandomElement", () => {
        function makeTest(arr) {
            const randomElement = getRandomElement(arr);
            it(`${randomElement} is in given array [${arr}]`, () => {
                assert.include(arr, randomElement);
            });
        }
        const testArray = [0, 1, 'test', { testProp: 'this is a test obj' }, false];
        runTest(10, makeTest, testArray);
    });
    describe("randomIntegerArray (with min = 0, max = 100, length = 50)", () => {
        function makeTest() {
            // min = 0, max = 100, length = 50 are arbitrary. Can use any integers.
            const min = 0;
            const max = 100;
            const length = 50;
            const arr = randomIntegerArray(min, max, length);
            it(`Random array has expected length ${length}.`, () => {
                assert.strictEqual(arr.length, length, `arr.length is ${length}`);
            });
            it(`Every element is at least ${min} and at most ${max}.`, () => {
                for (let element of arr) {
                    assert.isAtLeast(element, min);
                    assert.isAtMost(element, max);
                }
            });
        }
        runTest(10, makeTest);
    });
});
