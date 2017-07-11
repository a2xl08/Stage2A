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
CONST.FICHE.height = 1.2*CONST.VUE.HEIGHT;  // A ajuster pour la taille de la fiche
// L'écart de taille : utile pour le scroll
var deltay = CONST.FICHE.height - CONST.VUE.HEIGHT;
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


function setupFiche(){
  CONST.FICHE.D3 = svg.append("g")
      .attr("class", "FICHE")
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
setupFiche();

// Création du badge
CONST.BADGE = {};
CONST.BADGE.RAPPORT = 225/291;
CONST.BADGE.width = 0.2*CONST.VUE.WIDTH;
CONST.BADGE.height = 1/CONST.BADGE.RAPPORT * CONST.BADGE.width;
CONST.BADGE.x = 0.5*CONST.VUE.WIDTH - 0.5*CONST.BADGE.width;
CONST.BADGE.y = 0.55*CONST.VUE.HEIGHT;  // Initialement en 1.1*CONST.VUE.HEIGHT
var deltay2 = 1.1*CONST.VUE.HEIGHT - CONST.BADGE.y;
CONST.BADGE.TEXT = {};
CONST.BADGE.TEXT.texts = ["Vous", "êtes", "lobbyiste"];
CONST.BADGE.TEXT.textmargin = 40;
CONST.BADGE.TEXT.dx = 0.5*CONST.BADGE.width;
CONST.BADGE.TEXT.dy = 0.3*CONST.BADGE.height;
CONST.BADGE.POINT = {};
CONST.BADGE.POINT.radius = 5;
CONST.BADGE.POINT.dx = 0.5*CONST.BADGE.width;
CONST.BADGE.POINT.dy = 0.85*CONST.BADGE.height;

// Initialise le badge
function setupBadge(){
  CONST.BADGE.D3 = svg.append("g")
                      .attr("class", "BADGE");
  CONST.BADGE.D3.append("image")
                .attr("class", "badge")
                .attr("x", CONST.BADGE.x)
                .attr("y", deltay2+CONST.BADGE.y)
                .attr("href", "img/badge.svg")
                .attr("width", CONST.BADGE.width)
                .attr("height", CONST.BADGE.height)
  CONST.BADGE.D3.append("text")
                .attr("x", CONST.BADGE.TEXT.dx + Number(CONST.BADGE.D3.select(".badge").attr("x")))
                .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
  for (var i=0; i<CONST.BADGE.TEXT.texts.length; i++){
    CONST.BADGE.D3.select("text").append("tspan")
                    .text(CONST.BADGE.TEXT.texts[i])
                    .attr("x", function (){
                      var textpos = this.getBoundingClientRect();
                      return -0.5*(textpos.right-textpos.left) + CONST.BADGE.TEXT.dx + Number(CONST.BADGE.D3.select(".badge").attr("x"));
                    })
                    .attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
  }
  CONST.BADGE.D3.append("circle")
                .attr("class", "point")
                .attr("cx", CONST.BADGE.POINT.dx + Number(CONST.BADGE.D3.select(".badge").attr("x")))
                .attr("cy", CONST.BADGE.POINT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
                .attr("r", CONST.BADGE.POINT.radius);
}
setupBadge();

CONST.QUEST = {};
CONST.QUEST.FICHE = {};
CONST.QUEST.FICHE.width = CONST.VUE.WIDTH;
CONST.QUEST.FICHE.height = 1.9*CONST.VUE.HEIGHT;
// Destinée à accueillir les sélections vers les parts
CONST.QUEST.ARCS = [];

// On crée la fiche pour le quesionnaire
function setupFicheQuestion (){
  CONST.QUEST.D3 = svg.append("g")
                    .attr("class", "quest");
  CONST.QUEST.D3.append("image")
                .attr("class", "fiche")
                .attr("x", 0)
                .attr("y", CONST.VUE.HEIGHT)
                .attr("href", "img/fiche.svg")
                .attr("width", CONST.QUEST.FICHE.width)
                .attr("height", CONST.QUEST.FICHE.height);
}
// L'appel à cette fonction se fait au cours su chargement des données dans importdata.js

function moveFiche(y){
  CONST.FICHE.D3.select(".fiche")
                  .attr("y", y);
  CONST.FICHE.D3.select(".commission")
                  .attr("y", y + CONST.FICHE.COMMISSION.dy - 0.5*CONST.FICHE.COMMISSION.height);
  CONST.FICHE.D3.select(".consultation")
                  .attr("y", y + CONST.FICHE.CONSULTATION.dy - 0.5*CONST.FICHE.CONSULTATION.height);
  CONST.FICHE.D3.select(".fleche")
                  .attr("y", y + CONST.FICHE.FLECHE.dy - 0.5*CONST.FICHE.FLECHE.height);
  CONST.FICHE.D3.select(".organisation")
                  .attr("y", y + CONST.FICHE.ORGS.dy - 0.5*CONST.FICHE.ORGS.height);
}

function setFicheOpacity(classe, e){
  CONST.FICHE.D3.select(classe).attr("opacity", e);
}

function moveBadge(y){
  CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y + y);
  CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
  CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
  })
  CONST.BADGE.D3.select(".point")
                  .attr("cy", CONST.BADGE.POINT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
}

