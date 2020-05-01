/**************************************************
 * Gemansam funktionalitet för övningar i modul 2 *
 **************************************************/

// lägg till resultat överst i elementet #output 
function display(html, doAppend){
  if(doAppend){
    document.getElementById("output").innerHTML= 
      document.getElementById("output").innerHTML + "<div>"+html+"</div>";
  }else{
    document.getElementById("output").innerHTML= 
      "<div>"+html+"</div>" + document.getElementById("output").innerHTML;
    }
}

// returnera ett slumpvis valt element från en array
function pickRandom(xs){
  let idx = Math.floor( xs.length * Math.random() );
  return xs[ idx ];
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



//const rnd = (n) => typeof n == 'undefined'? Math.random(): Math.floor( n * Math.random() );

// no  argument: return a float between 0 and 1 non-inclusive
// one int argument n: return a random integer between 0 and n non-inclusive
// two int arguments a, b: return a random integer between a inclusive and b non-inclusive
const rnd = (...xs) => [_rnd0, _rnd1, _rnd2][xs.length](...xs); // dispatch on numer of args
  const _rnd0 = ( ) => Math.random(); 
  const _rnd1 = (n) => Math.floor( n * _rnd0() );
  const _rnd2 = (a,b) => a + _rnd1(b-a);
   

// pick a random element from all args
const pick = (...xs) => xs[Math.floor( xs.length * Math.random() )];

// get the value of an element given the id
// if second arg give, set the value
function id2val(id,x){
  if(typeof x==='undefined'){
    return document.getElementById(id).value;
  }else{
    document.getElementById(id).value = x;
  }
}

// get the elem for an id
const id2elem = (id) => document.getElementById(id);
// get the elem for an query
const query2elem = (q) => document.querySelector(q);
// get all elems for an query
// return a real Array for convenience, not a node list
const query2elems = (q) => document.querySelectorAll(q);



// apply an action f n times to 0 or more args
// this is only meaningful if f has side-effects
function times(n, f, ...args){
  if(n<0) throw `reapeat called with negative argument ${n}`;
  while(n-- >0) f(...args);
}

// takes a function and some args and fixes the args to the function
// använder traditionell funktionsform, så att `this` för callbacks funkar
function partial(f, ...xs){
  return function(...ys){
    return f(...xs, ...ys);
  }
}

