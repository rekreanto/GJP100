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

// produce a random integer between and the argument
const rnd = (n) => Math.floor( n * Math.random() );

// get the value of an element given the id
// if second arg give, set the value
function val(id,x){
  if(typeof x==='undefined'){
    return document.getElementById(id).value;
  }else{
    document.getElementById(id).value = x;
  }
}

// get the elem for an id
function elem(id){
  return document.getElementById(id);
}