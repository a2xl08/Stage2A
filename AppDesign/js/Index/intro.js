// Largeur de la plage de scroll en pixels
var scrollheight = 870;
// Durée des transitions
CONST.TIMETRANSITION = 500;
// le scrollborder de alpha
CONST.ALPHALIM = 0.025;

// Une fonction utile pour les interpolations
function abTo01(a,b,x){
  return (x-a)/(b-a);
}

// Création des données de la figure initiale
CONST.FIGINIT = {};
CONST.FIGINIT.TITRE = {
  x: function (){
         var textpos = this.getBoundingClientRect();
         return CONST.VUE.WIDTH/2 - (textpos.right - textpos.left)/2
       }, 
  y: CONST.VUE.HEIGHT/2, 
  class: "Initfig Titre",
  text: "Vi(c)e Organique"
}
CONST.FIGINIT.POINTS = [
  {
    x: 0.5*CONST.VUE.WIDTH,
    y: 0.75*CONST.VUE.HEIGHT,
    dx: 30,
    dy: -20,
    text: "Lobby"
  }, 
  {
    x: 0.25*CONST.VUE.WIDTH,
    y: 0.66*CONST.VUE.HEIGHT,
    dx: 60,
    dy: -5,
    text: "Réseau"
  }, 
  {
    x: 0.45*CONST.VUE.WIDTH,
    y: 0.3*CONST.VUE.HEIGHT,
    dx: 0,
    dy: 10,
    text: "Climat"
  }, 
  {
    x: 0.7*CONST.VUE.WIDTH,
    y: 0.69*CONST.VUE.HEIGHT,
    dx: -5,
    dy: -5,
    text: "Europe"
  }
];


function createInitFigure (){
  CONST.FIGINIT.TITRE.D3 = svg.append("text")
    .attr("class", CONST.FIGINIT.TITRE.class)
    .text(CONST.FIGINIT.TITRE.text)
  CONST.FIGINIT.TITRE.D3
    .attr("x", CONST.FIGINIT.TITRE.x)
    .attr("y", CONST.FIGINIT.TITRE.y)
    .attr("opacity", 0)
  CONST.FIGINIT.POINTS.forEach(function (p){
    p.D3 = svg.append("text")
          .text(p.text)
          .attr("class", "Initfig texte")
          .attr("x", p.x)
          .attr("y", p.y)
          .attr("opacity", 0)
  })
  for (var i=0; i<4; i++){
    for (var j=i+1; j<4; j++){
      svg.append("line")
        .attr("class", "Initfig")
        .attr("opacity", 0)
        .attr("x1", CONST.FIGINIT.POINTS[i].x+CONST.FIGINIT.POINTS[i].dx)
        .attr("x2", CONST.FIGINIT.POINTS[j].x+CONST.FIGINIT.POINTS[j].dx)
        .attr("y1", CONST.FIGINIT.POINTS[i].y+CONST.FIGINIT.POINTS[i].dy)
        .attr("y2", CONST.FIGINIT.POINTS[j].y+CONST.FIGINIT.POINTS[j].dy)
    }
  }
  CONST.FIGINIT.LINES = {D3: svg.selectAll("line.Initfig")};

}

function displayInitFigure (){
  if (document.body.scrollTop===0){
    createInitFigure();

    d3.selectAll(".Initfig")
      .transition()
      .duration(1000)
      .attr("opacity", 1);
  } else {
    if (CONST.FIGINIT.TITRE.D3.attr("opacity") === "1"){
      setTimeout( function (){d3.selectAll(".Initfig").remove();}, 1200 )
    }
    // On n'affiche pas le texte SCROLL
    d3.select(window).on("click", function (){})

    d3.selectAll(".Initfig")
      .transition()
      .duration(1000)
      .attr("opacity", 0);
  }
}

// Création du texte SCROLL
CONST.SCROLL = {
  text: "SCROLL !",
  x: 0*CONST.VUE.WIDTH,
  y: 0.6*CONST.VUE.HEIGHT
};
CONST.SCROLL.D3 = svg.append("text")
                    .attr("class", "scroll")
                    .text(CONST.SCROLL.text)
                    .attr("x", CONST.SCROLL.x)
                    .attr("y", CONST.SCROLL.y)
                    // 1138 est la taille de VUE sur mon navigateur en plein écran, dans ce cas -> taille 200
                    .attr("font-size", Math.round(200*CONST.VUE.WIDTH/1138)+"px")
                    .attr("opacity", 0)

d3.select(window).on("click", function (){
  if (document.body.scrollTop===0){
    CONST.SCROLL.D3.attr("opacity", 1);
  }
  d3.select(window).on("click", function (){})
  d3.select(window).on("scroll.scroller", function (){
    CONST.SCROLL.D3.remove();
    position();
  })
})


