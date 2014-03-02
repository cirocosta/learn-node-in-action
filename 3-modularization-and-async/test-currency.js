'use strict';
/**
 * Shows how could we include the currency.js module that we've defined
 * earlier. Note that node's require function is synchronous, i.e, it
 * blocks the thread as it is being performed.
 */


var currency = require('./currency');

/**
 * Depois que o Node verifica o módulo a função require retorna o
 * conteúdo do EXPORTS definido dentro daquele modulo.
 */

console.log("50 canadian dollars equals this amount of us dollars");
console.log(currency.canadianToUS(50));
