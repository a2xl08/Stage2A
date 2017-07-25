// couleur du fond
// Il faut la récupérer dans le css
var backgroundcolor = "rgb(0, 6, 35)";

// Couleur des liens
var linkcolor;

// Couleur du lobbyist choisi
var usercolor;
var usercolorhalo;

// Couleur des alliés
var allycolor;
var allycolorhalo;

// Couleur des ennemis
var ennemycolor;
var ennemycolorhalo;

// Si aucun lobyist choisi
var supportcolor;
var opposecolor;
var supportcolorhalo;
var opposecolorhalo;

// Couleur des actionnaires
var actcolor;
var linkactcolor;

// Les fonctions qui renvoient les couleurs
var colornode;
var colorhalo;
var sectorcolor;
var sectorhalo;
var valToOpacity

function setcolor(){
  linkcolor = "rgba(130,130,70,0.8)";
  usercolor = "rgb(0,255,100)";
  usercolorhalo = "rgba(0,255,100,0.3)";
  allycolor = "rgb(0,165,255)";
  allycolorhalo = "rgba(0,165,255,0.3)";
  ennemycolor = "rgb(255,165,0)";
  ennemycolorhalo = "rgba(255,165,0,0.3)";
  supportcolor = "rgb(0,255,0)";
  opposecolor = "rgb(255,0,0)";
  supportcolorhalo = "rgba(0,255,0,0.3)";
  opposecolorhalo = "rgba(255,0,0,0.3)";
  actcolor = "rgba(155, 155, 155, 0.3)";
  linkactcolor = "rgb(150,150,150)"

  // La fonction qui à un noeud associe sa couleur
  colornode = function (d){
    if (lobyist && lobyist[theme]){
      // Si un lobyist est choisi par l'utilisateur
      // On représente selon alliés/ennemis
      if (d===lobyist){
        return usercolor;
      } else if (d[theme]===lobyist[theme]) {
        return allycolor;
      } else {
        return ennemycolor;
      }
    } else {
      // Sinon, POUR en vert OPPOSE en gris
      if (d[theme]==="POUR"){
        return supportcolor;
      } else {
        return opposecolor;
      }
    }
    
  }

  // La fonction qui à un noeud associe la couleur du halo
  colorhalo = function (d){
    if (lobyist && lobyist[theme]){
      // Si un lobyist est choisi par l'utilisateur
      // On représente selon alliés/ennemis
      if (d===lobyist){
        return usercolorhalo;
      } else if (d[theme]===lobyist[theme]) {
        return allycolorhalo;
      } else {
        return ennemycolorhalo;
      }
    } else {
      // Sinon, POUR en vert CONTRE en gris
      if (d[theme]==="POUR"){
        return supportcolorhalo;
      } else {
        return opposecolorhalo;
      }
    }
  }

  valToOpacity = function (d){
    if (d["Valeur (supp à%)"]<=1){
      return 0.15
    } else if (d["Valeur (supp à%)"]<=10){
      return 0.4
    } else if (d["Valeur (supp à%)"]<=50){
      return 0.8
    } else {
      return 1;
    }
  }
}

function setMeanSectorColors (data){
  sectorcolor = function (d){
    if (lobyist && lobyist[theme]){
      // Récupération des composantes RGB
      var color1 = allycolor.split("(")[1].split(")")[0].split(",").map(Number);
      var color2 = ennemycolor.split("(")[1].split(")")[0].split(",").map(Number);
      var coefsup = (d.value["POUR"])/(d.value["TOTAL"]);
      var coefopp = (d.value["CONTRE"])/(d.value["TOTAL"]);
      if (lobyist[theme]==="POUR"){
        var red = Math.round(coefsup*color1[0] + coefopp*color2[0]);
        var green = Math.round(coefsup*color1[1] + coefopp*color2[1]);
        var blue = Math.round(coefsup*color1[2] + coefopp*color2[2]);
        return "rgb("+([red,green,blue].join(","))+")";
      } else {
        var red = Math.round(coefopp*color1[0] + coefsup*color2[0]);
        var green = Math.round(coefopp*color1[1] + coefsup*color2[1]);
        var blue = Math.round(coefopp*color1[2] + coefsup*color2[2]);
        return "rgb("+([red,green,blue].join(","))+")";
      }
    } else {
      var color1 = supportcolor.split("(")[1].split(")")[0].split(",").map(Number);
      var color2 = opposecolor.split("(")[1].split(")")[0].split(",").map(Number);
      var coefsup = (d.value["POUR"])/(d.value["TOTAL"]);
      var coefopp = (d.value["CONTRE"])/(d.value["TOTAL"]);
      var red = Math.round(coefsup*color1[0] + coefopp*color2[0]);
      var green = Math.round(coefsup*color1[1] + coefopp*color2[1]);
      var blue = Math.round(coefsup*color1[2] + coefopp*color2[2]);
      return "rgb("+([red,green,blue].join(","))+")";
    }
  }

  sectorhalo = function (d){
    var color = sectorcolor(d).split("(")[1].split(")")[0].split(",");
    return "rgba("+color.join(",")+",0.3)";
  }
}