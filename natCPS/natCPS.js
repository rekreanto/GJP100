

/* 
Tup
APPLY
SUM
MOD
EQ
SING
PLUR
*/

//Take a value into CPS
const Tup = (...xs) => K => K(...xs);
 

const ID  = (...xs) => Tup(...xs);
const MUL = (y) => (x) => Tup(x * y);
const id  = (x) => x;
const mul = (y) => (x) => (x * y);

const APPLY = (...fs) => (...xs) => {
  let flen = fs.length;
  let xlen = xs.length;
  let len = Math.max(flen,xlen);
  let rs = [];
  for(let i = 0; i < len; i++) rs.push( fs[i%flen]( xs[i%xlen] ) );
  return Tup(...rs);
}

const SUM = (...xs) => {
  let r = 0;
  for(let i = 0; i<xs.length; i++) r += xs[i];
  return Tup(r);
}

const MOD = (n) => (m) => {
  let quotient = Math.trunc(m/n);
  let modulo = m - n*quotient;
  return Tup(modulo);
}

const EQ = (y) => (x) => Tup(x===y);




// take a value back from CPS
const SING  = (...xs)     => {
  if(xs.length !== 1) throw `SING expects one value, but got "${xs}"`;
  return xs[0];
};
// take multiple values back from CPS
const PLUR  = (...xs) => xs;


