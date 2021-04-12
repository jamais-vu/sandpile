import * as mocha from 'mocha';
import { assert } from 'chai';

import { minusOneIfEven } from '../minusOneIfEven';

describe("minusOneIfEven", () => {

    it("Returns n - 1 if n is even", () => {
        const n: number = 4;
        const expected: number = n - 1;
        const actual: number = minusOneIfEven(n);
        assert.strictEqual(actual, expected);
    });

    it("Returns n if n is odd", () => {
        const n: number = 3;
        const expected: number = n;
        const actual: number = minusOneIfEven(n);
        assert.strictEqual(actual, expected);
    });

});