// Section 1 : Données sur les éléments de positionnement
// de la Fiche
CONST.FICHE = {};
CONST.FICHE.width = CONST.VUE.WIDTH; 
CONST.FICHE.height = 1.3*CONST.VUE.HEIGHT;  // A ajuster pour la taille de la fiche
CONST.FICHE.COMMISSION = {};
CONST.FICHE.COMMISSION.dx = 0.5*CONST.FICHE.width;
CONST.FICHE.COMMISSION.dy = 0.2*CONST.FICHE.height;
CONST.FICHE.COMMISSION.width = 200*CONST.FICHE.height/763; // oui c'est bien height !
CONST.FICHE.COMMISSION.height = 200*CONST.FICHE.height/763;
CONST.FICHE.CONSULTATION = {};
CONST.FICHE.CONSULTATION.dx = 0.5*CONST.FICHE.width;
CONST.FICHE.CONSULTATION.dy = 0.37*CONST.FICHE.height;
CONST.FICHE.CONSULTATION.width = CONST.FICHE.COMMISSION.width;
CONST.FICHE.CONSULTATION.height = CONST.FICHE.COMMISSION.height;
CONST.FICHE.FLECHE = {};
CONST.FICHE.FLECHE.dx = 0.5*CONST.FICHE.width;
CONST.FICHE.FLECHE.dy = 0.57*CONST.FICHE.height;
CONST.FICHE.FLECHE.width = CONST.FICHE.COMMISSION.width;
CONST.FICHE.FLECHE.height = CONST.FICHE.COMMISSION.height;
CONST.FICHE.ORGS = {};
CONST.FICHE.ORGS.dx = 0.5*CONST.FICHE.width;
CONST.FICHE.ORGS.dy = 0.76*CONST.FICHE.height;
CONST.FICHE.ORGS.width = 2*CONST.FICHE.COMMISSION.width;
CONST.FICHE.ORGS.height = 2*CONST.FICHE.COMMISSION.height;


function setupSec1(){
  CONST.FICHE.D3 = svg.append("g")
      .attr("class", "sec1")
      //.attr("opacity", 0)
  CONST.FICHE.D3.append("image")
      .attr("class", "fiche")
      .attr("x", 0)
      .attr("y", CONST.VUE.HEIGHT)
      .attr("href", "img/fiche.svg")
      .attr("width", CONST.FICHE.width)
      .attr("height", CONST.FICHE.height)
  CONST.FICHE.D3.append("image")
      .attr("class", "commission")
      .attr("x", CONST.FICHE.COMMISSION.dx - 0.5*CONST.FICHE.COMMISSION.width)
      .attr("y", CONST.FICHE.COMMISSION.dy - 0.5*CONST.FICHE.COMMISSION.height)
      .attr("href", "img/Commission.svg")
      .attr("width", CONST.FICHE.COMMISSION.width)
      .attr("height", CONST.FICHE.COMMISSION.height)
      .attr("opacity", 0);
  CONST.FICHE.D3.append("image")
      .attr("class", "consultation")
      .attr("x", CONST.FICHE.CONSULTATION.dx - 0.5*CONST.FICHE.CONSULTATION.width)
      .attr("y", CONST.FICHE.CONSULTATION.dy - 0.5*CONST.FICHE.CONSULTATION.height)
      .attr("href", "img/Consultation.svg")
      .attr("width", CONST.FICHE.CONSULTATION.width)
      .attr("height", CONST.FICHE.CONSULTATION.height)
      .attr("opacity", 0);
  CONST.FICHE.D3.append("image")
      .attr("class", "fleche")
      .attr("x", CONST.FICHE.FLECHE.dx - 0.5*CONST.FICHE.FLECHE.width)
      .attr("y", CONST.FICHE.FLECHE.dy - 0.5*CONST.FICHE.FLECHE.height)
      .attr("href", "img/fleche.svg")
      .attr("width", CONST.FICHE.FLECHE.width)
      .attr("height", CONST.FICHE.FLECHE.height)
      .attr("opacity", 0);
  CONST.FICHE.D3.append("image")
      .attr("class", "organisation")
      .attr("x", CONST.FICHE.ORGS.dx - 0.5*CONST.FICHE.ORGS.width)
      .attr("y", CONST.FICHE.ORGS.dy - 0.5*CONST.FICHE.ORGS.height)
      .attr("href", "img/Organisations.svg")
      .attr("width", CONST.FICHE.ORGS.width)
      .attr("height", CONST.FICHE.ORGS.height)
      .attr("opacity", 0);
}
setupSec1();

function manageFiche (pos){
  var startsection = sectionPositions[0];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 1
  var alphasteps = [0,0.33,0.66,1]
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure qu'il ne reste plus rien
    CONST.FICHE.D3.selectAll("image").attr("opacity", 0);
  } else if (alpha<=alphasteps[1]){
    var beta = abTo01(0,alphasteps[1],alpha)
    // On déplace la fiche
    CONST.FICHE.D3.select("image.fiche")
                    .transition()
                    .duration(30)
                    .attr("y", (1-beta)*CONST.VUE.HEIGHT )
                    .attr("opacity", 1);
    // On s'assure que l'élément suivant est invisible
    CONST.FICHE.D3.select("image.commission")
                    .transition()
                    .duration(30)
                    .attr("opacity", 0);
  } else if (alpha<=alphasteps[2]){
    // On s'assure que le précédent est visible
    CONST.FICHE.D3.select("image.fiche")
                    .transition()
                    .duration(30)
                    .attr("y", 0 );
    // On affiche commission Européenne
    var beta = abTo01(alphasteps[1], alphasteps[2], alpha);
    CONST.FICHE.D3.select("image.commission")
                    .transition()
                    .duration(30)
                    .attr("opacity", beta);
    // On s'assure que le suivant est invisible
    CONST.FICHE.D3.select("image.consultation")
                    .transition()
                    .duration(30)
                    .attr("opacity", 0);
  } else if (alpha<=1){
    // On s'assure que le précédent est visible
    CONST.FICHE.D3.select("image.commission")
                    .transition()
                    .duration(30)
                    .attr("opacity", 1);
    // On affiche consultation
    var beta = abTo01(alphasteps[2],1,alpha);
    CONST.FICHE.D3.select("image.consultation")
                    .transition()
                    .duration(30)
                    .attr("opacity", beta);
  } else {
    // On s'assure que le précédent est visible
    CONST.FICHE.D3.select("image.consultation")
                    .transition()
                    .duration(30)
                    .attr("opacity", 1);
  }
}