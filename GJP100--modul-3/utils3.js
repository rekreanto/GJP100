/*  UTILITY FUNCTIONS for MODULE 3
*   ============================== 
* -1. COMPARISON
*  0. TYPE PREDICATES
*  1. FUNCTION DEFINITON
*  2. FUNCTION APPLICATION
*  3. DOM MANIPULATION
*  4. MATH RANDOMNESS
*  5. MATH ARITHMETIC
*  6. HTML GENERATION
*  7. ARRAY MANIPULATION
*  8. PRETTYPRINT
*  9. COMMA SEPARATED VALUES
* 10. OBJECTS
* 11. UNIT CONVERSION
* 12. TESTING
* 13. ELEMENT CREATION
*
*
*/

/***************
 *  COMPARISON *
 ***************/

const not     = (p)   => (x) => !p;
const lt      = (y)   => (x) => x <  y;
const lte     = (y)   => (x) => x <= y;
const gt      = (y)   => (x) => x >  y;
const gte     = (y)   => (x) => x >= y;
const all     = (p)   => (...bs) => bs.map( matches(p) ).reduce( (acc, r)  => acc && r, true );


const some  = (...bs) => bs.reduce( (acc, b)  => acc || b, false );
const none  = (...bs) => bs.reduce( (acc, b) => acc && !b, true );



const odd     =          (x) => x%2 === 1;
const even    =          (x) => x%2 === 0;




/**********************
*  FUNCTION DEFINITON *
**********************/

// the cond construct as in Clojure
// takes pairs of condition and function
// and applies the first function for which the condition resturns true
const cond = (...cfs) => (...xs) => {
  for(let i = 0;i < cfs.length; i += 2) if( cfs[i](...xs) ) return cfs[i+1](...xs);
  throw `cond: no match for input '${xs}' (${cfs})`;
};
const qty     = (...xs) => xs.length;
const arity   = (...xs) => xs.length;

const caseof = (f) => (...cfs) => (...xs) => {

  for(let i = 0;i < cfs.length; i += 2){ 
    let isMatch = f? matches(cfs[i])(f(...xs)): matches(cfs[i])(...xs); // use f if available
    if( isMatch ) return cfs[i+1](...xs);
  }
  throw `caseof( ${f.name} ): no match for input '${xs}'`;
};




// multi-functions that dispaches on a function of all the args
// dispatch on the dispatch function disp using the result as an index to mf
// const caseof_arity = (min) => (...fs) => (...xs) => fs[ qty(...xs) - min ](...xs);




/*******************
 * TYPE PREDICATES *
 *******************/


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
const hasArity    = cond(
  isInteger,  (n) => (...xs) => xs.length == n,
  isFunction, (p) => (...xs) => p( xs.length )
);



const and     = caseof( arity )(
  1      , (p)   => (q) => (x) => p(x) && q(x),
  2      , (p,q)        => (x) => p(x) && q(x),
  gt(2)  , (p, ...ps)   => (x) => p(x) && and(...ps)
);
const or     = cond(
  hasArity(1)       , (p)   => (q) => (x) => p(x) || q(x),
  hasArity(2)       , (p,q)        => (x) => p(x) || q(x),
  hasArity( gt(2) ) , (p, ...ps)   => (x) => p(x) || or(...ps)
);

const matches  = cond(
  hasArity(1)       , cond(
                        isRegExp     , (re)  => (x) => re.test(x),
                        isFunction   , (p)   => (x) => p(x),
                        isPrimitive  , (val) => (x) => val === x
                      ),
  hasArity(gt(1))   , (...ps) => (...xs) => {
    console.log(ps,xs);
    console.log(zip(ps,xs));
    return zip(ps,xs).map( ([p,x]) => matches(p)(x) ).reduce( (acc,b) => acc && b, true);
  }
);




console.assert(  isArray  ( [1,2,3] ), " isArray  ( [1,2,3] )" );
console.assert( !isArray  (   "123" ), "!isArray  ( [1,2,3] )" );
console.assert(  isInteger(     123 ), " isInteger(     123 )" );
console.assert( !isInteger(     1.3 ), "!isInteger(     1.3 )" );
console.assert(  isString(    "1.3" ), ' isString(    "1.3" )' );
console.assert( !isString(      1.3 ), "!isString(      1.3 )" );






/************************
 * FUNCTION APPLICATION *
 ************************/

// fixes the given args *before* the remaining args, returning a new function
const fx = (f, ...xs) => (...ys) => f(...xs, ...ys);
// fixes the given args *after* the remaining args, returning a new function
const fy = (f, ...xs) => (...ys) => f(...ys, ...xs);




/********************
 * DOM MANIPULATION *
 ********************/

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the first elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query as a real Array (not a node list)
const query2elems = (q) => Array.from( document.querySelectorAll(q) );




