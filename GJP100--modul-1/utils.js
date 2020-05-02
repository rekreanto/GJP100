/**************************************************
 * Gemansam funktionalitet för övningar i modul 1 *
 **************************************************/

// lägg till resultat överst i elementet #output 
function display(html){
  document.getElementById("output").innerHTML= 
    "<div>"+html+"</div>" + document.getElementById("output").innerHTML;
}


// zippa ihop två arrayer 
// zip :: ([a],[b]) => [[a,b]]
let zip = (xs,ys) => xs.map( (x, i) => [x, ys[i]] );

// applies a functio to a DOM element with a value and updates it with the result
// applicable e.g. to input[type=text] and textarea elements
function applyToValue(f,id){
  let elem = document.getElementById(id);
  elem.value = f(elem.value);
}





/**********
 * RANDOM *
 **********/

// no      argument: return a float between 0 inclusive and 1 non-inclusive
// one int argument n: return a random integer between 0 and n non-inclusive
// two int arguments a, b: return a random integer between a inclusive and b non-inclusive
const rnd = (...xs) => [_rnd0, _rnd1, _rnd2][xs.length](...xs); // dispatch on numer of args
  const _rnd0 = ( ) => Math.random(); 
  const _rnd1 = (n) => Math.floor( n * _rnd0() );
  const _rnd2 = (a,b) => a + _rnd1(b-a);

// pick a random element from all args
const pick = (...xs) => xs[Math.floor( xs.length * Math.random() )];



/********************
 * DOM MANIPULATION *
 ********************/

// one arg => returns the value of the elem corresponding to the id
// two args => sets the value of the elem corresponding to the id
const id2val = (...xs) => [,id2val_1,id2val_2][xs.length](...xs);
  const id2val_1 = (id) => document.getElementById(id).value;
  const id2val_2 = (id,val) => { document.getElementById(id).value = x; };

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query
// return a real Array for convenience, not a node list
const query2elems = (q) => Array.from( document.querySelectorAll(q) );



// apply an action f n times to 0 or more args
// this is only meaningful if f has side-effects
function times(n, f, ...args){
  if(n<0) throw `reapeat called with negative argument ${n}`;
  while(n-- >0) f(...args);
}

// takes a function and some args and
// retuns a function with the args fixed
// when applied with 0 or more args these are used after the fixed arguments
const fx = (f, ...xs) => (...ys) => f(...xs, ...ys);


