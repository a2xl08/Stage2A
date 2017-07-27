/* Fonctions utilitaires */
// tire aléatoirement un nombre entre `min` et `max`
var rand  = function(min , max){ return Math.random()*max + min; };
// tire aléatoirement un élément du tableau `arr`. 
var randPick = function(arr){ return arr[Math.round(rand(0, arr.length-1))]; };
// retourne aléatoirement 1 ou -1
var randSign = function(){ return Math.random()>0.5 ? 1:-1 };

var flattenArray = function(arrays){
  return arrays.reduce(function(a,b){ return a.concat(b); });
};

var transform = function(pt){
  return 'translate('+pt.x+','+pt.y+')';
};

var revtransform = function(string){
  var x = Number(string.split("(")[1].split(")")[0].split(",")[0]);
  var y = Number(string.split("(")[1].split(")")[0].split(",")[1]);
  return {x: x, y: y};
}

var copy = function(o){
  var _out, v, _key;
  _out = Array.isArray(o) ? [] : {};
  for (_key in o) {
    v = o[_key];
    _out[_key] = (typeof v === "object") ? copy(v) : v;
  }
  return _out;
};

var Utils = {
  copy: copy,
  sign: function(n){ return n >= 0 ? 1 : -1; },
  rand: {
    number: rand,
    pick: randPick,
    sign: randSign,
  },
  transform: transform,
  revtransform: revtransform,
  flattenArray: flattenArray,
  fade: fade
};
