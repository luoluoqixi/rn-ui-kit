const areNumberArraysEqual = (left, right) => {
    if (left === right)
        return true;
    if (!left || !right || left.length !== right.length)
        return false;
    for (let index = 0; index < left.length; index++) {
        if (!Object.is(left[index], right[index]))
            return false;
    }
    return true;
};
export const stabilizeNumberArray = (previous, next) => {
    if (areNumberArraysEqual(previous, next))
        return previous;
    return next ? [...next] : undefined;
};
