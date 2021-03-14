const lib = {};

lib.squareNumber = function(number) {
    if (typeof(number) !== 'number') {
        return null
    }
    return Math.pow(number, 2);
}

lib.absoluteValue = function(number) {
    if (typeof(number) !== 'number') {
        return null
    }
    return Math.abs(number);
}

lib.isNumberArray = function(array) {
    return Array.isArray(array) && array.every((item) => typeof(item) === 'number');
}

module.exports = lib;