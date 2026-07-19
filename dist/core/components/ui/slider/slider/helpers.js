export function getNextSortedValues(prevValues = [], nextValue, atIndex) {
    const nextValues = [...prevValues];
    nextValues[atIndex] = nextValue;
    return nextValues.sort((a, b) => a - b);
}
export function convertValueToPercentage(value, min, max) {
    const maxSteps = max - min;
    const percentPerStep = 100 / maxSteps;
    return percentPerStep * (value - min);
}
/**
 * Returns a label for each thumb when there are two or more thumbs
 */
export function getLabel(index, totalValues) {
    if (totalValues > 2) {
        return `Value ${index + 1} of ${totalValues}`;
    }
    if (totalValues === 2) {
        return ["Minimum", "Maximum"][index];
    }
    return undefined;
}
/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
export function getClosestValueIndex(values, nextValue) {
    if (values.length === 1)
        return 0;
    const distances = values.map((value) => Math.abs(value - nextValue));
    const closestDistance = Math.min(...distances);
    return distances.indexOf(closestDistance);
}
/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
export function getThumbInBoundsOffset(width, left, direction) {
    const quarterWidth = width / 4; // changed to quarter width to allow some overlap but not so much
    const halfPercent = 50;
    const offset = linearScale([0, halfPercent], [0, quarterWidth]);
    return (quarterWidth - offset(left)) * direction;
}
/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values) {
    return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
    if (minStepsBetweenValues > 0) {
        const stepsBetweenValues = getStepsBetweenValues(values);
        const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
        return actualMinStepsBetweenValues >= minStepsBetweenValues;
    }
    return true;
}
// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export function linearScale(input, output) {
    return (value) => {
        if (input[0] === input[1] || output[0] === output[1])
            return output[0];
        const ratio = (output[1] - output[0]) / (input[1] - input[0]);
        return output[0] + ratio * (value - input[0]);
    };
}
export function getDecimalCount(value) {
    return (String(value).split(".")[1] || "").length;
}
export function roundValue(value, decimalCount) {
    const rounder = 10 ** decimalCount;
    return Math.round(value * rounder) / rounder;
}