/********************
 * MATH: RANDOMNESS *
 *******************/

// function rnd is oveloaded in four ways:
// no  argument            : return a float between 0 inclusive and 1 non-inclusive
// one argument <int>      : return a random integer between 0 and n non-inclusive
// one argument <array>    : pick a random element
// two arguments <int,int> : return a random integer between a inclusive and b non-inclusive

const rnd = caseof( arity )(
  0, ()     => Math.random(), 
  1, (x)    => cond( 
              Number.isInteger,  (int) => Math.floor( int * rnd() ),
              Array.isArray   ,  (arr) => arr[Math.floor( arr.length * rnd() )],
            )(x),
  2, (a, b) => a + rnd(b-a),
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


//console.assert(scramble("lorem ipsum").length == scramble("lorem ipsum").length,"");
  
  
  
/*********************
 * MATH: ARITHMETIC  *
 ********************/

const plus    = (a,b)   => a+b;
const mul     = (a,b)   => a*b;
const rem     = (a,b)   => a%b; // in javascript, % is the remainder operator
// implementation of mod comes from from https://exploringjs.com/deep-js/ch_remainder-vs-modulo.html
const mod     = (a,b)   => {
                              let quotient = Math.floor(a/b);
                              let modulo   = a - b * quotient;
                              return modulo; 
                            };
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

const tag = caseof( arity )( // dispatch on arity
  1, (tagname)    => (str)  =>`<${tagname}>${ str }</${tagname}>`,       // base case
  2, (tagname, f) => (strs) => tag(tagname)( strs.map( f ).join("\n") ), // recursive case
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
// NOTE: if ds is used, the csv cannot be turned into objects again
// This is bad behviour, and it should be moved to the show  
const objs2csv = (objs, ks, ds) => [ds||ks, ...objs.map( (o) => ks.map( (k)=> o[k]) ) ];
const arr2obj = (keys) => (arr) => {
  let obj = {};
  keys.forEach( (key,idx) => { obj[key]=arr[idx]; } );
  return obj;
}
const csv2objs = ([keys, ...rows]) => rows.map( arr2obj(keys) );

let tempen = [ 
  ["","00-08","08-16","16-24"], 
  ["Malmö",12,16,9], 
  ["Mariestad",13,15,10], 
  ["Stockholm",13,15,13], 
  ["Upphärad",14,16,15], 
  ["Göteborg",13,14,12] 
];

// console.log("arr2obj",arr2obj(tempen[0])(tempen[1]));
// console.log("csv2objs",csv2objs(tempen));

// takes an array of arrays and serializes it into a html table
// csv2html :: [[[ html ]]] => html
const csv2html = tag("table", tag("tr", tag("td")));

// Equivalent to SRE?
// What about a definition recursive version of RegExp?
// Would that be equivalent to SRE:s? IN what ways?
// Check the paper for examples?
// Check for other typical uses of defred re's 
const split = caseof( arity )(
  1, (delim)    => (str) => str.split(delim),
  2, (delim, f) => (str) => str.split(delim).map(f),  
)
{
  let xss = split(" ", split("")) ("hej du din ko"); 
  // console.log( pretty(xss) );
}

/***********
 * OBJECTS *
 ***********/
// keyfn :: ([Key], Key, xs => r ) => r
// Lifts a function to work over objects
// @from: array of arugument keys
// @to  : the result key
// @fn  : the function
const keyfn = (from, to, fn) => (o) => {
  let args = from.map( k => o[k] );
  return Object.assign({[to]:fn(...args)}, o);
};


/***********
 * TESTING *
 ***********/

// returns an array of elements from a (inclusive) to b (inclusive) in steps of s
// a defaults to 1 and step to zeros defaults to 1
// a and be must be either integers or one  character strings
// 
const dotdot = 
  cond(
    isString,   caseof( arity )(
                  2, (a,b)      => dotdot(a,b,1),
                  3, (a,b,step) => {
                                let a_code = a.charCodeAt(0);
                                let b_code = b.charCodeAt(0);
                                let codes = dotdot(a_code,b_code,step);
                                let chars = codes.map(c => String.fromCharCode(c));
                                return chars;
                            },
                ),
    isInteger,  caseof( arity )(
                  1, (b)        => dotdot(0,b,1),
                  2, (a,b)      => dotdot(a,b,1),
                  3, (a,b,step) => {
                                  // cover the case when a > b
                                  let n = Math.abs(b-a);
                                  step  = Math.abs(step)||1; // step of zero would loop forever 
                                  sign  = Math.sign(b-a);

                                  let xs = [];
                                  for(let i = 0; i<=n; i+=step) xs.push(a + i*sign); 
                                  return xs; 
                                }
                ),
  );

// returns an array of elements from a (inclusive) to b (inclusive) in steps of s
// a defaults to 1 and step to zeros defaults to 1 
const dotdotdot = caseof( arity )(
                    1,  (b)        => dotdotdot(0,b,1),
                    2,  (a,b)      => dotdotdot(a,b,1),
                    3,  (a,b,step) => {
                                      console.log("jjj");
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
 * NODE CREATION *
 *****************/


 
// ap :: (<function>+)(<value>*) -> xs
const ap = (...fs) => (...xs) => {
  let func = x => fs.reduce( (acc,f) => f(acc), x);
  xs.map((x) => func(x));
} 
//elem  :: (<tagname>)( <string>|<props>|<events>|<nodes> *)|<parent-elem>| -> <elem>
const addElem = (tagname) => (...fs) => (parent) => {
  let elm = document.createElement(tagname); // create the element
  fs.forEach( 
    cond(
      isString   , str => {},
      isFunction , (f) => { f(elm); } 
    )
  );          // apply the modifyers to the element
  parent.appendChild(elm);                   // insert the element into the dom
}; 

// addClass :: (<classname>+)|<elem>| -> <elem>
const addClass = (...xs) => (...elms) => {
  elms.forEach(
    (elm) => { xs.forEach( (x) => { elm.classList.add(x); } ); }
  );
  return elms;
};

// prop  :: (<key>, <value>)|<elem>| -> <elem>
const addProp = (key, val) => (...elm) => {
  elms.forEach(
    (elm) => { elm[key] = val; }
  );
  return elms;
};

// addStyle  :: (<key>, <value>)|<elem>| -> <elem>
const addStyle = (key, val) => (...elms) => {
  elms.forEach(
    (elm) => { elm.style[key] = val; }
  );
  return elms;
};

// addEvent :: (<event-type>, <handler>)|<elem>| -> <elem>
const addEvent = (ev, fn) => (...elms) => {
  elms.forEach(
    (elm) => { elm.addEventListener(ev, fn); }
  );
  return elms;
};




/********************
 * ELEMENT CREATION *
 ********************/

let A = (tagname) => (...props) => (...elms) => (pelem) => {
  let e = document.createElement(tagname);
  props.forEach(prop => prop(e));
  elms.forEach(cond(
    isFunction , elm  => {console.log("hej");return elm(e)},
    isString   , str  => e.appendChild(document.createTextNode(str))
    ));
  console.log(props, elms)
  if(pelem) pelem.appendChild(e);
  console.log("e",tagname,e);
  return e;
}
let THE = (query) => (...props) => (...elems) => (pelem) => {
  let e = document.querySelector(query);
  props.forEach(prop => prop(e));
  elms.forEach(cond(
    isFunction , elm  => {console.log("hej");return elm(e)},
    isString   , str  => e.appendChild(document.createTextNode(str))
    ));
  if(pelem) pelem.appendChild(e);
  return e;
}

CSS = (...props) => (elm) => {
  for(let i=0; i < props.length; i+=2 ) elm.style[props[i]] = props[i+1];
  return elm;
};

CSS.px = m => `${m}px`;

CSS.addClass = (...cls) => (elm) => {
  elm.classList.add(...cls);
  return elm;
}

// En klass för att skapa färg enligt hsla
CSS.hsla = class HSLA {
  // takes h = <int 0..360>, s = <int 0..100>, l = <int 0..100>, a = <float 0..1>
  constructor({h, s, l, a}={}){

    // default färg är starkt mörk röd
    this.h = h % 360 || rnd(0,360);
    this.s = s       || rnd(50,100);
    this.l = l       || rnd(0,30);
    this.a = a       || rnd(8,100)/100;

  }
  
  toString(){
    // decimals must be removed from `h`,`s` and `l`
    // decimals of `a` are reduced to two for brevity
    return `hsla(${
      Math.floor(this.h) 
    }, ${
      Math.floor(this.s)
    }%, ${
      Math.floor(this.l)
    }%, ${
      this.a.toFixed(2)
    })`;
  }
  contrastColor(){
    // produces a new color that is readable on the original color
    // due to decent lightness contrast
    let l = this.l<45? 90: 10;
    let h = (360-this.h)%360;
    return new CSS.hsla({h:h,s:95,l:l,a:0.95});
  }
  lighterColor(w=1){
    // takes a weight factor and
    // produces a new color that is readable on the original color
    // w=1 ger en 14% ljusökning
    let l = (this.l*w + 100)/(100*w + 100);
    return {l:l, ...this};
  }
  hueShiftedCOlor(dH=10){
    // producesshifts the hue dH degrees
    this.hue = (this.hue + dH)%360;
    return this;
  }
}

const ON = (...args) => (elm) => {
  elm.addEventListener(...args);
}; 