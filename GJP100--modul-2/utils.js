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

