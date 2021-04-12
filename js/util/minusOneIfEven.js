/** If the given number n is even, returns n - 1 to make it odd; n otherwise.
 * @nosideeffects
 */
export function minusOneIfEven(n) {
    if (n % 2 === 0)
        return n - 1;
    else
        return n;
}
