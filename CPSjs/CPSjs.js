/* 
Tuple
APPLY
SUM
MOD
EQ
SING
PLUR
*/

//Take a value into CPS
const Tuple = (...xs) => K => K(...xs);
const ID = (...xs) => Tuple(...xs);
const MUL = (y) => (x) => Tuple(x * y);

const Succ = Tuple;
const Fail = _ => null; 

const APPLY = (...fs) => (...xs) => {
  let flen = fs.length;
  let xlen = xs.length;
  let len = Math.max(flen,xlen);
  let ys = [];
  for(let i = 0; i < len; i++) r.push(fs[i%flen](xs[i%xlen]));
  return Tuple(...ys);
}

const SUM = (...xs) => {
  let r = 0;
  for(let i = 0; i<xs.length; i++) r += xs[i];
  return Tuple(r);
}

const MOD = (n) => (m) => {
  let quotient = Math.trunc(m/n);
  let modulo = m - n*quotient;
  return Tuple(modulo);
}

const EQ = (y) => (x) => x===y? SUCC(x): FAIL() );

const IS = (mx) => Tuple( mx !== null )



// take a value back from CPS
const SING  = (...xs)     => {
  if(xs.length !== 1) throw `SING expects one value, but got "${xs}"`;
  return xs[0];
};
// take multiple values back from CPS
const PLUR  = (...xs) => xs;


