/* Pour gérer les couleurs d'affichages,
modifier les valeurs de couleurs dans ce script.
La couleur de fond se modifie dans le fichier styles.css*/


// Couleur d'un élément qui s'efface au survol d'un autre
var colormousenoton;
var colorlastanswer = "rgb(0, 255, 165)";

// Couleurs des diques en fonction de l'indice
function color (i){
  switch (i){
    case 0: return "rgb(80, 146, 162)";
    case 1: return "rgb(149, 135, 74)";
    case 2: return "rgb(115, 141, 118)";
    case 3: return "rgb(184, 130, 29)";
    case 4: return "rgb(97, 144, 140)";
    case 5: return "rgb(166, 133, 51)";
    default: return "rgb(132, 138, 96)";
  }
}

// Couleurs des noeuds de la figure initiale
function colorfiginit (opacity){
  return "rgba(80,120,130,"+opacity+")";
}

function colorlinkfiginit(){
  return "rgba(10,10,34,0.4)";
}
