import * as mocha from 'mocha';
import { assert } from 'chai';

import { getRandomInteger, getRandomElement, randomIntegerArray } from '../random';

/* Helper function for repeated testing of functions which use random numbers. */
function runTest(numberOfRuns: number, testFunc: Function, ...argsToPass: Array<any>): void {
  for (let i = 0; i <= numberOfRuns; i++) {
    testFunc(...argsToPass)
  }
}

/* Tests for functions which rely on generating random integers in a given interval. */
describe("Functions using random integers", () => {

  describe("getRandomInteger", () => {
    function makeTest(min: number, max: number): void {
      const randomInteger: number = getRandomInteger(min, max);
      it(`${randomInteger} is at least ${min} and at most ${max}`, () => {
        assert.isAtLeast(randomInteger, min);
        assert.isAtMost(randomInteger, max);
      });
    }

    runTest(10, makeTest, 0, 10);
  });

  describe("getRandomElement", () => {
    function makeTest(arr: Array<any>) {
      const randomElement: any = getRandomElement(arr);
      it(`${randomElement} is in given array [${arr}]`, () => {
        assert.include(arr, randomElement);
      })
    }

    const testArray: Array<any> = [0, 1, 'test', {testProp: 'this is a test obj'}, false];
    runTest(10, makeTest, testArray);
  });

  describe("randomIntegerArray (with min = 0, max = 100, length = 50)", () => {
    function makeTest() {
      // min = 0, max = 100, length = 50 are arbitrary. Can use any integers.
      const min: number = 0;
      const max: number = 100;
      const length: number = 50;
      const arr: Array<number> = randomIntegerArray(min, max, length);

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
