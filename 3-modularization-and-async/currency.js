var canadianDollar = 0.91;

/**
 * Returns the rounded value of a division. This won't be seen from the
 * application that includes it as it is not exposed with the exports
 * object.
 */
function roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 100;
};

/**
 * Here we populate the exports object that nodejs sets to us to give
 * the functions that we want to be exposed.
 *
 * Notice that we CAN'T just create a class, define some prototypes and
 * do `exports = Currency`, for example. For that we need to do
 * `module.exports = Currency`, which then let's us export a single
 * variable, function or object.
 *
 * Notice that if we set both `module.exports` and `exports`, just the
 * first will be returned and the second will be ignored.
 */

exports.canadianToUS = function (canadian) {
    return roundTwoDecimals(canadian * canadianDollar);
};

exports.USToCanadian = function (us) {
    return roundTwoDecimals(us / canadianDollar);
};

/*  What ultimately gets exported in your application is `module.exports.
exports` is set up simply as a global reference to module.exports, which
initially is defined as an empty object that you can add properties to.
So exports.myFunc is just shorthand for module.exports.myFunc. As a
result, if exports is set to anything else, it breaks the reference
between module.exports and exports. Because module.exports is what
really gets exported, exports will no longer work as expected—it doesn’t
reference module .exports anymore. If you want to maintain that link,
you can make module.exports reference exports again as follows:
module.exports = exports = Currency;  */
