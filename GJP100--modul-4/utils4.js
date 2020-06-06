/*  UTILITY FUNCTIONS for MODULE 3
*   ============================== 
*  0. MATCHING
*  1. COMPARISON
*  2. BRANCHING 
*  3. MATH: RANDOMNESS
*  4. MATH: RANGES
*   . DOM QUERYING
*   . DOM CREATION
*
*
*/


/************
 * MATCHING *
 ************/

const isArray     = Array.isArray;
const isFunction  = (x) => typeof x === 'function';
const isInteger   = Number.isInteger;
const isNumber    = (x) => typeof x === 'number' && isFinite(x);
const isObject    = (x) => x && typeof x === 'object' && x.constructor === Object 
const isString    = (x) => typeof x === 'string' || x instanceof String;
const isRegExp    = (x) => x && typeof x === 'object' && x.constructor === RegExp;
const isNode      = (x) => x && x.nodeType;
const isPrimitive = (x) => !(typeof x === 'object');

/**************
 * COMPARISON *
 **************/

const EQ     = (y)   => (x) => x === y;
const NOT     = (p)   => (x) => !p;
const LT      = (y)   => (x) => x <  y;
const LTE     = (y)   => (x) => x <= y;
const GT      = (y)   => (x) => x >  y;
const GTE     = (y)   => (x) => x >= y;





/************
* BRANCHING *
*************/

// the cond construct as in Clojure
// takes pairs of condition and function
// and applies the first function for which the condition resturns true
// use for catchall clause in `cond`
const cond = (...cfs) => (...xs) => {
  for(let i = 0;i < cfs.length; i += 2) if( cfs[i](...xs) ) return cfs[i+1](...xs);
  throw `cond: no match for input '${xs}' (${cfs})`;
};
const succeed = () => true;

const hasArity    = cond(
  isInteger,  (n) => (...xs) => xs.length == n,
  isFunction, (p) => (...xs) => p( xs.length )
);


/********************
 * MATH: RANDOMNESS *
 *******************/

// imported from my GJP100 module 3 code

// function rnd is oveloaded in four ways:
// no  argument            : return a float between 0 inclusive and 1 non-inclusive
// one argument <int>      : return a random integer between 0 and n non-inclusive
// one argument <array>    : pick a random element
// two arguments <int,int> : return a random integer between a inclusive and b non-inclusive

const rnd = cond(
  hasArity(0), ()     => Math.random(), 
  hasArity(1), (x)    => cond( 
              Number.isInteger,  (int) => Math.floor( int * rnd() ),
              Array.isArray   ,  (arr) => arr[Math.floor( arr.length * rnd() )],
            )(x),
  hasArity(2), (a, b) => a + rnd(b-a),
);

// return a scrambled copy of the input array
const scramble = cond(
  isString,  (str) => scramble(str.split('')).join(''),
  isArray ,  (xs)  => {
               let ys = [];
               let len = xs.length;
               for(let i=0;i<len;i++){
                 let idx = rnd(xs.length);
                 ys.push( xs.splice(idx,1)[0] );
               }
               return ys;
            }
);


/****************
 * MATH: RANGES *
 ****************/

// returns an array of elements from a (inclusive) to b (inclusive) in steps of s
// a defaults to 1 and step to zeros defaults to 1 
const upto = cond(
  hasArity(1),  (b)        => upto(0,b,1),
  hasArity(2),  (a,b)      => upto(a,b,1),
  hasArity(3),  (a,b,step) => {
                    // cover the case when a > b
                    let n = Math.abs(b-a);
                    step  = Math.abs(step)||1; // step of zero would loop forever 
                    sign  = Math.sign(b-a);

                    let xs = [];
                    for(let i = 0; i<n; i+=step) xs.push(a + i*sign); 
                    return xs; 
                  }
 );

/*****************
 * DOM QUERYING *
 *****************/
// imported from my code for GJP100 module 3

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the first elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query as a real Array (not a node list)
const query2elems = (q) => Array.from( document.querySelectorAll(q) );




/****************
 * DOM CREATION *
 ****************/
// imported from my code for GJP100 module 3
const SPLIT = (delim) => (str) => (K) => {
  K(...str.split(delim));
};

let A = (tagdesc) => (...props) => (...elms) => (pelem) => {
  let e;
  SPLIT('.')(tagdesc)(
    (tagname, ...classes) => {
      e = document.createElement(tagname);
      if(classes.length > 0) withCLASS(...classes)(e);
    }
  );
  props.forEach(prop => prop(e));
  let addChild = cond(
    isFunction , mkElm  => mkElm(e),
    isString   , str  => e.appendChild(document.createTextNode(str)),
    isArray    , xs   => xs.forEach(addChild)
  );
  elms.forEach(addChild);
  pelem.appendChild(e);
  return e;
}

let THE = (query) => (...props) => (...elms) => {
  let e = query2elem(query);
  props.forEach(prop => prop(e));
  let addChild = cond(
    isFunction , mkElm  => mkElm(e),
    isString   , str  => e.appendChild(document.createTextNode(str)),
    isArray    , xs   => xs.forEach(addChild)
  );
  elms.forEach(addChild);
  return e;
}

const withCLASS = (...cls) => (elm) => {
  elm.classList.add(...cls);
  return elm;
}
const withSTYLE = (...props) => (elm) => {
  for(let i=0; i < props.length; i+=2 ) elm.style[ hyphen2camel(props[i]) ] = props[i+1];
  return elm;
};
      // HYPHEN2CAMEL
      const ifSPLIT = (delim) => (succK) => (str) => {
        let result = str.split(delim);
        return (result.length > 1)? succK(...result): str;
      }
      const titleCase    = (str) => str.slice(0,1).toUpperCase()+str.slice(1);
      const hyphen2camel = ifSPLIT('-')(
        (str0,...xs) => xs.reduce((acc,str)=>acc+titleCase(str),str0)
      );

const withATTR = (...props) => (elm) => {
  for(let i=0; i < props.length; i+=2 ) elm[ props[i] ] = props[i+1];
  return elm;
};
