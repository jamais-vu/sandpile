import { assert } from 'chai';
import { minusOneIfEven } from '../minusOneIfEven';
describe("minusOneIfEven", () => {
    it("Returns n - 1 if n is even", () => {
        const n = 4;
        const expected = n - 1;
        const actual = minusOneIfEven(n);
        assert.strictEqual(actual, expected);
    });
    it("Returns n if n is odd", () => {
        const n = 3;
        const expected = n;
        const actual = minusOneIfEven(n);
        assert.strictEqual(actual, expected);
    });
});
