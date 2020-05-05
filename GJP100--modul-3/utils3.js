/*  UTILITY FUNCTIONS for MODULE 3
*   ============================== 
* 1. DOM MANIPULATION
* 2. FUNCTION APPLICATION
* 3. FUNCTION DEFINITON
* 4. MATH RANDOMNESS
* 5. MATH ARITHMETIC
* 6. HTML GENERATION
* 7. ARRAY MANIPULATION
* 8. PRETTYPRINT
* 9. COMMA SEPARATED VALUES
*
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




/**********************
*  FUNCTION DEFINITON *
**********************/

// the cond construct as in Clojure
// takes pairs of condition and function
// and applies the first function for which the condition resturns true
const cond = (...cfs) => (...xs) => {
  for(let i = 0;i < cfs.length; i += 2) if( cfs[i](...xs) ) return cfs[i+1](...xs);
  throw `cond: no match for input '${xs}'`;
};
// test for the default clause
const otherwise = () => true;

// multi-functions that dispaches on a function of all the args
// dispatch on the dispatch function disp using the result as an index to mf
const arity = (...fs) => (...xs) => fs[ qty(...xs) ](...xs);




/********************
 * MATH: RANDOMNESS *
 *******************/

// function rnd is oveloaded in four ways:
// no  argument            : return a float between 0 inclusive and 1 non-inclusive
// one argument <int>      : return a random integer between 0 and n non-inclusive
// one argument <array>    : pick a random element
// two arguments <int,int> : return a random integer between a inclusive and b non-inclusive

const rnd = arity(
  ()     => Math.random(), 
  (x)    => cond( 
              Number.isInteger, (int) => Math.floor( int * rnd() ),
              Array.isArray,    (arr) => arr[Math.floor( arr.length * rnd() )],
              otherwise,        (t)   => { throw `RND1: expected <array> or <int> but was given '${xs}'`; }
            )(x),
  (a, b) => a + rnd(b-a),
);
  
  
  
  
/*********************
 * MATH: ARITHMETIC  *
 ********************/

const plus    = (a,b)   => a+b;
const mul     = (a,b)   => a*b;
const rest    = (a,b)   => a%b;
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
/*
const tag = (...xs) => [tag0,tag1,tag2][xs.length](...xs); // dispatch on arity
  const tag0 = ()           => { throw "Function `tag` called with zero args" };
  const tag1 = (tagname)    => (str)  =>`<${tagname}>${ str }</${tagname}>`;
  const tag2 = (tagname, f) => (strs) => tag1(tagname)( strs.map( f ).join("\n") );
*/

const tag = arity( // dispatch on arity
  ()           => { throw "Function `tag` called with zero args" },
  (tagname)    => (str)  =>`<${tagname}>${ str }</${tagname}>`,       // base case
  (tagname, f) => (strs) => tag(tagname)( strs.map( f ).join("\n") ), // recursive case
);

/***********************
 *  ARRAY MANIPULATION *
 **********************/

// zippa ihop två arrayer 
// zip :: ([a],[b]) => [[a,b]]
let zip = (xs,ys) => xs.map( (x, i) => [x, ys[i]] );




/****************
 *  PRETTYPRINT *
 ****************/

 // prettyprint js data structuress
 let pretty = (str) => JSON.stringify(str,null,2);




/**************************
 * COMMA SEPARATED VALUES *
 **************************/

// takes a list of objects and a list of keys and
// returns a an array of rows, where the first row contains the keys
// optionally, a third list with display forms of the keys can be given
// objs2csv :: ([{k,v}],[k],[str]) => [[k],[v]*]
const objs2csv = (objs, ks, ds) => [ds||ks, ...objs.map( (o) => ks.map( (k)=> o[k]) ) ];

// takes an array of arrays and serializes it into a html table
// csv2html :: [[[ html ]]] => html
const csv2html = tag("table", tag("tr", tag("td")));



