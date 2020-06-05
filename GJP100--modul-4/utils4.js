/*  UTILITY FUNCTIONS for MODULE 3
*   ============================== 
*  1. MATCHING
*  2. BRANCHING 
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
const isAnything  = (x) => true; 
/* const hasArity    = cond(
  isInteger,  (n) => (...xs) => xs.length == n,
  isFunction, (p) => (...xs) => p( xs.length )
);
 */



/*************
*  BRANCHING *
**************/

// the cond construct as in Clojure
// takes pairs of condition and function
// and applies the first function for which the condition resturns true
// use for catchall clause in `cond`
const cond = (...cfs) => (...xs) => {
  for(let i = 0;i < cfs.length; i += 2) if( cfs[i](...xs) ) return cfs[i+1](...xs);
  throw `cond: no match for input '${xs}' (${cfs})`;
};
const succeed = () => true;



/*****************
 * DOM QUERYING *
 *****************/

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the first elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query as a real Array (not a node list)
const query2elems = (q) => Array.from( document.querySelectorAll(q) );




/****************
 * DOM CREATION *
 ****************/
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
  console.log(props, elms)
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
  console.log("add classes",cls);
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

const onCLICK = (f) => (elm) => elm.addEventListener()
