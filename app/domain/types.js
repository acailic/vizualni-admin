/**
 * Enables type narrowing through Array::filter
 *
 * @example
 * const a = [1, undefined].filter(Boolean) // here the type of a is (number | undefined)[]
 * const b = [1, undefined].filter(truthy) // here the type of b is number[]
 */
export function truthy(value) {
    return !!value;
}
