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
* 10. OBJECTS
* 11. UNIT CONVERSION
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
const arity = (min) => (...fs) => (...xs) => fs[ qty(...xs) - min ](...xs);




/********************
 * MATH: RANDOMNESS *
 *******************/

// function rnd is oveloaded in four ways:
// no  argument            : return a float between 0 inclusive and 1 non-inclusive
// one argument <int>      : return a random integer between 0 and n non-inclusive
// one argument <array>    : pick a random element
// two arguments <int,int> : return a random integer between a inclusive and b non-inclusive

const rnd = arity(0)(
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

const tag = arity(1)( // dispatch on arity
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
const split = arity(1)(
  (delim)    => (str) => str.split(delim),
  (delim, f) => (str) => str.split(delim).map(f),  
)
{
  let xss = split(" ", split("")) ("hej du din ko"); 
  // console.log( pretty(xss) );
}

/***********
 * OBJECTS *
 ***********/
// Takes an object and a key function
// the key function is defined by
//  {from: <list of input keys>, to: <output key>, fn: <a funciton with corresponding arity>}

const withCol  = (o,{from,to,fn}) => {
  let args = from.map( k => o[k] );
  return Object.assign({[to]:fn(...args)}, o);
};

// Given arguments and result keys and a function
const keyfn = (from, to, fn) => (o) => {
  let args = from.map( k => o[k] );
  return Object.assign({[to]:fn(...args)}, o);
};




/*******************
 * UNIT CONVERSION *
 ******************/

// REUTRN div, recur on rest
// Takes a unit, a dividend and a function to handle the remainder, 
// returns a list of quantities with units
const divUQ = arity(2)(
    (u,b)     => (a) => [ {unit:u, quantity:Math.floor(a/b)} ], // return the integer quotient
    (u,b,f)   => (a) => {
                        let quotient  = Math.floor(a/b);
                        let remainder = a - quotient * b;
                        return [...divUQ(u,b)(a), ...f(remainder)];
                      },  
   );
{
  // lite demo-kod som jag lämnar här för tillfället
  const uqs2str = (objs) => objs.map( ({quantity,unit}) => `${quantity} ${unit}` ).join(" + ");  
  const d2ymd =
  divUQ("år"     ,   365, 
    divUQ("månader",  30, 
      divUQ("dagar"  , 1 )));


  const s2ydhms = 
      divUQ("years"  ,   365*24*60*60,
        divUQ("months" ,  30*24*60*60, 
          divUQ("days"   ,   24*60*60, 
            divUQ("hours"  ,    60*60, 
              divUQ("minutes",     60, 
                divUQ("seconds",    1 )))))); 

  // console.log(uqs2str(s2ydhms(1000000000)));
  // console.table(uqs2str(d2ymd(5428)));
  // console.table(objs2csv(d2ymd(5428),["quantity","unit"]));
  // console.table(csv2html(objs2csv(d2ymd(5428),["unit","quantity",],["Enhet","Kvantitet"])));
}


/******************************
 * UNIT CONVERSION WITH UNITS *
 *****************************/

// OBJECT VERSION

const divmod = ({from, to, ratio}) => (o) => {
  console.log("{from, to, ratio}) => (o)",from,to,ratio,o);
  let quotient  = Math.trunc(o[from]/ratio);
  let remainder = o[from]-ratio*quotient;
  return Object.assign(
    Object.assign({},o),
    {
      [from]: remainder,
      [to]  : quotient,
    }
  )
};
let ap = (fn) => (h) => { h.push( fn( h[h.length-1] ) ); return h};
{


  let h = [{days:1001}];
  [ 
    {from:'days', to:'years',  ratio: 365},
    {from:'days', to:'months', ratio:  30},
  ].forEach((t)=>{
      ap(divmod(t))(h);
      console.table(h)
   }
  )


}

// CONCATENATIVE VERSION

let isFunction = (x) => typeof x === 'function';
// and the same but concatenative style

const qr = (h) => {
  let b = h.pop();
  let a = h.pop();
  let quotient  = Math.floor(a/b); 
  let remainder = a  -  b * quotient;
  h.push(quotient);
  h.push(remainder);
}


function evconc(code){ // evaluate concatenative code
  let h=[];
  code.forEach(cond(
    isFunction, (fn)  => { fn(h); },      // evaluate functions
    otherwise , (arg) => { h.push(arg); } // push other stuff
  ));
  return h;
}

ymd = [
  365, qr,
   30, qr,
];

ymdhms = [
  365*24*60*60, qr,
   30*24*60*60, qr,
      24*60*60, qr,
         60*60, qr,
            60, qr,
];

console.log("[1001, ...ymd]", evconc([1001, ...ymd]));
269768992
console.log("[269768992, ...ymdhms]", evconc([269768992, ...ymdhms]));