// On gère la fiche aux sections 1 et 2
function manageFicheSec1 (pos){
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
    setFicheOpacity("image", 0);
  } else if (alpha<=alphasteps[1]){
    var beta = abTo01(0,alphasteps[1],alpha)
    // On déplace la fiche
    moveFiche((1-beta)*CONST.VUE.HEIGHT);
    setFicheOpacity("image", 1);
    // On s'assure que l'élément suivant est invisible
    setFicheOpacity("image.commission", 0);
  } else if (alpha<=alphasteps[2]){
    // On s'assure que le précédent est visible
    moveFiche(0);
    // On affiche commission Européenne
    var beta = abTo01(alphasteps[1], alphasteps[2], alpha);
    setFicheOpacity("image.commission", beta);
    // On s'assure que le suivant est invisible
    setFicheOpacity("image.consultation", 0);
  } else if (alpha<=1){
    // On s'assure que le précédent est visible
    setFicheOpacity("image.commission", 1);
    // On affiche consultation
    var beta = abTo01(alphasteps[2],1,alpha);
    setFicheOpacity("image.consultation", beta);
  } else {
    // On s'assure que le précédent est visible
    setFicheOpacity("image.consultation", 1);
  }
}

function manageFicheSec2 (pos){
  var startsection = sectionPositions[1];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 2
  var alphasteps = [0,0.4,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure que la page est au bon endroit
    moveFiche(0);             
  } else if (alpha<=alphasteps[1]){
    // Utilisation de l'écart de taille deltay pour la position de la fiche
    var beta = abTo01(0,alphasteps[1],alpha);
    moveFiche(-beta*deltay);
    // On s'assure que les suivants sont invisibles
    setFicheOpacity(".fleche", 0);
    setFicheOpacity(".organisation", 0);
  } else if (alpha<=1){
    // On s'assure que la fiche est bien positionnée
    moveFiche(-deltay)
    // On affiche les flèches et les cercles
    var beta = abTo01(alphasteps[1],1,alpha);
    setFicheOpacity(".fleche", beta);
    setFicheOpacity(".organisation", beta);
  } else {
    // On s'assure que les éléments de fin sont visibles
    setFicheOpacity(".fleche", 1);
    setFicheOpacity(".organisation", 1)
  }
}

// On gère la fiche et le badge aux sections 3 et 4
function manageFicheBadgeSec3 (pos){
  var startsection = sectionPositions[2];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 3
  var alphasteps = [0,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On restaure l'état initial, position de la fiche et du badge
    moveFiche(-deltay);
  } else if (alpha<=1){
    // On scroll la fiche et le badge
    moveFiche(-deltay-deltay2*alpha)
    moveBadge(deltay2*(1-alpha));
  } else {
    // On s'assure que la fiche et le badge sont au bon endroit
    // On scroll la fiche et le badge
    moveFiche(-deltay-deltay2)
        // Attention, c'est l'attribut y de .badge qui sert de référence ici, pas de deltay2 partout !
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
    }) // On ne réinitialise pas le point car ça fait foirer la section qui suit
  }
}

function moveBlackPoint (move){
    if (move===0){ // Le point est la fiche, on le ramène sur le badge
      CONST.BADGE.D3.select(".point")
                  .transition()
                  .duration(CONST.TIMETRANSITION)
                  .attr("cx", CONST.BADGE.POINT.dx + Number(CONST.BADGE.D3.select(".badge").attr("x")))
                  .attr("cy", CONST.BADGE.POINT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
                  .attr("r", 5);
    } else if (move===1){ // Le point est sur le badge, on l'emmene sur la fiche
      CONST.BADGE.D3.select(".point")
                  .transition()
                  .duration(7*CONST.TIMETRANSITION)
                  .attr("cx", Number(CONST.FICHE.D3.select(".fiche").attr("x"))+0.5*CONST.FICHE.width)
                  .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height)
                  .attr("r", 5);
    } else {
      console.log("erreur sur l'argument r, relisez le code !")
    }
}

// Transition section 3 - 4
function manageBadgeSec4 (){
  if (prevIndex===3 && currentIndex===4){
    // On déplace le point sur la fiche
    moveBlackPoint(1);
    // On écrit la fonction
    d3.select("p.fonction").style("display", "block").style("color", colorlastanswer);
  } else if (prevIndex===4 && currentIndex===3){
    // On déplace le point sur le badge
    moveBlackPoint(0);
    // On retire le answers
    d3.select("p.fonction").style("display", "none");
  }
}