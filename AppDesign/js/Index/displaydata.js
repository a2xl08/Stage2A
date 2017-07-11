/* 

Attention, les fonctions utilisées dans ce script
sont prévues pour s'exécuter après chargement
total de la page et des données dans CONST.DATASET
(appel à d3.csv asynchrone)

Ces fonctions seront appelées dans le scroller
au cours du scroll utilisateur

NE DEFINIR QUE DES VARIABLES ET DES FONCTIONS
NE RIEN EXECUTER ICI

*/

// Cette fonction ajuste la taille des disques en fonction de la donnée
function scalablesize (d){
  var max = tabnbloby[tabnbloby.length-1];
  return d/max+0.2
}

// Cette fonction est appelée pour positionner le texte
// Elle permet d'éviter les recoupements entre les dernières
// tranches de la pie. 
function coefeloign (d){
  if ((d.index>3) && (d.index!==piezeddata.length-1)){
    return 1.5 - 0.3*(d.index%2);
  } else {
    return 1.2;
  }
}

// Gestion du survol
// intselect correspond au numéro des cercles auxquels appliquer l'effet hoverize
function hoverize (intselect, alpha){
  var cercles = d3.selectAll("g.loby"+intselect+" path");
  if (alpha>=1){

    cercles.on("mouseover", function (d,i){
      var avirer = d3.selectAll("g:not(.cercle"+i+").loby"+intselect);
      avirer.transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("opacity", 0.3)

      avirer.select("path")
        .transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("fill", "gray");
    })

    cercles.on("mouseout", function (d,i){
      var avirer = d3.selectAll("g:not(.cercle"+i+").loby"+intselect);
      avirer.transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("opacity", 1)

      avirer.select("path")
        .transition()
        .duration(0.5*CONST.TIMETRANSITION)
        .attr("fill", function (d,j){
          if (j<i){
            return color(j);
          } else {
            return color(j+1);
          }
        });

    })

  } else {
    cercles.on("mouseover", function(){});
    cercles.on("mouseout", function(){});
  }
}



function manageSec5 (pos){
  var startsection = sectionPositions[4];
  var alpha = (pos - startsection)/scrollheight;
  console.log(alpha)
  // Définir ici les alphasteps de la section 5
  var alphasteps = [0,0.6,1];
  for (var i=0; i<alphasteps.length; i++){
    if ((Math.abs(alpha-alphasteps[i])<=CONST.ALPHALIM)){
      alpha = alphasteps[i];
    }
  }
  if (alpha<=0){
    // On s'assure que la fiche est invisible
    CONST.QUEST.D3.select("image").attr("y", CONST.VUE.HEIGHT);
    moveFiche(-deltay-deltay2);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height)
    // Le point suit la fiche
  } else if (alpha<=alphasteps[1]){
    // On déplace la fiche
    var beta = abTo01(0,alphasteps[1],alpha);
    CONST.QUEST.D3.select("image").attr("y", (1-beta)*CONST.VUE.HEIGHT);
    moveFiche(-deltay-deltay2-beta*CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y-beta*CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")));
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y")))
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height)
    // On rend invisible l'#answer p.position
    d3.select("p.position").style("display", "none");
    // On s'assure que les cercles sont invisibles
    CONST.QUEST.ARCS[0].attr("opacity", 0);
  } else if (alpha<=1){
    // On s'assure que la fiche est à sa place
    CONST.QUEST.D3.select("image").attr("y", 0);
    moveFiche(-deltay-deltay2-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select(".badge")
                  .attr("y", CONST.BADGE.y-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.select("text")
                  .attr("y", CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y"))-CONST.VUE.HEIGHT);
    CONST.BADGE.D3.selectAll("tspan").each(function (d,i){
      d3.select(this).attr("y", i*CONST.BADGE.TEXT.textmargin+CONST.BADGE.TEXT.dy + Number(CONST.BADGE.D3.select(".badge").attr("y"))-CONST.VUE.HEIGHT)
    }) 
    CONST.BADGE.D3.select(".point")
          .attr("cy", Number(CONST.FICHE.D3.select(".fiche").attr("y"))+0.8*CONST.FICHE.height-CONST.VUE.HEIGHT)
    // On rend visible les cercles de l'étape thème
    var beta = abTo01(alphasteps[1],1,alpha)
    CONST.QUEST.ARCS[0].attr("opacity", beta);
    // On rend visible l'#answers p.position
    d3.select("p.position").style("display", "block");
  } else {
    // On s'assure que les cercles sont bien visibles
    CONST.QUEST.ARCS[0].attr("opacity", 1);
  }
  hoverize(0,alpha);
}

