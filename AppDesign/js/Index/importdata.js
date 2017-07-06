// Les constantes, noter que pour certaines, leur valeur n'est pas encore connue
var CONST = {};

CONST.VUE = {};

var vue = document.getElementById("vue");
CONST.VUE.POSITION = vue.getBoundingClientRect();
CONST.VUE.PADDING = 5;

CONST.VUE.HEIGHT = vue.offsetHeight - 2 * CONST.VUE.PADDING;
CONST.VUE.WIDTH = vue.offsetWidth - 2 * CONST.VUE.PADDING;

var svg = d3.select("#vue")
        .append("svg")
        .attr("width", CONST.VUE.WIDTH)
        .attr("height", CONST.VUE.HEIGHT);
var pie = d3.pie();;
var nbthemes;
var themelist;
var alldatafiltre = [];
var datafiltre;
var piedata;
var piezeddata;
var arc;
var arcs;
var outerRadius = CONST.VUE.WIDTH/10;
var setDefaultTheme;
// Nombre de lobbyists restants
var nbloby;
// Tableau recensant les nbloby successifs : utile pour accéder aux éléments graphiques dont la référence a été perdue
var tabnbloby;
// Tableau référençant les thèmes : utile pour la transmission au réseau par URL
var idToTheme;

function getFullName(x){
  if (x["Nom2"]){
    return x["Nom2"]
  } else {
    return x["Nom1"]
  }
}

d3.csv("data/Noeud4juillet.csv", function (data){
  CONST.DATASET=data;
  datafiltre=CONST.DATASET.slice();
  alldatafiltre.push(datafiltre.slice());
  nbloby = CONST.DATASET.length
  tabnbloby=[nbloby];
  console.log(CONST.DATASET);


});