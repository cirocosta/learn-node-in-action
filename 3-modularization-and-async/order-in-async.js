'use strict';
// Este exemplo ilustra como podemos zoar o processo se não tivermos
// cuidado com a ordem do async.

function asyncFunction (callback) {
    setTimeout(callback, 200);
}

var color = 'blue';

asyncFunction(function () {
    console.log("The color is " + color);
});

color = 'green';
// resultado: the color is green.

////////////////////////////////
// But, refactoring a bit ... //
////////////////////////////////


color = 'blue';

// Using the concepts of scope we then freeze the value of color to what
// was passed to the function and, as we are not modifying it
// internally, then it won't change, even if it changes outside :)

(function(color) {
    asyncFunction(function () {
        console.log("The color is " + color);
    });
})(color);

color = 'green';