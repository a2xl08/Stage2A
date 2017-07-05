// Les constantes, noter que pour certaines, leur valeur n'est pas encore connue
var CONST = {};

CONST.VUE = {};

var vue = document.getElementById("vue");
CONST.VUE.POSITION = vue.getBoundingClientRect();
CONST.VUE.PADDING = 5;
// height
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

  // Faire ici l'initialisation de la vue
  // Renseigner les fonctions modifiant la vue en dehors

  // On cherche la liste des thèmes
  // Par élimination, chaque ligne correspond à 
  // l'élimination d'un attribut qui n'est pas un thème
  // climatique. 
  themelist = Object.keys(data[0]);
  themelist.splice(themelist.indexOf("ID"), 1);
  themelist.splice(themelist.indexOf("Lobby ID"), 1);
  themelist.splice(themelist.indexOf("Nom2"), 1);
  themelist.splice(themelist.indexOf("Nom1"), 1);
  themelist.splice(themelist.indexOf("Pays/Région"), 1);
  themelist.splice(themelist.indexOf("Type"), 1);
  themelist.splice(themelist.indexOf("Secteurs d’activité"), 1);
  themelist.splice(themelist.indexOf("Dépenses Lobby (€)"), 1);
  themelist.splice(themelist.indexOf("Personnes impliquées"), 1);
  themelist.splice(themelist.indexOf("Equivalent Temps plein"), 1);
  console.log(themelist);
  idToTheme = themelist.slice();

  
  // On cherche le nombre d'acteurs qui se sont prononcés sur chaque thème
  nbthemes = themelist.length;
  piedata = [];
  for (var i=0; i<nbthemes; i++){
    var somme = 0;
    for (var j=0; j<data.length; j++){
      // Utilisation du truthy falsy
      if (data[j][themelist[i]]){
        somme++;
      }
    }
    piedata[i] = somme;
  }
  console.log(piedata);

  piezeddata = pie(piedata);

  console.log(piezeddata);

  // Les parts de cammenbert sont des arcs d'innerRadius 0
  arc = d3.arc()
                .innerRadius(0)
                .outerRadius(outerRadius);

  arcs = svg.selectAll("g.arc")
          .data(piezeddata)
          .enter()
          .append("g")
          .attr("class", "arc")
          .attr("class", function (d,i){
            return "cercle"+i+" "+"loby"+0+" cercle"+i+"loby"+0;
          })
          .attr("transform", "translate("+(0.5*CONST.VUE.WIDTH)+", "+(0.5*CONST.VUE.HEIGHT)+")");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", function (d,i){
      return color(i);
    })

  arcs.append("text")
    .text(function (d,i){ return themelist[i]+" ("+piezeddata[i].data+" réponses)" })
    .style("font-size", 0.45*CONST.VUE.WIDTH/CONST.VUE.HEIGHT+"em")
    .attr("transform", function (d,i) {
      var string = "translate(";
      var angle = 0.5 * (piezeddata[i].startAngle + piezeddata[i].endAngle);
      var textpos = this.getBoundingClientRect();
      if (angle>Math.PI){
        string += (1.2 * outerRadius * Math.sin(angle) - textpos.right + textpos.left);
      } else {
        string += (1.2 * outerRadius * Math.sin(angle));
      }
      string += ', ';
      string += (-1.2 * outerRadius * Math.cos(angle));
      string += ")";
      return string;
    })

  // Cette fonction sert à réinitialiser la vue en cas de scroll brutal en arrière
  setDefaultTheme = function (){
    arcs.transition()
      .duration(30)
      .attr("transform", "translate("+(0.5*CONST.VUE.WIDTH)+", "+(0.5*CONST.VUE.HEIGHT)+")");

    arcs.selectAll("text")
      .transition()
      .duration(30)
      .attr("opacity", 1);
  }

});