/*
 * Unit Tests
 *
 */

// Dependencies
let lib = require("./../app/lib.js");
let assert = require("assert");

// Holder for Tests
var unit = {};

// Assert that the lib.squareNumber function is returning a null for non number arguments
unit["lib.squareNumber should return null"] = function(done) {
    let testValue = 'string';
    let testReturn = lib.squareNumber(testValue);
    assert.equal(testReturn, null);
    done();
};
// Assert that the lib.squareNumber function is returning correct value for positive number
unit["lib.squareNumber should return a correct value for positive number"] = function(done) {
    let testValue = 3;
    let testReturn = lib.squareNumber(testValue);
    assert.equal(testReturn, 9);
    done();
};
// Assert that the lib.squareNumber function is returning correct value for 0
unit["lib.squareNumber should return a correct value for 0"] = function(done) {
    let testValue = 0;
    let testReturn = lib.squareNumber(testValue);
    assert.equal(testReturn, 0);
    done();
};
// Assert that the lib.squareNumber function is returning correct value for negative number
unit["lib.squareNumber should return a correct value for negative number"] = function(done) {
    let testValue = -3;
    let testReturn = lib.squareNumber(testValue);
    assert.equal(testReturn, 9);
    done();
};

// Assert that the lib.absoluteValue function is returning a null for non number arguments
unit["lib.absoluteValue should return null"] = function(done) {
    let testValue = ['string', 123];
    let testReturn = lib.absoluteValue(testValue);
    assert.equal(testReturn, null);
    done();
};
// Assert that the lib.absoluteValue function is returning correct value for positive number
unit["lib.absoluteValue should return a correct value for positive number"] = function(done) {
    let testValue = 3.5;
    let testReturn = lib.absoluteValue(testValue);
    assert.equal(testReturn, 3.5);
    done();
};
// Assert that the lib.absoluteValue function is returning correct value for 0
unit["lib.absoluteValue should return a correct value for 0"] = function(done) {
    let testValue = 0;
    let testReturn = lib.absoluteValue(testValue);
    assert.equal(testReturn, 0);
    done();
};
// Assert that the lib.absoluteValue function is returning correct value for negative number
unit["lib.absoluteValue should return a correct value for negative number"] = function(done) {
    let testValue = -3;
    let testReturn = lib.absoluteValue(testValue);
    assert.equal(testReturn, 3);
    done();
};

// Assert that the lib.isNumberArray function is returning a false for incorrect arguments
unit["lib.isNumberArray should return false for non array argument"] = function(done) {
    let testValue = 123;
    let testReturn = lib.isNumberArray(testValue);
    assert.equal(testReturn, false);
    done();
};
// Assert that the lib.isNumberArray function is returning a false for incorrect arguments
unit["lib.isNumberArray should return false for array of non number arguments"] = function(done) {
    let testValue = ['1', 2, true];
    let testReturn = lib.isNumberArray(testValue);
    assert.equal(testReturn, false);
    done();
};
// Assert that the lib.isNumberArray function is returning true for array with only numbers
unit["lib.isNumberArray should return a true for array with numbers only"] = function(done) {
    let testValue = [-123, 0, 45];
    let testReturn = lib.isNumberArray(testValue);
    assert.equal(testReturn, true);
    done();
};

// Export the tests to the runner
module.exports = unit;