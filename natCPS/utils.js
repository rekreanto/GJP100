/*  UTILITY FUNCTIONS for CPSjs
*   =========================== 
*
*  1. DOM MANIPULATION
*  
*/


/********************
 * DOM MANIPULATION *
 ********************/

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the first elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query as a real Array (not a node list)
const query2elems = (q) => Array.from( document.querySelectorAll(q) );


