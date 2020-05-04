/*  UTILITY FUNCTIONS for MODULE 3
*   ============================== 
* 1. DOM MANIPULATION
* 2. FUNCTION APPLICATION
* 3. MATH RANDOMNESS
* 4. MATH ARITHMETIC
* 5. HTML GENERATION
* 6. ARRAY MANIPULATION
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




/************************
 * FUNCTION APPLICATION *
 ************************/

// fixes the given args *before* the remaining args, returning a new function
const fx = (f, ...xs) => (...ys) => f(...xs, ...ys);
// fixes the given args *after* the remaining args, returning a new function
const fy = (f, ...xs) => (...ys) => f(...ys, ...xs);




/*********************
 * MATH: RANDOMNESS  *
 ********************/

// pick a random element from all args
const pick = (...xs) => xs[Math.floor( xs.length * Math.random() )];

// no  argument:       return a float between 0 inclusive and 1 non-inclusive
// one argument n:     return a random integer between 0 and n non-inclusive
// two arguments a, b: return a random integer between a inclusive and b non-inclusive
const rnd = (...xs) => [rnd0, rnd1, rnd2][xs.length](...xs); // dispatch on numer of args
  const rnd0 = ()    => Math.random(); 
  const rnd1 = (n)   => Math.floor( n * rnd0() );
  const rnd2 = (a,b) => a + rnd1(b-a);
  
  
  
  
/*********************
 * MATH: ARITHMETIC  *
 ********************/

const plus    = (a,b)   => a+b;
const mul     = (a,b)   => a*b;
const qty     = (...xs) => xs.length;
const sum     = (...xs) => xs.reduce( plus, 0 );
const prod    = (...xs) => xs.reduce( mul,  0 ); 
const avg     = (...xs) => sum(...xs) / qty(...xs);




/********************
 * HTML GENERATION  *
 *******************/

// produce a html string
// given a tag function as a second argument, map it onto the input array and join the resutling strings
// tag :: (str, tag) -> [html] -> str
// tag :: str -> html -> html
// html = [html] | str
const tag = (...xs) => [tag0,tag1,tag2][xs.length](...xs); // dispatch on arity
  const tag0 = ()           => { throw "The function `tag` must receive at least one argument" };
  const tag1 = (tagname)    => (str)  =>`<${tagname}>${ str }</${tagname}>`;
  const tag2 = (tagname, f) => (strs) => tag1(tagname)( strs.map( f ).join("\n") );

// sample usage of `tag`: creating a html table
// table2html :: [[[ html ]]] => html
const table2html = tag("table", tag("tr", tag("td")));


/***********************
 *  ARRAY MANIPULATION *
 **********************/

// zippa ihop två arrayer 
// zip :: ([a],[b]) => [[a,b]]
let zip = (xs,ys) => xs.map( (x, i) => [x, ys[i]] );